import { Label, _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IconCom')
export class IconCom extends Component {
    @property(Node)
    public playerA: Node = null!;
    @property(Node)
    public playerB: Node = null!;
    @property(Node)
    public playerC: Node = null!;
    @property(Node)
    public playerD: Node = null!;

    private playerMap = new Map<string, Node>()
    private countdownMap = new Map<string, boolean>()
    start() {
        this.playerMap.set('A', this.playerA);
        this.playerMap.set('B', this.playerB);
        this.playerMap.set('C', this.playerC);
        this.playerMap.set('D', this.playerD);

        this.countdownMap.set('A', false);
        this.countdownMap.set('B', false);
        this.countdownMap.set('C', false);
        this.countdownMap.set('D', false);
    }

    showTimer(seat: string, seconds: number) {
        const player = this.playerMap.get(seat);
        const bg = player.getChildByName('Bg');
        const timer = bg.getChildByName('Timer')
        const label = timer.getComponent(Label)
        this.startCountdown(seat,label, seconds, null)
        this.countdownMap.set(seat, true);
    }
    clearCountdown(seatName) {
        this.countdownMap.set(seatName, false);
    }
    startCountdown(seatName: string,label: Label, seconds: number, onFinish?: () => void) {
        if (!label || seconds <= 0) return;

        let timeLeft = seconds;
        const node = label.node;

        // 立即顯示初始值
        label.string = timeLeft.toString();

        // 每秒更新一次
        const tick = () => {
            timeLeft--;
            label.string = timeLeft.toString();
            if (!this.countdownMap.get(seatName)) {
                label.string = ""
                label.unschedule(tick);
            }
            if (timeLeft <= 0) {
                label.string = ""
                label.unschedule(tick);
                if (onFinish) onFinish();
            }
        };

        // 開始排程（每 1 秒執行一次）
        label.schedule(tick, 1.0);
    }
    update(deltaTime: number) {

    }
}

