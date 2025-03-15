import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Prefab, RigidBody2D, Vec2, Vec3 } from 'cc';
import { PHY_GROUP } from './Definition';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property({ tooltip: "移動速度" })
    private readonly moveSpeed: number = 30; // 水平移動速度 (每秒)

    @property({ tooltip: "傷害強度" })
    private readonly damage: number = 100;

    private rigidBody: RigidBody2D = null;
    private collider: BoxCollider2D = null;
    private isGoRight: boolean = false;
    private offset: number = 62;            //子彈與角色的偏移量
    private rotationSpeed: number = 135;    //旋轉速度
    private ownerID: string = "";           //子彈所屬ID(來自玩家的ID)

    private destroyBullet: Function = null;

    /**
     * 
     * @param spawnPoint 玩家當前的座標
     * @param isGoRight 玩家面朝的方向
     */
    init(spawnPoint: Vec3, goRight: boolean, belongID) {
        this.reset();
        this.ownerID = belongID;
        let newPosition = spawnPoint;
        if (goRight) {
            this.isGoRight = true;
            newPosition.x += this.offset;
        } else {
            this.isGoRight = false;
            newPosition.x -= this.offset;
        }
        this.node.position = newPosition;
    }

    onLoad() {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(BoxCollider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {

    }

    public setDestroyEvent(func: Function) {
        this.destroyBullet = func;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === PHY_GROUP.PLAYER) {
            let player = otherCollider.node.getComponent(Player);
            if (this.ownerID == player.PlayerID) { //子彈擊中玩家自己則不銷毀
                return;   
            } else {                               //子彈擊中其他玩家則銷毀
                this.unschedule(this.destroyBullet);
                this.scheduleOnce(this.destroyBullet, 0);
            }
        } else {                                   //擊中玩家以外的物體也要銷毀
            this.unschedule(this.destroyBullet);
            this.scheduleOnce(this.destroyBullet, 0); 
        }
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    private reset() {
        this.rigidBody.linearVelocity = new Vec2(0, 0);
    }

    update(deltaTime: number) {
        let velocity = this.rigidBody.linearVelocity;
        if (this.isGoRight) velocity.x = this.moveSpeed;
        else velocity.x = -this.moveSpeed;

        this.node.angle -= this.rotationSpeed * deltaTime;
        this.rigidBody.linearVelocity = velocity;
    }

    get Damage(): number {
        return this.damage;
    }

    get OwnerID(): string {
        return this.ownerID;
    }
}


