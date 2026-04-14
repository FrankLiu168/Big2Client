import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameScene } from './GameScene';
import { RoomScene } from './RoomScene';
@ccclass('ClickObj')
export class ClickObj extends Component {
    @property(Node)
    public desk: Node = null!;
    private gameScene: GameScene = null!;
    public bg : Node = null!;
    private roomScene: RoomScene = null!;
    start() {
        this.gameScene = this.desk.getComponent(GameScene)!;
        this.roomScene = this.bg.getComponent(RoomScene)!;
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

    public onReady() {
        this.roomScene.onClick("ready");

    }

    public 
}

