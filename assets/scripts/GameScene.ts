import { _decorator, Component, EventKeyboard, KeyCode, Label, Node, NodeEventType, Vec3 } from 'cc';
import { default as protobuf } from '../../Proto/protobuf.js';
import { Player } from './Player';
import { EventManager, EventName } from './Singleton/EventManager';
const { ccclass, property } = _decorator;

export enum Action {
    Join = '1000',
    Move = '2000',
    Stop = '3000',
    Jump = '4000',
    PositionInfo = '5000',
    Attack = '6000',
    Die = '7000',
    Damage = '8000',
}

export const ActionReverseMap = {
    '1000': 'Join',
    '2000': 'Move',
    '3000': 'Stop',
    '4000': 'Jump',
    '5000': 'PositionInfo',
    '6000': 'Attack',
    '7000': 'Die',
    '8000': 'Damage',
}

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    private ws: WebSocket = null;
    private join: Node = null;
    private move: Node = null;
    private die: Node = null;
    private _uuid: string = "";

    onLoad() {
        // 註冊封包回呼
        this.players.forEach(value => {
            let player = value.getComponent(Player);
            player.setMovePackHandler(this.sendMovePacket.bind(this));
            player.setStopPackHandler(this.sendStopPacket.bind(this));
            player.setJumpPackHandler(this.sendJumpPacket.bind(this));
            player.setPosInfoPackHandler(this.sendPosInfoPacket.bind(this));
            player.setAttackPackHandler(this.sendAttackPacket.bind(this));
            player.setDamagePackHandler(this.sendDamagePacket.bind(this));
        })
        // 註冊按鈕事件
        this.join = this.node.getChildByName("Join");
        this.move = this.node.getChildByName("Move");
        this.die = this.node.getChildByName("Die");
        this.join.on(NodeEventType.TOUCH_END, () => {
            let firstRequest = new protobuf.protobuf.Join();
            // firstRequest.ID = "100";
            console.log("firstRequest:", protobuf.protobuf.Join.encode(firstRequest).finish());

            let packet = new Packet(Action.Join, protobuf.protobuf.Join.encode(firstRequest).finish());
            this.sendPacket(packet);
        })
        this.move.on(NodeEventType.TOUCH_END, () => {
            let moveInfo = new protobuf.protobuf.Move();
            // moveInfo.x = 5;
            // moveInfo.y = 10;
            console.log("MoveInfo:", protobuf.protobuf.Move.encode(moveInfo).finish());

            let packet = new Packet(Action.Move, protobuf.protobuf.Move.encode(moveInfo).finish());
            this.sendPacket(packet);
        })
        this.die.on(NodeEventType.TOUCH_END, () => {
            let die = new protobuf.protobuf.Die();
            die.ID = this._uuid;
            let packet = new Packet(Action.Die, protobuf.protobuf.Die.encode(die).finish());
            this.sendPacket(packet);
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
                case Action.Join:
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
                    //todo: 退回菜單 + 重置腳色狀態(控制權、重生位置)
                    break;
                case Action.Damage:
                    bodyArray = data.slice(actionLength);
                    msg = protobuf.protobuf.Damage.decode(bodyArray);
                    console.log("[受傷]封包 body:", msg);
                    EventManager.dispathEvent(EventName.Damage, msg.ID, msg.DamagePower);
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

    private sendMovePacket(isRight: boolean) {
        let move = new protobuf.protobuf.Move();
        move.ID = this._uuid;
        move.IsGoRight = isRight;
        console.log("Move Packet:", protobuf.protobuf.Move.encode(move).finish());

        let packet = new Packet(Action.Move, protobuf.protobuf.Move.encode(move).finish());
        this.sendPacket(packet);
    }

    private sendStopPacket(isStop2Right: boolean) {
        let stop = new protobuf.protobuf.Stop();
        stop.ID = this._uuid;
        stop.IsStopGoRight = isStop2Right;
        console.log("Stop Packet:", protobuf.protobuf.Stop.encode(stop).finish());

        let packet = new Packet(Action.Stop, protobuf.protobuf.Stop.encode(stop).finish());
        this.sendPacket(packet);
    }

    private sendJumpPacket() {
        let jump = new protobuf.protobuf.Jump();
        jump.ID = this._uuid;
        console.log("Jump Packet:", protobuf.protobuf.Jump.encode(jump).finish());

        let packet = new Packet(Action.Jump, protobuf.protobuf.Jump.encode(jump).finish());
        this.sendPacket(packet);
    }

    private sendPosInfoPacket(playerPosition: Vec3) {
        let position = new protobuf.protobuf.PositionInfo();
        position.ID = this._uuid;
        position.X = playerPosition.x;
        position.Y = playerPosition.y;
        console.log("PositionInfo Packet:", position);

        let packet = new Packet(Action.PositionInfo, protobuf.protobuf.PositionInfo.encode(position).finish());
        this.sendPacket(packet);
    }

    private sendAttackPacket() {
        let attack = new protobuf.protobuf.Attack();
        attack.ID = this._uuid;
        console.log("Attack Packet:", protobuf.protobuf.Attack.encode(attack).finish());

        let packet = new Packet(Action.Attack, protobuf.protobuf.Attack.encode(attack).finish());
        this.sendPacket(packet);
    }

    private sendDamagePacket(damageCause: number) {
        let damage = new protobuf.protobuf.Damage();
        damage.ID = this._uuid;
        damage.DamagePower = damageCause;
        console.log("Damage Packet:", protobuf.protobuf.Damage.encode(damage).finish());

        let packet = new Packet(Action.Damage, protobuf.protobuf.Damage.encode(damage).finish());
        this.sendPacket(packet);
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