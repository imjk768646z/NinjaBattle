import { _decorator, Color, Component, EventTouch, Graphics, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MsgBox')
export class MsgBox extends Component {

    private closeHandler: Function = null;

    onLoad() {
        this.drawBackgroundBody();
        this.drawCloseButton();
        this.drawContentBody();
        this.node.getChildByName("Close").on(Node.EventType.TOUCH_START, this.onClose, this);
    }

    start() {

    }

    public setCloseHandler(func: Function) {
        this.closeHandler = func;
    }

    private onClose(event: EventTouch) {
        if (this.closeHandler) this.closeHandler();
        this.node.active = false;
    }

    private drawBackgroundBody() {
        let graphics = this.node.getChildByName("BackgroundBody").getComponent(Graphics);
        let contentSize = graphics.node.getComponent(UITransform).contentSize;

        let x = -(contentSize.width / 2);
        let y = -(contentSize.height / 2);
        let width = contentSize.width;
        let height = contentSize.height;
        let radius = 10;

        graphics.clear();
        graphics.roundRect(x, y, width, height, radius);
        graphics.fillColor = new Color(60, 60, 60, 255);
        graphics.fill();
    }

    private drawCloseButton() {
        let MainGraphics = this.node.getChildByName("Close").getComponent(Graphics);
        MainGraphics.clear();
        MainGraphics.moveTo(-5, 5);
        MainGraphics.lineTo(5, -5);
        MainGraphics.moveTo(5, 5);
        MainGraphics.lineTo(-5, -5);
        MainGraphics.lineWidth = 5;
        MainGraphics.strokeColor = Color.GRAY;
        MainGraphics.stroke();
    }

    private drawContentBody() {
        let graphics = this.node.getChildByName("Content").getComponent(Graphics);
        let contentSize = graphics.getComponent(UITransform).contentSize;

        let x = -(contentSize.width / 2);
        let y = -(contentSize.height / 2);
        let width = contentSize.width;
        let height = contentSize.height;

        graphics.clear();
        graphics.rect(x, y, width, height);
        graphics.fillColor = new Color("#1B1C1D");
        graphics.fill();
    }

    update(deltaTime: number) {

    }
}


