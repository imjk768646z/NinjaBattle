export class WebSocketConnection {

    private _websocket: WebSocket;
    private _listener: Map<string, Function> = new Map<string, Function>();

    public connect() {
        this._websocket = new WebSocket('ws://localhost:5000');
        // this._websocket = new WebSocket('wss://將後端網址放在這');
        this._websocket.binaryType = "arraybuffer"; // 指定接收的二進位資料型態

        this._websocket.onopen = (res) => {
            console.log("ლ(´ڡ`ლ) 連線成功！", res);
        };

        this._websocket.onmessage = (event) => {
            this.notifyListeners(event);
        }

        this._websocket.onclose = () => {
            console.log("❌ 連線已關閉");
        };
    }

    // 訂閱 WebSocket 訊息
    public addMessageListener(event: string, callback: Function) {
        this._listener.set(event, callback);
        console.log("listener add", this._listener);
    }

    // 通知所有訂閱者
    private notifyListeners(event: MessageEvent) {
        this._listener.forEach(callback => {
            callback(event);
        })
    }

    public removeListener(event) {
        if (this._listener.has(event)) {
            this._listener.delete(event);
        }
        console.log("listener remove", this._listener);
    }

    public sendPacket(packet: Packet) {
        this.sendMessage(this.marshal(packet));
    }

    private marshal(data: Packet): Uint8Array {
        let _action = this.stringToUin8Array(data.action);
        let dist = new Uint8Array(_action.length + data.body.length);
        dist.set(_action, 0);
        dist.set(data.body, _action.length);
        return dist;
    }

    private stringToUin8Array(data: string): Uint8Array {
        let content = Uint8Array.from(Array.from<string>(data).map((letter) => letter.charCodeAt(0)));
        let dist = new Uint8Array(content.length);
        dist.set(content, 0);
        return dist;
    }

    private sendMessage(message: Uint8Array) {
        if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
            this._websocket.send(message);
            console.log("發送訊息:", message);
        } else {
            console.error("WebSocket 尚未連線");
        }
    }
}

export class Packet {
    constructor(
        public action: string,
        public body: Uint8Array = new Uint8Array(0)
    ) { }
}
