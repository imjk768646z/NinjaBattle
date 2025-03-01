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
        console.log("Send Packet [Join]:", protobuf.protobuf.Join.encode(join).finish());

        let packet = new Packet(Action.Join, protobuf.protobuf.Join.encode(join).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendMovePacket(isRight: boolean) {
        let move = new protobuf.protobuf.Move();
        move.ID = getValue<string>(ModelKey.PlayerUUID);
        move.IsGoRight = isRight;
        console.log("Send Packet [Move]:", protobuf.protobuf.Move.encode(move).finish());

        let packet = new Packet(Action.Move, protobuf.protobuf.Move.encode(move).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendStopPacket(isStop2Right: boolean) {
        let stop = new protobuf.protobuf.Stop();
        stop.ID = getValue<string>(ModelKey.PlayerUUID);
        stop.IsStopGoRight = isStop2Right;
        console.log("Send Packet [Stop]:", protobuf.protobuf.Stop.encode(stop).finish());

        let packet = new Packet(Action.Stop, protobuf.protobuf.Stop.encode(stop).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendJumpPacket() {
        let jump = new protobuf.protobuf.Jump();
        jump.ID = getValue<string>(ModelKey.PlayerUUID);
        console.log("Send Packet [Jump]:", protobuf.protobuf.Jump.encode(jump).finish());

        let packet = new Packet(Action.Jump, protobuf.protobuf.Jump.encode(jump).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendPosInfoPacket(playerPosition: Vec3) {
        let position = new protobuf.protobuf.PositionInfo();
        position.ID = getValue<string>(ModelKey.PlayerUUID);
        position.X = playerPosition.x;
        position.Y = playerPosition.y;
        console.log("Send Packet [PositionInfo]:", position);

        let packet = new Packet(Action.PositionInfo, protobuf.protobuf.PositionInfo.encode(position).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendAttackPacket() {
        let attack = new protobuf.protobuf.Attack();
        attack.ID = getValue<string>(ModelKey.PlayerUUID);
        console.log("Send Packet [Attack]:", protobuf.protobuf.Attack.encode(attack).finish());

        let packet = new Packet(Action.Attack, protobuf.protobuf.Attack.encode(attack).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendDamagePacket(damageCause: number) {
        let damage = new protobuf.protobuf.Damage();
        damage.ID = getValue<string>(ModelKey.PlayerUUID);
        damage.DamagePower = damageCause;
        console.log("Send Packet [Damage]:", protobuf.protobuf.Damage.encode(damage).finish());

        let packet = new Packet(Action.Damage, protobuf.protobuf.Damage.encode(damage).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendHealthGetPacket(healthQuantity: number) {
        let healthGet = new protobuf.protobuf.HealthGet();
        healthGet.ID = getValue<string>(ModelKey.PlayerUUID);
        healthGet.Health = healthQuantity;
        console.log("Send Packet [HealthGet]:", protobuf.protobuf.HealthGet.encode(healthGet).finish());

        let packet = new Packet(Action.HealthGet, protobuf.protobuf.HealthGet.encode(healthGet).finish());
        this.websocketConn.sendPacket(packet);
    }

    public static sendDiePacket() {
        let die = new protobuf.protobuf.Die();
        die.ID = getValue<string>(ModelKey.PlayerUUID);
        console.log("Send Packet [Die]:", protobuf.protobuf.Die.encode(die).finish());

        let packet = new Packet(Action.Die, protobuf.protobuf.Die.encode(die).finish());
        this.websocketConn.sendPacket(packet);
    }
}