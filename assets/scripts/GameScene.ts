import { _decorator, Camera, Component, EventKeyboard, KeyCode, Label, macro, Node, NodeEventType, Prefab, Vec3 } from 'cc';
import { default as protobuf } from '../../Proto/protobuf.js';
import { Player } from './Player';
import { EventManager, EventName } from './Singleton/EventManager';
import { NodePoolManager } from './Singleton/NodePoolManager';
import { HealthBuff } from './HealthBuff';
const { ccclass, property } = _decorator;

export enum Action {
    Join = '1001',
    Move = '1002',
    Stop = '1003',
    Jump = '1004',
    PositionInfo = '1005',
    Attack = '1006',
    Die = '1007',
    Damage = '1008',
    HealthBuff = '1009',
    HealthGet = '1010',
}

export const ActionReverseMap = {
    '1001': 'Join',
    '1002': 'Move',
    '1003': 'Stop',
    '1004': 'Jump',
    '1005': 'PositionInfo',
    '1006': 'Attack',
    '1007': 'Die',
    '1008': 'Damage',
    '1009': 'HealthBuff',
    '1010': 'HealthGet',
}

@ccclass('GameScene')
export class GameScene extends Component {

    @property(Node)
    private players: Node[] = [];

    @property(Node)
    private camera: Node = null;

    @property(Prefab)
    private healthBuff: Prefab = null;

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
            player.setHealthGetPackHandler(this.sendHealthGetPacket.bind(this));
            player.setDiePackHandler(this.sendDiePacket.bind(this));
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
                                    // 設定相機跟隨玩家的移動
                                    this.camera.setParent(this.players[index]);
                                    this.camera.setPosition(0, 1800, 0);
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

    private sendHealthGetPacket(healthQuantity: number) {
        let healthGet = new protobuf.protobuf.HealthGet();
        healthGet.ID = this._uuid;
        healthGet.Health = healthQuantity;
        console.log("HealthGet Packet:", protobuf.protobuf.HealthGet.encode(healthGet).finish());

        let packet = new Packet(Action.HealthGet, protobuf.protobuf.HealthGet.encode(healthGet).finish());
        this.sendPacket(packet);
    }

    private sendDiePacket() {
        let die = new protobuf.protobuf.Die();
        die.ID = this._uuid;
        let packet = new Packet(Action.Die, protobuf.protobuf.Die.encode(die).finish());
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

    // todo: 玩家離線或遊戲結束後需要重置相機的位置
    private resetCamera() {
        console.log("重置相機")
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

export class Packet {
    constructor(
        public action: string,
        public body: Uint8Array = new Uint8Array(0)
    ) { }
}