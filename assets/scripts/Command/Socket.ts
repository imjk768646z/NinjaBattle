import { Vec3 } from 'cc';
import { default as protobuf } from '../../../Proto/protobuf.js';
import { Packet, WebSocketConnection } from "../Connection/WebSocketConnection";
import { Action } from '../Definition';
import { getValue, ModelKey } from '../Model/Model';

export class Socket {
    private static websocketConn: WebSocketConnection = null;

    public static set WebsocketConn(conn: WebSocketConnection) {
        this.websocketConn = conn;
    }

    public static sendJoinPacket() {
        let join = new protobuf.protobuf.Join();
        join.IsQuit = false;
        // console.log("Send Packet [Join]:", join);

        let packet = new Packet(Action.Join, protobuf.protobuf.Join.encode(join).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendQuit() {
        let join = new protobuf.protobuf.Join();
        join.IsQuit = true;
        // console.log("Send Packet [Quit]:", join);

        let packet = new Packet(Action.Join, protobuf.protobuf.Join.encode(join).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendMovePacket(isRight: boolean) {
        let move = new protobuf.protobuf.Move();
        move.ID = getValue<string>(ModelKey.PlayerUUID);
        move.IsGoRight = isRight;
        // console.log("Send Packet [Move]:", move);

        let packet = new Packet(Action.Move, protobuf.protobuf.Move.encode(move).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendStopPacket(isStop2Right: boolean) {
        let stop = new protobuf.protobuf.Stop();
        stop.ID = getValue<string>(ModelKey.PlayerUUID);
        stop.IsStopGoRight = isStop2Right;
        // console.log("Send Packet [Stop]:", stop);

        let packet = new Packet(Action.Stop, protobuf.protobuf.Stop.encode(stop).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendJumpPacket() {
        let jump = new protobuf.protobuf.Jump();
        jump.ID = getValue<string>(ModelKey.PlayerUUID);
        // console.log("Send Packet [Jump]:", jump);

        let packet = new Packet(Action.Jump, protobuf.protobuf.Jump.encode(jump).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendPosInfoPacket(playerPosition: Vec3) {
        if (this.websocketConn.ReadyState == WebSocket.CLOSED) return; //防止斷線後還不停發送封包
        let position = new protobuf.protobuf.PositionInfo();
        position.ID = getValue<string>(ModelKey.PlayerUUID);
        position.X = playerPosition.x;
        position.Y = playerPosition.y;
        // console.log("Send Packet [PositionInfo]:", position);

        let packet = new Packet(Action.PositionInfo, protobuf.protobuf.PositionInfo.encode(position).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendAttackPacket() {
        let attack = new protobuf.protobuf.Attack();
        attack.ID = getValue<string>(ModelKey.PlayerUUID);
        // console.log("Send Packet [Attack]:", attack);

        let packet = new Packet(Action.Attack, protobuf.protobuf.Attack.encode(attack).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendDamagePacket(damageCause: number, playerID: string) {
        let damage = new protobuf.protobuf.Damage();
        damage.ID = playerID;
        damage.DamagePower = damageCause;
        // console.log("Send Packet [Damage]:", damage);

        let packet = new Packet(Action.Damage, protobuf.protobuf.Damage.encode(damage).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendHealthGetPacket(healthQuantity: number) {
        let healthGet = new protobuf.protobuf.HealthGet();
        healthGet.ID = getValue<string>(ModelKey.PlayerUUID);
        healthGet.Health = healthQuantity;
        // console.log("Send Packet [HealthGet]:", healthGet);

        let packet = new Packet(Action.HealthGet, protobuf.protobuf.HealthGet.encode(healthGet).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendDiePacket(playerID: string) {
        let die = new protobuf.protobuf.Die();
        die.ID = playerID;
        // console.log("Send Packet [Die]:", die);

        let packet = new Packet(Action.Die, protobuf.protobuf.Die.encode(die).finish());
        this.websocketConn.sendPacket(packet);
    }
}