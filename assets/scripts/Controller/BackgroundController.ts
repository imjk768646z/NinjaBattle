import { _decorator, Component, Node, repeat, Sprite, SpriteFrame, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { getValue, ModelKey } from '../Model/Model';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {

    @property(Node)
    private back_end: Node = null;

    @property(Node)
    private front_end: Node = null;

    private backEndTween: Tween<Node> = null;
    private frontEndTween: Tween<Node> = null;

    public play() {
        this.stop();
        let spriteMap = getValue<Map<string, SpriteFrame>>(ModelKey.SpriteMap);
        // 設定圖片位置
        for (let i = 0; i < 2; i++) {
            // 設定遠景
            this.back_end.addChild(new Node());
            let backendSp = this.back_end.children[i].addComponent(Sprite);
            if (spriteMap != null) {
                backendSp.spriteFrame = spriteMap.get("seamless_ocean");
            }
            const backendWidth = this.back_end.children[i].getComponent(UITransform).contentSize.width;
            this.back_end.children[i].setPosition((i * backendWidth), this.back_end.children[i].position.y, this.back_end.children[i].position.z);

            // 設定前景
            this.front_end.addChild(new Node());
            let frontendSp = this.front_end.children[i].addComponent(Sprite);
            if (spriteMap != null) {
                frontendSp.spriteFrame = spriteMap.get("seamless_road");
            }
            const frontendWidth = this.front_end.children[i].getComponent(UITransform).contentSize.width;
            this.front_end.children[i].setPosition(-(i * frontendWidth), this.front_end.children[i].position.y, this.front_end.children[i].position.z);
        }

        this.backEndTween = tween(this.back_end)
            .by(0.2, { position: new Vec3(-20, 0, 0) })
            .call(() => {
                // console.log("BackEnd 目前位置", this.back_end.position.x);
                if (this.back_end.position.x <= -1920) {
                    this.back_end.setPosition(0, this.back_end.position.y);
                }
            })
            .union()
            .repeatForever()
            .start()

        this.frontEndTween = tween(this.front_end)
            .by(0.2, { position: new Vec3(20, 0, 0) })
            .call(() => {
                // console.log("FrontEnd 目前位置", this.front_end.position.x);
                if (this.front_end.position.x >= 1920) {
                    this.front_end.setPosition(0, this.front_end.position.y);
                }
            })
            .union()
            .repeatForever()
            .start()
    }

    public stop() {
        if (this.backEndTween) this.backEndTween.stop();
        if (this.frontEndTween) this.frontEndTween.stop();

        if (this.back_end.children.length > 0) this.back_end.removeAllChildren();
        if (this.front_end.children.length > 0) this.front_end.removeAllChildren();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


