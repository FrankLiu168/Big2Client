import { Vec2, _decorator, Component, Node, Prefab, instantiate, Sprite, resources, SpriteFrame, log } from 'cc';
const { ccclass, property } = _decorator;
import { GameScene } from './GameScene';
import { UserCard } from './UserCard';
@ccclass('UserPanel1')
export class UserPanel1 extends Component {

    @property(Prefab)
    public cardPrefab: Prefab = null!;
    @property(Boolean)
    public isPlayer: boolean = false;

    protected cards: number[] = [];
    protected gameScene: GameScene = null!;
    protected cardComs: UserCard[] = [];

    private _x = -140
    private _y = 0
    private canOperator = false
    public getSpot(): Vec2 {
        return new Vec2(this.node.position.x, this.node.position.y);
    }

    public setCanOperator(canOperator: boolean) {
        this.canOperator = canOperator;
        this.updateCards()
    }
    public setScene(scene: GameScene) {
        this.gameScene = scene;
    }

    public setCards(cards: number[]) {
        this.cards = cards;
        this.updateCards();
    }

    public addCard(card: number) {
        this.cards.push(card)
        this.updateCards();
    }

    public removeCard(card: number) {
        const index = this.cards.indexOf(card);
        if (index >= 0) {
            this.cards.splice(index, 1); // 直接修改原数组，不赋值！
        }
    }

    public removeHideCard(cardSize : number) {
        this.cards.splice(0,cardSize);
        this.updateCards();
    }

    public getSelectedCards(): number[] {
        let selectedCards = [];
        for (let i = 0; i < this.cardComs.length; i++) {
            const element = this.cardComs[i];
            if (element.getIsSelected()) {
                selectedCards.push(element.getCardNum())
            }
        }
        return selectedCards;
    }

    public updateCards() {
        // 清除所有已有子节点
        this.node.destroyAllChildren();
        this.cardComs = [];

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            let card = instantiate(this.cardPrefab);
            card.parent = this.node;
            card.setPosition(this._x + i * 25, this._y, 0);
            if (this.isPlayer && this.canOperator) {
                const userCard = card.getComponent(UserCard);
                userCard.setCardNum(element);
                this.cardComs.push(userCard);
                userCard.setClickable(true);
            }
            const cardImage = card.getChildByName("CardImage");
            const sprite = cardImage.getComponent(Sprite);
            const cardName = this.cards[i] + ""
            sprite.spriteFrame = this.gameScene.getSpriteFrame(cardName);
        }
    }

}