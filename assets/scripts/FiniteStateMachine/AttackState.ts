import { Bullet } from "../Bullet";
import { IState } from "./IState";
import { NodePoolManager } from "../Singleton/NodePoolManager";
import { Player } from "../Player";

export class AttackState implements IState {
    enter(player: Player): void {
        console.log("進入 Attack 狀態");
        // 執行攻擊行為，例如產生子彈或播放攻擊動畫
        // 攻擊邏輯可以根據需求擴充
    }
    update(player: Player, deltaTime: number): void {
        // 攻擊結束後返回 Idle 狀態 (或根據情境返回其他狀態)
        // player.stateMachine.changeState(new IdleState());
        console.log("上一個狀態:", player.stateMachine.lastState);
        if (player.OnFight) {
            player.setFight = false;
            //todo: 產生預製體移至Ammo中實作
            let nodePool = NodePoolManager.getNodePoolMgr();
            let bullet = nodePool.createNode("Bullet", player.node.parent, player.Bullet);
            bullet.getComponent(Bullet).init(player.node.position, player.FaceToRight);
            setTimeout(() => {
                nodePool.returnNode("Bullet", bullet);
            }, 2000);
        }
        player.stateMachine.changeState(player.stateMachine.lastState);
    }
    exit(player: Player): void {
        console.log("離開 Attack 狀態");
    }
}