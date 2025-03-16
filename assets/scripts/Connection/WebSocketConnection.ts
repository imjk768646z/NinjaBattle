export class WebSocketConnection {

    private _websocket: WebSocket;
    private _listener: Map<string, Function> = new Map<string, Function>();

    public connect() {
        this._websocket = new WebSocket('ws://localhost:5000');                                  //測試版
        // this._websocket = new WebSocket('wss://ninjabattleserver-production.up.railway.app'); //正式版
        this._websocket.binaryType = "arraybuffer"; // 指定接收的二進位資料型態

        this._websocket.onopen = (event) => {
            this.executListener("onopen", event);
        };

        this._websocket.onmessage = (event) => {
            this.executListener("onmessage", event);
        }

        this._websocket.onclose = (event) => {
            this.executListener("onclose", event);
        };
    }

    public addListener(event: string, callback: Function) {
        this._listener.set(event, callback);
        // console.log("add listener:", this._listener);
    }

    private executListener(eventName: string, eventParam: any) {
        let callback = this._listener.get(eventName);
        callback(eventParam);
    }

    public removeAllListener() {
        if (this._listener) {
            this._listener.clear();
            // console.log("remove listener:", this._listener);
        }
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
        } else {
            console.error("WebSocket 尚未連線");
        }
    }

    public get ReadyState(): number {
        return this._websocket.readyState;
    }
}

export class Packet {
    constructor(
        public action: string,
        public body: Uint8Array = new Uint8Array(0)
    ) { }
}
