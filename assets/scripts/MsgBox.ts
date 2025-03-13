import { _decorator, Color, Component, EventTouch, Graphics, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MsgBox')
export class MsgBox extends Component {

    private closeHandler: Function = null;

    onLoad() {
        this.drawBackgroundBody();
        this.drawCloseButton(new Color("#844200"));
        this.drawContentBody();
        this.node.getChildByName("Close").on(Node.EventType.TOUCH_START, this.onClose, this);
        this.node.getChildByName("Close").on(Node.EventType.MOUSE_ENTER, this.onCloseEnter, this);
        this.node.getChildByName("Close").on(Node.EventType.MOUSE_LEAVE, this.onCloseLeave, this);
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

    private onCloseEnter(event: EventTouch) {
        this.drawCloseButton(new Color("#642100"));
    }

    private onCloseLeave(event: EventTouch) {
        this.drawCloseButton(new Color("#844200"));
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
        graphics.fillColor = new Color("#FF8000");
        graphics.fill();
    }

    private drawCloseButton(color: Color) {
        let graphics = this.node.getChildByName("Close").getComponent(Graphics);
        graphics.clear();
        graphics.moveTo(-5, 5);
        graphics.lineTo(5, -5);
        graphics.moveTo(5, 5);
        graphics.lineTo(-5, -5);
        graphics.lineWidth = 5;
        graphics.strokeColor = color;
        graphics.stroke();
    }

    private drawContentBody() {
        let graphics = this.node.getChildByName("Content").getChildByName("Background").getComponent(Graphics);
        let contentSize = graphics.getComponent(UITransform).contentSize;

        let x = -(contentSize.width / 2);
        let y = -(contentSize.height / 2);
        let width = contentSize.width;
        let height = contentSize.height;

        graphics.clear();
        graphics.rect(x, y, width, height);
        graphics.fillColor = new Color("#844200");
        graphics.fill();
    }

    update(deltaTime: number) {

    }
}


