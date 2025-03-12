import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    private player: Node = null;
    private cameraWidth: number = 1920;
    private cameraHeight: number = 1080;
    private bottomY: number = -540;          //最下方的邊界(Y軸)
    private cameraWidthOffset: number = 240; //鏡頭寬度與螢幕寬度之落差
    private isTouchLRBorder: boolean = false;

    start() {

    }

    update(deltaTime: number) {

    }

    lateUpdate(deltaTime: number) {
        if (this.player) {
            const halfOfCameraWidth = (this.cameraWidth + this.cameraWidthOffset) / 2;
            const halfOfCameraHeight = this.cameraHeight / 2;

            // 以角色為中心，計算往下延伸的距離是否離開最下方的邊界
            if (this.player.position.y - halfOfCameraHeight >= this.bottomY) {
                let offsetY = Math.abs((this.player.position.y - halfOfCameraHeight) - this.bottomY);
                this.node.setPosition(this.node.position.x, offsetY);
                // console.log("距離下方邊界:", offsetY);
            }

            if (!this.isTouchLRBorder) {
                this.node.setPosition(this.player.position.x, this.node.position.y);
            }

            // 以角色為中心，計算往左及往右的延伸距離是否達到左右的邊界
            if ((this.player.position.x) + halfOfCameraWidth >= this.cameraWidth + this.cameraWidthOffset ||
                (this.player.position.x) - halfOfCameraWidth <= -(this.cameraWidth + this.cameraWidthOffset)) {
                this.isTouchLRBorder = true;
            } else {
                this.isTouchLRBorder = false;
            }
        }
    }

    public resetCamera() {
        this.player = null;
        this.node.setPosition(0, 0, 0);
    }

    public set setPlayer(focusRole: Node) {
        this.player = focusRole;
        this.isTouchLRBorder = false;
    }
}


