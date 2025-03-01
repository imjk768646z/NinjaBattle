import { WebSocketConnection } from "./WebSocketConnection";

export class WebSocketManager {
    private static _instance: WebSocketConnection = null;
    public static get getWebSocketConn(): WebSocketConnection {
        if (!this._instance) {
            this._instance = new WebSocketConnection();
            this._instance.connect();
        }
        return this._instance;
    }
}