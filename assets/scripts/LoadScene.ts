import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadScene')
export class LoadScene extends Component {
    
    private ws = null;

    onLoad() {
        // this.ws = new WebSocket('ws://192.168.56.1:5000');
        this.ws = new WebSocket('ws://ninjaserver-production.up.railway.app');
        // this.ws = new WebSocket('ws://將你的後端網址放在這');

        if (this.ws) console.log("ws:", this.ws);

        this.ws.onopen = (res) => {
            console.log("🟢 連線成功！", res);
            this.sendMessage();
        };

        this.ws.onmessage = (event) => {
            console.log(`📩 來自伺服器: ${event.data}`);
        };

        this.ws.onclose = () => {
            console.log("🔴 連線已關閉");
        };
    }

    start() {
        // console.log("LoadScene!");

        /* if (this.ws) console.log("ws:", this.ws);

        this.ws.onopen = (res) => {
            console.log("🟢 連線成功！", res);
            this.sendMessage();
        };

        this.ws.onmessage = (event) => {
            console.log(`📩 來自伺服器: ${event.data}`);
        };

        this.ws.onclose = () => {
            console.log("🔴 連線已關閉");
        }; */

        // this.sendMessage();
    }

    sendMessage() {
        this.ws.send("test");
        this.node.getChildByName("Node").getComponent(Label).string = "已連上WebSocket";
    }

    update(deltaTime: number) {
        
    }
}


