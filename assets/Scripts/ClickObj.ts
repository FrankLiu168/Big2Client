import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameScene } from './GameScene';

@ccclass('ClickObj')
export class ClickObj extends Component {
    @property(Node)
    public desk: Node = null!;
    private gameScene: GameScene = null!;
    start() {
        this.gameScene = this.desk.getComponent(GameScene)!;
    }

    update(deltaTime: number) {

    }

    public onSendClick() {
        this.gameScene.onClick("send");
    }
    public onPassClick() {
        this.gameScene.onClick("pass");

    }

    public onStart() {
        this.gameScene.onClick("start");

    }


}

