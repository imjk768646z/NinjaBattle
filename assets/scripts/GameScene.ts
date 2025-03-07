import { _decorator, BoxCollider2D, Camera, Component, director, EventKeyboard, KeyCode, Label, macro, Node, NodeEventType, PolygonCollider2D, Prefab, ProgressBar, UITransform, Vec3 } from 'cc';
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
import { GameResult } from './GameResult';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    @property(Node)
    private camera: Node = null;

    @property(Prefab)
    private healthBuff: Prefab = null;

    private gameResult: Node = null;
    private countDownTime: number = 5;
    private countDownStartTime: number = 5;

    private websocketConn: WebSocketConnection = null;

    onLoad() {
        this.gameResult = this.node.getChildByName("GameResult");
        this.gameResult.active = false;
    }

    public init() {
        // setting websocketConn
        this.websocketConn = WebSocketManager.getWebSocketConn;
        this.websocketConn.addListener("onopen", this.onOpen.bind(this));
        this.websocketConn.addListener("onmessage", this.onMessage.bind(this));
        this.websocketConn.addListener("onclose", this.onClose.bind(this));
        // setPlayerController
        this.setPlayerController();
        this.players.forEach(playerNode => {
            let player = playerNode.getComponent(Player);
            playerNode.getComponent(BoxCollider2D).size.x = playerNode.getComponent(UITransform).contentSize.x * player.PlayerScale;
            playerNode.getComponent(BoxCollider2D).size.y = playerNode.getComponent(UITransform).contentSize.y * player.PlayerScale;
            playerNode.getComponent(ProgressBar).totalLength = playerNode.getComponent(ProgressBar).totalLength * player.PlayerScale;
            playerNode.setScale(player.PlayerScale, player.PlayerScale, player.PlayerScale);
        })
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

    private onOpen(event) {
        console.log("✅ [GameScene] 連線成功！", event);
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
                this.disablePlayer(); //取消玩家控制權

                setTimeout(() => {
                    this.gameResult.active = true;
                    let gameResultInstance = this.gameResult.getComponent(GameResult);
                    gameResultInstance.showScore(msg.ID);
                    // 重置腳色狀態、相機位置
                    this.resetPlayer();
                    this.resetCamera();
                    // 倒數五秒後切換場景
                    this.schedule(() => {
                        if (this.countDownTime == 0) {
                            director.loadScene("MenuScene", this.switch2MenuScene.bind(this)); //退回菜單
                            return;
                        }
                        gameResultInstance.showCountDown(this.countDownTime);
                        this.countDownTime--;
                    }, 1, 5, 0);
                }, 2000);
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
            case Action.Error:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Error.decode(bodyArray);
                console.log("[錯誤]封包 body:", msg);
                //todo: 取消玩家控制權 退回菜單
                break;
            default:
                console.error("未處理封包:", action);
                break;
        }
    }

    private onClose(event) {
        console.log("❌ [GameScene] 連線已關閉");
        //todo: 彈出視窗 顯示網路斷線
    }

    start() {
        // 模擬遊戲結束後退回菜單
        /* setTimeout(() => {
            director.loadScene("MenuScene", this.switch2MenuScene.bind(this));
        }, 3000); */
    }

    private switch2MenuScene() {
        const menuScene = director.getScene().getChildByName("Canvas").getComponent(MenuScene);
        this.countDownTime = this.countDownStartTime;
        this.unscheduleAllCallbacks();
        if (menuScene) {
            WebSocketManager.getWebSocketConn.removeAllListener();
            menuScene.reset();
            console.log("切換場景至 MenuScene");
        }
    }

    private resetCamera() {
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

    private disablePlayer() {
        this.players.forEach(value => {
            let player = value.getComponent(Player);
            player.closePlayerControll = value;
        })
    }

    update(deltaTime: number) {

    }
}