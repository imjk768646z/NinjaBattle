import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D } from 'cc';
import { PHY_GROUP } from './Definition';
const { ccclass, property } = _decorator;

@ccclass('HealthBuff')
export class HealthBuff extends Component {

    @property({ tooltip: "補血量" })
    private readonly health: number = 10;

    private rigidBody: RigidBody2D = null;
    private collider: BoxCollider2D = null;
    private destroyHealthBuff: Function = null;

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
        this.destroyHealthBuff = func;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === PHY_GROUP.PLAYER) {
            console.log("補到玩家:", otherCollider);
            this.scheduleOnce(this.destroyHealthBuff, 0);
        }
        // this.scheduleOnce(this.destroyHealthBuff, 0);
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    update(deltaTime: number) {

    }

    get Health(): number {
        return this.health;
    }
}


