import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, macro, Node, Prefab, RigidBody2D, UITransform, Vec2, Vec3 } from 'cc';
import { AddEvent, EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { StateMachine } from './FiniteStateMachine/StateMachine';
import { IdleState } from './FiniteStateMachine/IdleState';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;
type MovePacket = (direction) => void;

@ccclass('Player')
export class Player extends Component {

    @property({ tooltip: "走路速度" })
    private readonly walkSpeed: number = 10; // 水平移動速度 (每秒)

    @property({ tooltip: "跳躍力道" })
    private readonly jumpForce: number = 20; // 跳躍力道

    @property(Prefab)
    private bullet: Prefab = null;

    @property({ tooltip: "面朝方向" })
    private faceToRight: boolean = false;

    public stateMachine: StateMachine = null;

    private movePackHandler: MovePacket = null;
    private stopPackHandler: MovePacket = null;
    private jumpPackHandler: Function = null;
    private posInfoPackHandler: Function = null;
    private attackPackHandler: Function = null;
    private damagePackHandler: Function = null;

    private _playerID: string = "";
    private player: Node = null;
    private moveRight: boolean = false; //todo: 只需要留下往右 取反就是往左
    private moveLeft: boolean = false;

    private onFight: boolean = false;
    private canFight: boolean = true;
    private rigidBody: RigidBody2D = null;
    private collider: Collider2D = null;
    private onGround: boolean = true; // 是否接觸地面(腳色出現時可能尚未落地，必須改為落地後重設onGround)
    private serverPosition: Vec3 = null; //後端發來的位置封包
    private isSelfControl: boolean = false;
    private Delta: number = 0;
    private updateFrequency: number = 0.25;
    private playerWidth: number = 0;
    private health: number = 100;
    private damageOfBullet: number = 0;

    onLoad() {
        this.playerWidth = this.node.getComponent(UITransform).contentSize.width;
        AddEvent(EventName.KeyDown, this.onServerKeyDown.bind(this));
        AddEvent(EventName.KeyUp, this.onServerKeyUp.bind(this));
        AddEvent(EventName.SyncPosition, this.onSyncPosition.bind(this));
        AddEvent(EventName.Damage, this.onDamage.bind(this));
    }

    start() {
        // EventManager.dispathEvent(EventName.Move, 0, "right");
        // 初始化狀態機，起始狀態設為 Idle
        this.stateMachine = new StateMachine(this, new IdleState());
        this.flipPlayer();
    }

    get MoveLeft(): boolean {
        return this.moveLeft;
    }

    get MoveRight(): boolean {
        return this.moveRight;
    }

    get FaceToRight(): boolean {
        return this.faceToRight;
    }

    get OnGround(): boolean {
        return this.onGround;
    }

    get OnFight(): boolean {
        return this.onFight;
    }

    set setFight(mode: boolean) {
        this.onFight = mode;
    }

    get RigidBody(): RigidBody2D {
        return this.rigidBody;
    }

    get WalkSpeed(): number {
        return this.walkSpeed;
    }

    get Bullet(): Prefab {
        return this.bullet;
    }

    set setPlayerSelfControll(player: Node) {
        this.player = player;
        this.isSelfControl = true;
        this.rigidBody = this.player.getComponent(RigidBody2D);
        this.collider = this.player.getComponent(Collider2D);
        // 註冊碰撞偵測，當碰撞時設置 onGround = true
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        // this.schedule(this.posInfoPackHandler, 5, macro.REPEAT_FOREVER, 1);
    }

    /* set offPlayerControll(player: Node) {
        this.player = player;
        this.rigidBody = this.player.getComponent(RigidBody2D);
        this.collider = this.player.getComponent(Collider2D);
        // 註冊碰撞偵測，當碰撞時設置 onGround = true
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    } */

    set setPlayerOtherControll(player: Node) {
        this.player = player;
        this.isSelfControl = false;
        this.rigidBody = this.player.getComponent(RigidBody2D);
        this.collider = this.player.getComponent(Collider2D);
        // 註冊碰撞偵測，當碰撞時設置 onGround = true
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    set setPlayerID(id: string) {
        this._playerID = id;
    }

    get PlayerID(): string {
        return this._playerID;
    }

    public setMovePackHandler(func: MovePacket) {
        this.movePackHandler = func;
    }

    public setStopPackHandler(func: MovePacket) {
        this.stopPackHandler = func;
    }

    public setJumpPackHandler(func: Function) {
        this.jumpPackHandler = func;
    }

    public setPosInfoPackHandler(func: Function) {
        this.posInfoPackHandler = func;
    }

    public setAttackPackHandler(func: Function) {
        this.attackPackHandler = func;
    }

    public setDamagePackHandler(func: Function) {
        this.damagePackHandler = func;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log("接觸地面 self:", selfCollider, "other:", otherCollider);
        if (otherCollider.group === PHY_GROUP.FLOOR) {
            this.onGround = true; // 碰到地面時，允許跳躍
            console.log("接觸地面");
        } else if (otherCollider.group === PHY_GROUP.DEFAULT) {
            console.log("接觸玩家");
        } else if (otherCollider.group === PHY_GROUP.BULLET) {
            console.log("被子彈擊中");
            this.damageOfBullet = otherCollider.node.getComponent(Bullet).Damage;
            if (this.isSelfControl) this.damagePackHandler();
        }
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log("離開地面 self:", selfCollider, "other:", otherCollider);
        if (otherCollider.group === PHY_GROUP.FLOOR) {
            this.onGround = false; // 離開地面時，標記為不在地面
            console.log("離開地面");
        } else if (otherCollider.group === PHY_GROUP.DEFAULT) {
            console.log("離開玩家");
        }
    }

    private resetFight() {
        this.canFight = true;
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                if (this.isSelfControl) this.movePackHandler(true);
                if (this.moveLeft) this.moveLeft = false;
                this.moveRight = true;
                this.faceToRight = true;
                this.flipPlayer();
                break;
            case KeyCode.ARROW_LEFT:
                if (this.isSelfControl) this.movePackHandler(false);
                if (this.moveRight) this.moveRight = false;
                this.moveLeft = true;
                this.faceToRight = false;
                this.flipPlayer();
                break;
            case KeyCode.SPACE:
                if (this.isSelfControl) this.jumpPackHandler();
                if (this.onGround) {
                    this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x, this.jumpForce); // 施加跳躍力
                    this.onGround = false; // 跳躍後標記為離地
                }
                break;
            case KeyCode.KEY_X:
                if (this.canFight) {
                    if (this.isSelfControl) this.attackPackHandler();
                    this.canFight = false;
                    this.onFight = true;
                    this.scheduleOnce(this.resetFight, 1);
                }
                break;
            default:
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                if (this.isSelfControl) this.stopPackHandler(true);
                this.moveRight = false;
                break;
            case KeyCode.ARROW_LEFT:
                if (this.isSelfControl) this.stopPackHandler(false);
                this.moveLeft = false;
                break;
            default:
                break;
        }
    }

    private onServerKeyDown(...ary: any[]) {
        const id = ary[0];
        const event = ary[1];
        if (this.isSelfControl) return;
        if (id == this._playerID) this.onKeyDown(event);
    }

    private onServerKeyUp(...ary: any[]) {
        const id = ary[0];
        const event = ary[1];
        if (this.isSelfControl) return;
        if (id == this._playerID) this.onKeyUp(event);
    }

    private onSyncPosition(...ary: any[]) {
        const id = ary[0];
        const updatePosition: Vec3 = ary[1];
        if (id == this._playerID) {
            let clientPos = this.player.position;
            // console.log("修正前位置", this.player.position);
            // console.log("S2C 玩家位置", updatePosition);

            // 插值修正 (平滑補正)
            this.player.position = clientPos.lerp(updatePosition, 0.2);
            // console.log("修正後位置", this.player.position);
        }
        /* if (this.serverPosition) {
            let clientPos = this.player.position;
            console.log("當前位置", this.player.position);
            let serverPos = this.serverPosition;

            // 插值修正 (平滑補正)
            this.player.position = clientPos.lerp(serverPos, 0.1);
            console.log("修正位置", this.player.position);
            this.serverPosition = null;
        } */
    }

    private flipPlayer() {
        if (this.faceToRight) this.node.getComponent(UITransform).setContentSize(this.playerWidth, this.node.getComponent(UITransform).contentSize.height);
        else this.node.getComponent(UITransform).setContentSize(-(this.playerWidth), this.node.getComponent(UITransform).contentSize.height);
    }

    private onDamage(...ary: any[]) {
        const id = ary[0];
        if (id == this._playerID) {
            this.health -= this.damageOfBullet;
            console.log(`玩家${id} 剩餘血量${this.health}`);
        }
    }

    update(deltaTime: number) {
        this.Delta += deltaTime;

        if (this.player) {
            this.stateMachine.update(deltaTime);

            if (this.Delta >= this.updateFrequency) {
                this.Delta = 0;
                // if (this.isSelfControl) this.posInfoPackHandler(this.player.position); //暫時關閉(開啟後會定時更新玩家位置)
                // console.log("C2S 玩家位置", this.player.position);
            }


            // 如果從伺服器收到修正位置
            /* if (this.serverPosition) {
                let clientPos = this.player.position;
                console.log("當前位置", this.player.position);
                let serverPos = this.serverPosition;

                // 插值修正 (平滑補正)
                this.player.position = clientPos.lerp(serverPos, 0.1);
                console.log("修正位置", this.player.position);
                this.serverPosition = null;
            } */
        }
    }
}

export const PHY_GROUP = {
    DEFAULT: 1 << 0,
    FLOOR: 1 << 1,
    PLAYER: 1 << 2,
    BULLET: 1 << 3,
    WALL: 1 << 4,
};