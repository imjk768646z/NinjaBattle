import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, macro, Node, Prefab, ProgressBar, RigidBody2D, UITransform, Vec2, Vec3, Animation, Sprite, ParticleSystem2D, tween } from 'cc';
import { AddEvent, EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { StateMachine } from './FiniteStateMachine/StateMachine';
import { IdleState } from './FiniteStateMachine/IdleState';
import { Bullet } from './Bullet';
import { HealthBuff } from './HealthBuff';
import { Socket } from './Command/Socket';
import { FSMState, PHY_GROUP } from './Definition';
import { AudioEngineControl } from './Singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property({ tooltip: "走路速度" })
    private readonly walkSpeed: number = 10; // 水平移動速度 (每秒)

    @property({ tooltip: "跳躍力道" })
    private readonly jumpForce: number = 20; // 跳躍力道

    @property(Prefab)
    private bullet: Prefab = null;

    @property(Node)
    private bleedEffect: Node = null;

    @property({ tooltip: "面朝方向" })
    private faceToRight: boolean = false;

    @property(Vec3)
    private spawnPoint: Vec3 = null;

    @property({ tooltip: "縮放比例" })
    private playerScale: number = 1;

    public stateMachine: StateMachine = null;

    private animation: Animation = null;
    private _playerID: string = "";
    private player: Node = null;
    private moveRight: boolean = false;
    private moveLeft: boolean = false;
    private onFight: boolean = false;
    private canFight: boolean = true;
    private coolDownTime: number = 0.5;  //攻擊冷卻時間(單位：秒)
    private rigidBody: RigidBody2D = null;
    private collider: Collider2D = null;
    private onGround: boolean = false; // 是否接觸地面
    private isSelfControl: boolean = false;
    private Delta: number = 0;
    private updateFrequency: number = 0.25; //更新頻率(單位:秒)
    private health: number = 100;
    private healthMax: number = 100;
    private healthProgressBar: ProgressBar = null;

    onLoad() {
        this.animation = this.node.getChildByName("Animation").getComponent(Animation);
        this.healthProgressBar = this.node.getComponent(ProgressBar);
        this.rigidBody = this.node.getComponent(RigidBody2D);
        AddEvent(EventName.KeyDown, this.onServerKeyDown.bind(this));
        AddEvent(EventName.KeyUp, this.onServerKeyUp.bind(this));
        AddEvent(EventName.SyncPosition, this.onSyncPosition.bind(this));
        AddEvent(EventName.TakeDamage, this.onTakeDamage.bind(this));
        AddEvent(EventName.TakeHealth, this.onTakeHealth.bind(this));
    }

    start() {
        // EventManager.dispathEvent(EventName.Move, 0, "right");
        // 初始化狀態機，起始狀態設為 Idle
        this.stateMachine = new StateMachine(this, new IdleState());
        this.flipPlayer();
    }

    get PlayerScale(): number {
        return this.playerScale;
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

    get CoolDownTime(): number {
        return this.coolDownTime;
    }

    get RigidBody(): RigidBody2D {
        return this.rigidBody;
    }

    get WalkSpeed(): number {
        return this.walkSpeed;
    }

    get Health(): number {
        return this.health;
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

    set closePlayerControll(player: Node) {
        this.player = player;
        this.moveLeft = false;
        this.moveRight = false;
        this.rigidBody = this.player.getComponent(RigidBody2D);
        this.collider = this.player.getComponent(Collider2D);
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

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

    public resetPlayer() {
        // this.player.position = this.spawnPoint;
        // this.rigidBody.linearVelocity = new Vec2(0, 10); //施加一點跳躍力讓玩家能自然墜落
        this.unscheduleAllCallbacks();
        this.player = null;
        this._playerID = "";
        this.health = this.healthMax;
        this.healthProgressBar.progress = this.health / this.healthMax;
        /* if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this); */
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === PHY_GROUP.FLOOR) {
            this.onGround = true; // 碰到地面時，允許跳躍
        } else if (otherCollider.group === PHY_GROUP.BULLET) {
            let bulletInstance = otherCollider.node.getComponent(Bullet);
            if (this._playerID == bulletInstance.OwnerID) { //無視被自己射出的子彈給擊中
                return;
            } else {
                let damageOfBullet = otherCollider.node.getComponent(Bullet).Damage;
                Socket.sendDamagePacket(damageOfBullet, this._playerID);
            }
        } else if (otherCollider.group === PHY_GROUP.BUFF) {
            let healthOfBuff = otherCollider.node.getComponent(HealthBuff).Health;
            if (this.isSelfControl) Socket.sendHealthGetPacket(healthOfBuff);
        }
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === PHY_GROUP.FLOOR) {
            this.onGround = false; // 離開地面時，標記為不在地面
        }
    }

    private resetFight() {
        this.canFight = true;
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                if (this.isSelfControl) Socket.sendMovePacket(true);
                if (this.moveLeft) this.moveLeft = false;
                this.moveRight = true;
                this.faceToRight = true;
                this.flipPlayer();
                break;
            case KeyCode.ARROW_LEFT:
                if (this.isSelfControl) Socket.sendMovePacket(false);
                if (this.moveRight) this.moveRight = false;
                this.moveLeft = true;
                this.faceToRight = false;
                this.flipPlayer();
                break;
            case KeyCode.SPACE:
                if (this.isSelfControl && this.onGround) Socket.sendJumpPacket();
                if (this.onGround) {
                    this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x, this.jumpForce); // 施加跳躍力
                    this.onGround = false; // 跳躍後標記為離地
                }
                break;
            case KeyCode.KEY_X:
                if (this.canFight) {
                    if (this.isSelfControl) Socket.sendAttackPacket();
                    this.canFight = false;
                    this.onFight = true;
                    this.scheduleOnce(this.resetFight, this.coolDownTime);
                }
                break;
            default:
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                if (this.isSelfControl) Socket.sendStopPacket(true);
                this.moveRight = false;
                break;
            case KeyCode.ARROW_LEFT:
                if (this.isSelfControl) Socket.sendStopPacket(false);
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
        const serverPos: Vec3 = ary[1];
        if (id == this._playerID && this.isSelfControl) return; //不處理自己操控的角色

        if (id == this._playerID && !this.isSelfControl) {
            // console.log("修正前位置", this.player.position);
            if (Math.abs(this.player.position.y - serverPos.y) >= 20) {
                this.player.position = serverPos;
                // console.log("修正後位置", this.player.position);
            } else {
                tween(this.player)
                    .to(0.001, { position: serverPos })
                    .start();
            }
        }
    }

    private flipPlayer() {
        if (this.faceToRight) this.node.getChildByName("Animation").setScale(this.playerScale, this.playerScale, this.playerScale);
        else this.node.getChildByName("Animation").setScale(-this.playerScale, this.playerScale, this.playerScale);
    }

    private onTakeDamage(...ary: any[]) {
        const id = ary[0];
        const damagePower = ary[1];
        if (id == this._playerID) {
            AudioEngineControl.getInstance().stopAudio();
            if (this.isSelfControl) AudioEngineControl.getInstance().playAudio("get_hit");
            else AudioEngineControl.getInstance().playAudio("get_hit", 0.2);

            this.health -= damagePower;
            // console.log(`玩家${id} 剩餘血量${this.health}`);
            let progress = this.health / 100;
            this.healthProgressBar.progress = progress;
            this.bleedControll();
            if (this.health == 0) Socket.sendDiePacket(this._playerID);
        }
    }

    private onTakeHealth(...ary: any[]) {
        const id = ary[0];
        const healthQuantity = ary[1];
        if (id == this._playerID) {
            if (this.health == this.healthMax) return;
            this.health += healthQuantity;
            console.log(`玩家${id} 補血後血量${this.health}`);
            let progress = this.health / 100;
            this.healthProgressBar.progress = progress;
        }
    }

    private bleedControll() {
        this.bleedEffect.active = !this.bleedEffect.active;
        if (this.bleedEffect.active) {
            const ps = this.bleedEffect.getComponent(ParticleSystem2D);
            this.scheduleOnce(this.bleedControll.bind(this), ps.life);
        }
    }

    public onIdle() {
        AudioEngineControl.getInstance().stopAudio();
        this.stopAllAnimation();
        this.animation.getState("idle").play();
    }

    public onWalk() {
        if (this.onGround) {
            AudioEngineControl.getInstance().stopAudio();
            if (this.isSelfControl) AudioEngineControl.getInstance().playLoopAudio("running");
            else AudioEngineControl.getInstance().playLoopAudio("running", 0.2);
        }

        this.stopAllAnimation();
        this.animation.getState("run").play();
    }

    public onJump() {
        // 從攻擊狀態切回跳躍狀態時不播放音效
        if (this.stateMachine.lastState.fsmEvent != FSMState.Attack) {
            AudioEngineControl.getInstance().stopAudio();
            if (this.isSelfControl) AudioEngineControl.getInstance().playAudio("jumping");
            else AudioEngineControl.getInstance().playAudio("jumping", 0.2);
        }

        this.stopAllAnimation();
        this.animation.getState("jump").play();
    }

    public onAttack() {
        AudioEngineControl.getInstance().stopAudio();
        if (this.isSelfControl) AudioEngineControl.getInstance().playAudio("throwing");
        else AudioEngineControl.getInstance().playAudio("throwing", 0.2);

        this.stopAllAnimation();
        this.animation.getState("throw").play();
    }

    public onDie() {
        this.stopAllAnimation();
        this.animation.getState("die").play();
    }

    private stopAllAnimation() {
        const clips = this.animation.clips;
        clips.forEach(clip => this.animation.getState(clip.name).stop());
    }

    update(deltaTime: number) {
        this.Delta += deltaTime;
        if (this.player) {
            this.stateMachine.update(deltaTime);

            if (this.Delta >= this.updateFrequency) {
                this.Delta = 0;
                // if (this.isSelfControl) Socket.sendPosInfoPacket(this.player.position); //開啟後定時更新玩家位置
                // console.log("C2S 玩家位置", this.player.position);
            }
        }
    }
}