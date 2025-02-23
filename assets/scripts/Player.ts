import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, Node, Prefab, RigidBody2D, Vec2, Vec3 } from 'cc';
import { AddEvent, EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { StateMachine } from './FiniteStateMachine/StateMachine';
import { IdleState } from './FiniteStateMachine/IdleState';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property({ tooltip: "走路速度" })
    private readonly walkSpeed: number = 10; // 水平移動速度 (每秒)

    @property({ tooltip: "跳躍力道" })
    private readonly jumpForce: number = 20; // 跳躍力道

    @property(Prefab)
    private bullet: Prefab = null;

    public stateMachine: StateMachine = null;

    private _playerID: string = "";
    private player: Node = null;
    private moveRight: boolean = false; //todo: 只需要留下往右 取反就是往左
    private moveLeft: boolean = false;
    private faceToRight: boolean = false;
    private onFight: boolean = false;
    private canFight: boolean = true;
    private rigidBody: RigidBody2D = null;
    private collider: Collider2D = null;
    private onGround: boolean = true; // 是否接觸地面(腳色出現時可能尚未落地，必須改為落地後重設onGround)
    private serverPosition: Vec3 = null; //後端發來的位置封包

    onLoad() {
        AddEvent(EventName.KeyDown, this.onServerKeyDown.bind(this));
        AddEvent(EventName.KeyUp, this.onServerKeyUp.bind(this));
    }

    start() {
        // EventManager.dispathEvent(EventName.Move, 0, "right");
        // 初始化狀態機，起始狀態設為 Idle
        this.stateMachine = new StateMachine(this, new IdleState());
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
        this.rigidBody = this.player.getComponent(RigidBody2D);
        this.collider = this.player.getComponent(Collider2D);
        // 註冊碰撞偵測，當碰撞時設置 onGround = true
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
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

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log("接觸地面 self:", selfCollider, "other:", otherCollider);
        if (otherCollider.group === PHY_GROUP.FLOOR) {
            this.onGround = true; // 碰到地面時，允許跳躍
            console.log("接觸地面");
        } else if (otherCollider.group === PHY_GROUP.DEFAULT) {
            console.log("接觸玩家");
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
                this.moveRight = true;
                this.faceToRight = true;
                break;
            case KeyCode.ARROW_LEFT:
                this.moveLeft = true;
                this.faceToRight = false;
                break;
            case KeyCode.SPACE:
                if (this.onGround) {
                    this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x, this.jumpForce); // 施加跳躍力
                    this.onGround = false; // 跳躍後標記為離地
                }
                break;
            case KeyCode.KEY_X:
                if (this.canFight) {
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
                this.moveRight = false;
                break;
            case KeyCode.ARROW_LEFT:
                this.moveLeft = false;
                break;
            default:
                break;
        }
    }

    private onServerKeyDown(...ary: any[]) {
        const event = ary[0];
        const id = ary[1];
        if (id != this._playerID) return;
        this.onKeyDown(event);
    }

    private onServerKeyUp(...ary: any[]) {
        const event = ary[0];
        const id = ary[1];
        if (id != this._playerID) return;
        this.onKeyUp(event);
    }

    update(deltaTime: number) {
        if (this.player) {
            this.stateMachine.update(deltaTime);

            // 如果從伺服器收到修正位置
            if (this.serverPosition) {
                let clientPos = this.player.position;
                console.log("當前位置", this.player.position);
                let serverPos = this.serverPosition;

                // 插值修正 (平滑補正)
                this.player.position = clientPos.lerp(serverPos, 0.1);
                console.log("修正位置", this.player.position);
                this.serverPosition = null;
            }
        }
    }
}

export const PHY_GROUP = {
    DEFAULT: 1 << 0,
    FLOOR: 1 << 1,
    ENEMY_PLANE: 1 << 2,
};