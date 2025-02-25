import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Prefab, RigidBody2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property({ tooltip: "移動速度" })
    private readonly moveSpeed: number = 30; // 水平移動速度 (每秒)

    @property({ tooltip: "傷害強度" })
    private readonly damage: number = 10;

    private rigidBody: RigidBody2D = null;
    private collider: BoxCollider2D = null;
    private isGoRight: boolean = false;
    private offset: number = 100;

    private destroyBullet: Function = null;

    /**
     * 
     * @param spawnPoint 玩家當前的座標
     * @param isGoRight 玩家面朝的方向
     */
    init(spawnPoint: Vec3, goRight: boolean) {
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
        console.log("擊中:", otherCollider);
        // todo: 若擊中玩家 該玩家要發送受傷封包
        this.scheduleOnce(this.destroyBullet, 0);
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    update(deltaTime: number) {
        let velocity = this.rigidBody.linearVelocity;
        if (this.isGoRight) velocity.x = this.moveSpeed;
        else velocity.x = -this.moveSpeed;

        this.rigidBody.linearVelocity = velocity;
    }

    get Damage(): number {
        return this.damage;
    }
}


