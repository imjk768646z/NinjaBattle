import { _decorator, Component, Label, Node, NodeEventType } from 'cc';
import { default as protobuf } from '../../Proto/protobuf.js';
import { Player } from './Player';
const { ccclass, property } = _decorator;

export enum Action {
    TestJoin = '1000',
    TestMove = '2000',
}

export const ActionReverseMap = {
    '1000': 'TestJoin',
    '2000': 'TestMove',
}

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    // private players = ["0x001", "0x002"]; //temp

    private ws: WebSocket = null;
    private join: Node = null;
    private move: Node = null;
    private die: Node = null;
    private _uuid: string = "";

    onLoad() {
        // 註冊按鈕事件
        this.join = this.node.getChildByName("Join");
        this.move = this.node.getChildByName("Move");
        this.die = this.node.getChildByName("Die");
        this.join.on(NodeEventType.TOUCH_END, () => {
            let firstRequest = new protobuf.protobuf.Join();
            // firstRequest.ID = "100";
            console.log("firstRequest:", protobuf.protobuf.Join.encode(firstRequest).finish());

            let packet = new Packet(Action.TestJoin, protobuf.protobuf.Join.encode(firstRequest).finish());
            this.sendPacket(packet);
        })
        this.move.on(NodeEventType.TOUCH_END, () => {
            let moveInfo = new protobuf.protobuf.MoveInfo();
            moveInfo.x = 5;
            moveInfo.y = 10;
            console.log("MoveInfo:", protobuf.protobuf.MoveInfo.encode(moveInfo).finish());

            let packet = new Packet(Action.TestMove, protobuf.protobuf.MoveInfo.encode(moveInfo).finish());
            this.sendPacket(packet);
        })
        this.die.on(NodeEventType.TOUCH_END, () => {
            this.sendPacket();
        })
        // this.ws = new WebSocket('ws://192.168.56.1:5000');
        this.ws = new WebSocket('ws://localhost:5000');
        this.ws.binaryType = "arraybuffer"; // 指定接收的二進位資料型態
        // this.ws = new WebSocket('wss://將你的後端網址放在這');

        if (this.ws) console.log("ws:", this.ws);

        this.ws.onopen = (res) => {
            console.log("🟢 連線成功！", res);
            // this.sendMessage();
        };

        this.ws.onmessage = (event) => {
            // console.log(`📩 來自伺服器: ${event.data}`);
            let data = new Uint8Array(event.data);

            let actionLength = 4;
            let actionArray = data.slice(0, actionLength);
            let action = new TextDecoder().decode(actionArray);
            let bodyArray = null;
            let msg = null;
            console.log("封包 action:", ActionReverseMap[action]);

            switch (action) {
                case Action.TestJoin:
                    bodyArray = data.slice(actionLength);
                    msg = protobuf.protobuf.Join.decode(bodyArray);
                    console.log("[加入]封包 body:", msg);
                    // 設定uuid
                    if (this._uuid == "") {
                        this._uuid = msg.ID;
                        console.log("我的uuid是:", this._uuid);
                    }
                    // 設定玩家控制權
                    if (msg.GameState == "start") {
                        if (msg.AllPlayers.length >= 2) {
                            msg.AllPlayers.forEach((uuid, index) => {
                                let player = this.players[index].getComponent(Player);
                                player.setPlayerID = uuid;
                                if (uuid == this._uuid) {
                                    console.log("我的ID為:", uuid, "使用腳色", [index]);
                                    player.setPlayerSelfControll = this.players[index];
                                } else {
                                    console.log("另一個玩家ID是", uuid, "他使用腳色", [index]);
                                    player.setPlayerOtherControll = this.players[index];
                                }
                            });
                        }
                        console.log("已設定玩家控制權，遊戲準備開始");
                    }
                    break;
                case Action.TestMove:
                    bodyArray = data.slice(actionLength);
                    msg = protobuf.protobuf.MoveInfo.decode(bodyArray);
                    console.log("[移動]封包 body:", msg);
                    break;
                default:
                    console.error("未處理封包:", action);
                    break;
            }



            // ✅ 解析二進制封包
            // let arrayBuffer = event.data as ArrayBuffer;
            // let decodedMessage = protobuf.protobuf.FirstRequest.decode(new Uint8Array(arrayBuffer));

            // console.log("解碼後的訊息：", decodedMessage);
        };

        this.ws.onclose = () => {
            console.log("🔴 連線已關閉");
        };
    }

    start() {
        // let pack = new protobuf.protobuf.FirstRequest();
        // pack.id = 100;
        // console.log("protobuf:", protobuf.protobuf.FirstRequest.encode(pack).finish());

        // this.ws.send(protobuf.protobuf.FirstRequest.encode(pack).finish());
    }

    sendMessage(message: Uint8Array) {
        // this.ws.send("test");
        this.node.getChildByName("Node").getComponent(Label).string = "已連上WebSocket";
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            console.log("發送訊息:", message);
        } else {
            console.error("WebSocket 尚未連線");
        }
    }

    sendPacket(packet: Packet) {
        /* let firstRequest = new protobuf.protobuf.FirstRequest();
        firstRequest.id = 100;
        console.log("protobuf:", protobuf.protobuf.FirstRequest.encode(firstRequest).finish());

        let packet = new Packet(Action.TestJoin, protobuf.protobuf.FirstRequest.encode(firstRequest).finish()); */

        this.sendMessage(this.marshal(packet));
    }

    marshal(data: Packet): Uint8Array {
        let _action = this.stringToUin8Array(data.action);
        let dist = new Uint8Array(_action.length + data.body.length);
        dist.set(_action, 0);
        dist.set(data.body, _action.length);
        return dist;
    }

    stringToUin8Array(data: string): Uint8Array {
        let content = Uint8Array.from(Array.from<string>(data).map((letter) => letter.charCodeAt(0)));
        let dist = new Uint8Array(content.length);
        dist.set(content, 0);
        console.log("To Uint8Array:", dist);
        return dist;
    }

    update(deltaTime: number) {

    }
}

export class Packet {
    constructor(
        public action: string,
        public body: Uint8Array = new Uint8Array(0)
    ) { }
}