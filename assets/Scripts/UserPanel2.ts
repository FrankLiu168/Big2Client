import { Vec2, _decorator, Component, Node, Prefab, instantiate, Sprite, resources, SpriteFrame, log } from 'cc';
const { ccclass, property } = _decorator;
import { GameScene } from './GameScene';
@ccclass('UserPanel2')
export class UserPanel2 extends Component {

    @property(Prefab)
    public cardPrefab: Prefab = null!;

    protected cards: number[] = [];
    protected gameScene: GameScene = null!;

    private _x = 0
    private _y = 140
    public getSpot(): Vec2 {
        return new Vec2(this.node.position.x, this.node.position.y);
    }
    public setScene(scene: GameScene) {
        this.gameScene = scene;
    }
    public setCards(cards: number[]) {
        this.cards = cards;
        this.updateCards();
    }

    public addCard(card: number) {
        this.cards.push(card);
        this.updateCards();
    }

    public removeHideCard(cardSize : number) {
        this.cards.splice(0,cardSize);
        this.updateCards();
    }

    public updateCards() {
        // 清除所有已有子节点
        this.node.destroyAllChildren();

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            let card = instantiate(this.cardPrefab);
            card.parent = this.node;
            card.setPosition(this._x, this._y - i * 15, 0);

            const cardImage = card.getChildByName("CardImage");
            const sprite = cardImage.getComponent(Sprite);
            const cardName = this.cards[i] + ""
            sprite.spriteFrame = this.gameScene.getSpriteFrame(cardName);
        }
    }

}

