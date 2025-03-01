import { _decorator, Component, director, Node, NodeEventType, Vec3 } from 'cc';
import { Packet, WebSocketConnection } from './Connection/WebSocketConnection';
import { Action, ActionReverseMap } from './Definition';
import protobuf from '../../Proto/protobuf.js';
import { GameScene } from './GameScene';
import { WebSocketManager } from './Connection/WebSocketManager';
import { getValue, ModelKey, setValue } from './Model/Model';
import { Socket } from './Command/Socket';
const { ccclass, property } = _decorator;

@ccclass('MenuScene')
export class MenuScene extends Component {

    private websocketConn: WebSocketConnection = null;
    private join: Node = null;

    onLoad() {
        console.log("MenuScene onLoad");
        this.websocketConn = WebSocketManager.getWebSocketConn;

        // setWebsocket2Socket
        Socket.WebsocketConn = this.websocketConn;

        this.websocketConn.addMessageListener("MenuScene", this.onMessage.bind(this));
        this.join = this.node.getChildByName("Join");
        this.join.on(NodeEventType.TOUCH_END, () => {
            Socket.sendJoinPacket();
        })
    }

    start() {

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
                        // 切換場景
                        director.loadScene("GameScene", this.switch2GameScene.bind(this));
                    }
                }
                break;
            default:
                break;
        }
    }

    private switch2GameScene() {
        const gameScene = director.getScene().getChildByName("Canvas").getComponent(GameScene);
        if (gameScene) {
            WebSocketManager.getWebSocketConn.removeListener("MenuScene");
            gameScene.init();
        }
    }

    update(deltaTime: number) {

    }
}


