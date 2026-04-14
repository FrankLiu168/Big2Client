import { Vec3, _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UserCard')
export class UserCard extends Component {
    @property(Node)
    public light: Node = null!;
    private clickable = false;
    private orginVec3: Vec3 = null;
    private cardNum : number;
    private isSelected = false

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onNodeClicked, this);
        this.light.active = false;
    }

    setCardNum(cardNum: number) {
        this.cardNum = cardNum;
    }

    getCardNum() : number {
        return this.cardNum
    }

    setClickable(clickable: boolean) {
        this.clickable = clickable;
    }

    update(deltaTime: number) {

    }
    getIsSelected() {
        return this.isSelected
    }


    onNodeClicked(event: Event) {
        if (!this.clickable) {
            return;
        }
        //console.log('Node 被点击了！');
        this.light.active = !this.light.active;
        this.isSelected = this.light.active
        if (this.light.active) {
            this.orginVec3 = this.node.getPosition();
            this.node.setPosition(this.node.position.x, this.node.position.y + 10 + 0);
        } else {
            this.node.setPosition(this.orginVec3);
        }
        // event 可以获取点击位置、目标等信息
    }
}

