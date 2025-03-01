import { _decorator, Camera, Component, director, EventKeyboard, KeyCode, Label, macro, Node, NodeEventType, Prefab, Vec3 } from 'cc';
import { default as protobuf } from '../../Proto/protobuf.js';
import { Player } from './Player';
import { EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { HealthBuff } from './HealthBuff';
import { WebSocketConnection } from './Connection/WebSocketConnection';
import { WebSocketManager } from './Connection/WebSocketManager';
import { getValue, ModelKey } from './Model/Model';
import { Action, ActionReverseMap } from './Definition';
import { Socket } from './Command/Socket';
import { MenuScene } from './MenuScene';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    @property(Node)
    private camera: Node = null;

    @property(Prefab)
    private healthBuff: Prefab = null;

    private websocketConn: WebSocketConnection = null;

    onLoad() {

    }

    public init() {
        // setting websocketConn
        this.websocketConn = WebSocketManager.getWebSocketConn;
        this.websocketConn.addMessageListener("GameScene", this.onMessage.bind(this));
        // setPlayerController
        this.setPlayerController();
    }

    private setPlayerController() {
        // 設定玩家控制權
        let joinPacket = getValue<protobuf.protobuf.Join>(ModelKey.JoinPacket);
        let playerUUID = getValue<string>(ModelKey.PlayerUUID);
        if (joinPacket.GameState == "start") {
            if (joinPacket.AllPlayers.length >= 2) {
                joinPacket.AllPlayers.forEach((uuid, index) => {
                    let player = this.players[index].getComponent(Player);
                    player.setPlayerID = uuid;
                    if (uuid == playerUUID) {
                        console.log("我的ID為:", playerUUID, "使用腳色", [index]);
                        player.setPlayerSelfControll = this.players[index];
                        // 設定相機跟隨玩家的移動
                        this.camera.setParent(this.players[index]);
                        // this.camera.setPosition(0, 1800, 0); //解析度改為1920*1080後 重設相機位置無效
                    } else {
                        console.log("另一個玩家ID是", uuid, "他使用腳色", [index]);
                        player.setPlayerOtherControll = this.players[index];
                    }
                });

                console.log("已設定玩家控制權，遊戲準備開始");
            }
        }
    }

    private onMessage(event) {
        let data = new Uint8Array(event.data);
        let actionLength = 4;
        let actionArray = data.slice(0, actionLength);
        let action = new TextDecoder().decode(actionArray);
        let bodyArray = null;
        let msg = null;
        console.log("封包 action:", ActionReverseMap[action]);

        switch (action) {
            case Action.Move:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Move.decode(bodyArray);
                console.log("[移動]封包 body:", msg);
                if (msg.IsGoRight) EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.ARROW_RIGHT, true));
                else EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.ARROW_LEFT, true));
                break;
            case Action.Stop:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Stop.decode(bodyArray);
                console.log("[停止]封包 body:", msg);
                if (msg.IsStopGoRight) EventManager.dispathEvent(EventName.KeyUp, msg.ID, new EventKeyboard(KeyCode.ARROW_RIGHT, false));
                else EventManager.dispathEvent(EventName.KeyUp, msg.ID, new EventKeyboard(KeyCode.ARROW_LEFT, false));
                break;
            case Action.Jump:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Jump.decode(bodyArray);
                console.log("[跳躍]封包 body:", msg);
                EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.SPACE, true));
                break;
            case Action.PositionInfo:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.PositionInfo.decode(bodyArray);
                console.log("[同步位置]封包 body:", msg);
                let poision = new Vec3(msg.X, msg.Y, 0);
                EventManager.dispathEvent(EventName.SyncPosition, msg.ID, poision);
                break;
            case Action.Attack:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Attack.decode(bodyArray);
                console.log("[攻擊]封包 body:", msg);
                EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.KEY_X, true));
                break;
            case Action.Die:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Die.decode(bodyArray);
                console.log("[死亡]封包 body:", msg, "五秒後退回主菜單");
                this.resetPlayer();
                this.resetCamera();
                //todo: 退回菜單 + 重置腳色狀態(控制權、重生位置)
                break;
            case Action.Damage:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Damage.decode(bodyArray);
                console.log("[受傷]封包 body:", msg);
                EventManager.dispathEvent(EventName.TakeDamage, msg.ID, msg.DamagePower);
                break;
            case Action.HealthBuff:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.HealthBuff.decode(bodyArray);
                console.log("[補血包]封包 body:", msg);
                // EventManager.dispathEvent(EventName.Damage, msg.ID, msg.DamagePower);
                const buffPos = new Vec3(msg.X, msg.Y, 0);
                this.generateHealthBuff(buffPos);
                break;
            case Action.HealthGet:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.HealthGet.decode(bodyArray);
                console.log("[獲得血量]封包 body:", msg);
                EventManager.dispathEvent(EventName.TakeHealth, msg.ID, msg.Health);
                break;
            default:
                console.error("未處理封包:", action);
                break;
        }
    }

    start() {
        // 模擬遊戲結束後退回菜單
        /* setTimeout(() => {
            director.loadScene("MenuScene", this.switch2MenuScene.bind(this));
        }, 3000); */
    }

    private switch2MenuScene() {
        const menuScene = director.getScene().getChildByName("Canvas").getComponent(MenuScene);;
        if (menuScene) {
            WebSocketManager.getWebSocketConn.removeListener("GameScene");
            console.log("切換場景至 MenuScene");
        }
    }

    // todo: 玩家離線或遊戲結束後需要重置相機的位置
    private resetCamera() {
        console.log("重置相機");
        this.camera.setParent(this.node);
        this.camera.setPosition(0, 0, 0);
    }

    generateHealthBuff(position: Vec3) {
        let nodePool = NodePoolManager.getNodePoolMgr();
        let healthBuff = nodePool.createNode("HealthBuff", this.node.getChildByName("HealthBuffCollection"), this.healthBuff);
        healthBuff.position = position;
        let healthBuffScript = healthBuff.getComponent(HealthBuff);
        let destroy = function () {
            if (healthBuff) nodePool.returnNode("HealthBuff", healthBuff);
        }
        healthBuffScript.setDestroyEvent(destroy.bind(this));
    }

    private resetPlayer() {
        this.players.forEach(value => {
            let player = value.getComponent(Player);
            player.resetPlayer();
        })
    }

    update(deltaTime: number) {

    }
}