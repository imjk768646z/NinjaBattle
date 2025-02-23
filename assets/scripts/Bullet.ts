import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property({ tooltip: "移動速度" })
    private readonly moveSpeed: number = 30; // 水平移動速度 (每秒)

    private rigidBody: RigidBody2D = null;
    private isGoRight: boolean = false;
    private offset: number = 100;

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
    }

    start() {

    }

    update(deltaTime: number) {
        let velocity = this.rigidBody.linearVelocity;
        if (this.isGoRight) velocity.x = this.moveSpeed;
        else velocity.x = -this.moveSpeed;

        this.rigidBody.linearVelocity = velocity;
    }
}


