import { _decorator, Component, Label, Node } from 'cc';
import { getValue, ModelKey } from './Model/Model';
import { AudioEngineControl } from './Singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

@ccclass('GameResult')
export class GameResult extends Component {

    @property(Label)
    private score: Label = null;

    @property(Label)
    private countDown: Label = null;

    start() {

    }

    public showScore(deadID: string) {
        AudioEngineControl.getInstance().stopAll();
        AudioEngineControl.getInstance().playAudio("final");
        let playerUUID = getValue<string>(ModelKey.PlayerUUID);
        if (playerUUID == deadID) {
            this.score.string = "再接再厲!";
        } else {
            this.score.string = "恭喜~你贏了!";
        }
    }

    public showCountDown(time: number) {
        this.countDown.string = time.toString();
    }

    update(deltaTime: number) {

    }
}


