import { _decorator, Animation, AnimationClip, BoxCollider2D, Component, director, EventKeyboard, KeyCode, Label, Node, Prefab, ProgressBar, UITransform, Vec3 } from 'cc';
import { default as protobuf } from '../../Proto/protobuf.js';
import { Player } from './Player';
import { EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { HealthBuff } from './HealthBuff';
import { WebSocketConnection } from './Connection/WebSocketConnection';
import { WebSocketManager } from './Connection/WebSocketManager';
import { getValue, ModelKey } from './Model/Model';
import { Action, ActionReverseMap, MsgCode, MsgType, PlayerSetting } from './Definition';
import { MenuScene } from './MenuScene';
import { GameResult } from './GameResult';
import { MsgBox } from './MsgBox';
import { CameraController } from './Controller/CameraController';
import { AudioEngineControl } from './Singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    @property(Prefab)
    private healthBuff: Prefab = null;

    private cameraController: CameraController = null;
    private gameResult: Node = null;
    private countDownTime: number = 5;
    private countDownStartTime: number = 5;

    private websocketConn: WebSocketConnection = null;
    private msgBox: Node = null;

    onLoad() {
        this.gameResult = this.node.getChildByName("GameResult");
        this.gameResult.active = false;
        this.msgBox = this.node.getChildByName("MsgBox");
        let msgBoxInstance = this.msgBox.getComponent(MsgBox);
        msgBoxInstance.setCloseHandler(this.quitGameScene.bind(this));
        this.cameraController = this.node.getChildByName("Camera").getComponent(CameraController);
    }

    public init() {
        AudioEngineControl.getInstance().playMusic("game_bgm", true);
        AudioEngineControl.getInstance().setMusicVolume(0.3);
        // setting websocketConn
        this.websocketConn = WebSocketManager.getWebSocketConn;
        this.websocketConn.removeAllListener();
        this.websocketConn.addListener("onopen", this.onOpen.bind(this));
        this.websocketConn.addListener("onmessage", this.onMessage.bind(this));
        this.websocketConn.addListener("onclose", this.onClose.bind(this));
        // setPlayerController
        this.setPlayerController();
        this.players.forEach((playerNode, index) => {
            let player = playerNode.getComponent(Player);
            // setting palyer's size
            playerNode.getComponent(BoxCollider2D).size.x = playerNode.getComponent(UITransform).contentSize.x * player.PlayerScale;
            playerNode.getComponent(BoxCollider2D).size.y = playerNode.getComponent(UITransform).contentSize.y * player.PlayerScale;
            playerNode.getComponent(ProgressBar).totalLength = playerNode.getComponent(ProgressBar).totalLength * player.PlayerScale;
            playerNode.setScale(player.PlayerScale, player.PlayerScale, player.PlayerScale);
            // setting palyer's animation
            let animationClips = getValue<Map<string, AnimationClip[]>>(ModelKey.NinjaAnimation);
            playerNode.getChildByName("Animation").getComponent(Animation).clips = animationClips.get(PlayerSetting[index]["name"]);
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
                        this.cameraController.setPlayer = this.players[index];
                    } else {
                        console.log("另一個玩家ID是", uuid, "他使用腳色", [index]);
                        player.setPlayerOtherControll = this.players[index];
                    }
                });
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
        // console.log("[Packet Action]:", ActionReverseMap[action]);

        switch (action) {
            case Action.Move: //移動
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Move.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                if (msg.IsGoRight) EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.ARROW_RIGHT, true));
                else EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.ARROW_LEFT, true));
                break;
            case Action.Stop: //停止移動
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Stop.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                if (msg.IsStopGoRight) EventManager.dispathEvent(EventName.KeyUp, msg.ID, new EventKeyboard(KeyCode.ARROW_RIGHT, false));
                else EventManager.dispathEvent(EventName.KeyUp, msg.ID, new EventKeyboard(KeyCode.ARROW_LEFT, false));
                break;
            case Action.Jump: //跳躍
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Jump.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.SPACE, true));
                break;
            case Action.PositionInfo: //同步位置
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.PositionInfo.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                let poision = new Vec3(msg.X, msg.Y, 0);
                EventManager.dispathEvent(EventName.SyncPosition, msg.ID, poision);
                break;
            case Action.Attack: //攻擊
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Attack.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                EventManager.dispathEvent(EventName.KeyDown, msg.ID, new EventKeyboard(KeyCode.KEY_X, true));
                break;
            case Action.Die: //玩家死亡
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Die.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                this.disablePlayer(); //取消玩家控制權

                setTimeout(() => {
                    this.cameraController.resetCamera();
                    this.gameResult.active = true;
                    let gameResultInstance = this.gameResult.getComponent(GameResult);
                    gameResultInstance.showScore(msg.ID);
                    // 倒數五秒後切換場景
                    this.schedule(() => {
                        if (this.countDownTime == 0) {
                            // 重置腳色狀態、相機位置
                            this.resetPlayer();
                            director.loadScene("MenuScene", this.switch2MenuScene.bind(this)); //退回菜單
                            return;
                        }
                        gameResultInstance.showCountDown(this.countDownTime);
                        this.countDownTime--;
                    }, 1, 5, 0);
                }, 2000);
                break;
            case Action.Damage: //受傷
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Damage.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                EventManager.dispathEvent(EventName.TakeDamage, msg.ID, msg.DamagePower);
                break;
            case Action.HealthBuff: //補血包
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.HealthBuff.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                // EventManager.dispathEvent(EventName.Damage, msg.ID, msg.DamagePower);
                const buffPos = new Vec3(msg.X, msg.Y, 0);
                this.generateHealthBuff(buffPos);
                break;
            case Action.HealthGet: //獲得血量
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.HealthGet.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                EventManager.dispathEvent(EventName.TakeHealth, msg.ID, msg.Health);
                break;
            case Action.Error: //錯誤
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Error.decode(bodyArray);
                // console.log(`[Packet Action]:${ActionReverseMap[action]} \n[Packet Body]:${JSON.stringify(msg)}`);
                this.cameraController.resetCamera();
                this.disablePlayer();
                this.showMsgBox(MsgType.PlayerIsLeft);
                break;
            default:
                console.error("未處理封包:", action);
                break;
        }
    }

    private onClose(event) {
        console.warn("❌ [GameScene] 連線已關閉");
        this.cameraController.resetCamera();
        this.disablePlayer();
        this.showMsgBox(MsgType.WebSocketClose);
    }

    start() {

    }

    private showMsgBox(message: MsgType) {
        this.msgBox.active = true;
        this.msgBox.getChildByName("Content").getChildByName("message").getComponent(Label).string = MsgCode[message];
    }

    private quitGameScene() {
        // 重置腳色狀態、相機位置
        this.resetPlayer();
        this.cameraController.resetCamera();
        director.loadScene("MenuScene", this.switch2MenuScene.bind(this)); //退回菜單
    }

    // 切換場景至 MenuScene
    private switch2MenuScene() {
        AudioEngineControl.getInstance().stopAll();
        const menuScene = director.getScene().getChildByName("Canvas").getComponent(MenuScene);
        this.countDownTime = this.countDownStartTime;
        this.unscheduleAllCallbacks();
        if (menuScene) {
            menuScene.reset();
        }
    }

    generateHealthBuff(position: Vec3) {
        let nodePool = NodePoolManager.getNodePoolMgr();
        let healthBuff = nodePool.createNode("HealthBuff", this.node.getChildByName("HealthBuffCollection"), this.healthBuff);
        healthBuff.position = position;
        let healthBuffInstance = healthBuff.getComponent(HealthBuff);
        let destroy = function () {
            if (healthBuff) nodePool.returnNode("HealthBuff", healthBuff);
        }
        healthBuffInstance.setDestroyEvent(destroy.bind(this));
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