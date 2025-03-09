import { _decorator, AnimationClip, Component, Label, Node, ProgressBar, resources, SpriteFrame } from 'cc';
import { getValue, ModelKey, setValue } from './Model/Model';
const { ccclass, property } = _decorator;

@ccclass('LoadRes')
export class LoadRes extends Component {

    @property(Label)
    private loadingMsg: Label = null;

    private progressBar: ProgressBar = null;

    private funcs = [
        this.loadMariaAnimationClips.bind(this),
        this.loadShinzoAnimationClips.bind(this),
    ];

    private funcsIdx = 0;

    onLoad() {
        this.progressBar = this.node.getComponent(ProgressBar);
    }

    start() {

    }

    async load() {
        //開始載入資源
        console.log("開始載入資源");
        await this.nextLoad("載入動畫 Maria", true);
    }

    private loadMariaAnimationClips() {
        return new Promise(res => {
            resources.loadDir("/animation_clips/ninja_maria", AnimationClip, async (err, clips) => {
                if (err) {
                    res(null);
                } else {
                    console.log("! maria clips:", clips)
                    let map = getValue<Map<string, AnimationClip[]>>(ModelKey.NinjaAnimation);
                    if (map == null) {
                        map = new Map<string, AnimationClip[]>();
                    }
                    map.set("Maria_Animation", clips);
                    setValue<Map<string, AnimationClip[]>>(ModelKey.NinjaAnimation, map);
                    await this.nextLoad("載入動畫 Shinzo", true);
                    res(clips);
                }
            })
        })
    }

    private loadShinzoAnimationClips() {
        return new Promise(res => {
            setTimeout(async () => {
                await this.nextLoad("", false);
                res("success");
            }, 3000);
        })
    }

    private async nextLoad(msg: string, isNext: boolean = false) {
        console.log("準備載入:", msg, " 是否載入下一個資源:", isNext);
        if (isNext) {
            if (this.funcsIdx < this.funcs.length) {
                let func = this.funcs[this.funcsIdx];
                this.funcsIdx++;
                if (func) {
                    this.loadingMsg.string = msg;
                    this.progressBar.progress = this.funcsIdx / this.funcs.length;
                    await func();
                }

            }
        } else {
            console.log("資源載入完成，關閉該節點")
            //關閉該節點
            this.node.active = false;
            setValue<boolean>(ModelKey.IsLoaded, true);
        }
    }

    update(deltaTime: number) {

    }
}
