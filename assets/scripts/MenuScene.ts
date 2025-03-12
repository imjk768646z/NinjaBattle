import { _decorator, Animation, AnimationClip, Component, director, Label, Node, NodeEventType, resources, SpriteFrame, tween, Vec3 } from 'cc';
import { Packet, WebSocketConnection } from './Connection/WebSocketConnection';
import { Action, ActionReverseMap, MsgCode, MsgType } from './Definition';
import protobuf from '../../Proto/protobuf.js';
import { GameScene } from './GameScene';
import { WebSocketManager } from './Connection/WebSocketManager';
import { getValue, ModelKey, setValue } from './Model/Model';
import { Socket } from './Command/Socket';
import { LoadRes } from './LoadRes';
import { BackgroundController } from './Controller/BackgroundController';
const { ccclass, property } = _decorator;

@ccclass('MenuScene')
export class MenuScene extends Component {

    @property(LoadRes)
    private loadRes: LoadRes = null;

    private websocketConn: WebSocketConnection = null;
    private join: Node = null;
    private quit: Node = null;
    private loadingRoom: Node = null;
    private searchingTime: number = 1; //尋找玩家時間(單位:分鐘)
    private isGameStart: boolean = false;
    private msgBox: Node = null;
    private bgcInstance: BackgroundController = null;

    onLoad() {
        console.log("MenuScene onLoad");

        this.websocketConn = WebSocketManager.getWebSocketConn;
        this.websocketConn.removeAllListener();
        // setWebsocket2Socket
        Socket.WebsocketConn = this.websocketConn;

        this.websocketConn.addListener("onopen", this.onOpen.bind(this));
        this.websocketConn.addListener("onmessage", this.onMessage.bind(this));
        this.websocketConn.addListener("onclose", this.onClose.bind(this));
        this.join = this.node.getChildByName("Join");
        this.quit = this.node.getChildByName("Quit");
        this.loadingRoom = this.node.getChildByName("LoadingRoom");
        this.msgBox = this.node.getChildByName("MsgBox");
        this.join.active = true;
        this.quit.active = false;
        this.loadingRoom.active = false;
        this.msgBox.active = false;
        this.bgcInstance = this.node.getChildByName("Background").getComponent(BackgroundController);

        this.join.on(NodeEventType.TOUCH_END, this.onJoin.bind(this));
        this.quit.on(NodeEventType.TOUCH_END, this.onQuit.bind(this));
    }

    async start() {
        console.log("MenuScene start");
        let isLoaded = getValue<boolean>(ModelKey.IsLoaded);
        if (isLoaded) this.loadRes.node.active = false;
        else await this.loadRes!.load();

        let map = getValue<Map<string, AnimationClip[]>>(ModelKey.NinjaAnimation);
        console.log("Maria_Animation:", map);

        let sprites = getValue<Map<string, SpriteFrame[]>>(ModelKey.SpriteMap);
        console.log("background images:", sprites);
        
        // 開始播放背景動畫
        this.bgcInstance.play();
    }

    private activateButton(button: Node) {
        button.active = true;
    }

    private deactivateButton(button: Node) {
        button.active = false;
    }

    private onJoin() {
        if (this.websocketConn.ReadyState == WebSocket.CONNECTING || this.websocketConn.ReadyState == WebSocket.CLOSED) {
            this.showMsgBox(MsgType.WebSocketClose);
            return;
        }

        if (this.websocketConn.ReadyState == WebSocket.OPEN) {
            Socket.sendJoinPacket();
            this.deactivateButton(this.join);
            this.activateButton(this.quit);
            this.startSearch();
            this.scheduleOnce(() => {
                this.loadingRoom.active = true;
                tween(this.loadingRoom)
                    .by(1, { angle: -360 })
                    .repeatForever()
                    .start();
            })
        }
    }

    private onQuit() {
        Socket.sendQuit();
        this.deactivateButton(this.quit);
        this.activateButton(this.join);
        this.loadingRoom.active = false;
        this.unscheduleAllCallbacks();
    }

    private startSearch() {
        setTimeout(() => {
            if (!this.isGameStart) {
                Socket.sendQuit();
                this.deactivateButton(this.quit);
                this.activateButton(this.join);
                this.loadingRoom.active = false;
                this.unscheduleAllCallbacks();
                this.showMsgBox(MsgType.NoPlayer);
            }
        }, this.searchingTime * 1000 * 60);
    }

    private showMsgBox(message: MsgType) {
        this.msgBox.active = true;
        this.msgBox.getChildByName("Content").getChildByName("message").getComponent(Label).string = MsgCode[message];
    }

    public reset() {
        this.join.active = true;
        this.quit.active = false;
        this.loadingRoom.active = false;
        this.isGameStart = false;
    }

    private onOpen(event) {
        console.log("✅ [MenuScene] 連線成功！", event);
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
            case Action.Join:
                bodyArray = data.slice(actionLength);
                msg = protobuf.protobuf.Join.decode(bodyArray);
                setValue<protobuf.protobuf.Join>(ModelKey.JoinPacket, msg);
                console.log("[加入]封包 body:", msg);
                // 設定uuid
                let uuid = getValue<string>(ModelKey.PlayerUUID);
                if (uuid == null) {
                    setValue(ModelKey.PlayerUUID, msg.ID);
                    console.log("我的uuid是:", getValue<string>(ModelKey.PlayerUUID));
                }
                if (msg.GameState == "start") {
                    if (msg.AllPlayers.length >= 2) {
                        console.log("遊戲準備開始，切換場景到GameScene");
                        this.quit.active = false; //配對成功後關閉「退出」按鈕
                        this.isGameStart = true;
                        // 切換場景
                        this.unscheduleAllCallbacks();
                        director.loadScene("GameScene", this.switch2GameScene.bind(this));
                    }
                }
                break;
            default:
                break;
        }
    }

    private onClose(event) {
        console.log("❌ [MenuScene] 連線已關閉");
        this.showMsgBox(MsgType.WebSocketClose);
    }

    private switch2GameScene() {
        const gameScene = director.getScene().getChildByName("Canvas").getComponent(GameScene);
        if (gameScene) {
            gameScene.init();
        }
    }

    update(deltaTime: number) {

    }
}


