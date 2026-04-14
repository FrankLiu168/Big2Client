import { Vec3, Sprite, log, _decorator, Component, Node, Prefab, instantiate, tween } from 'cc';
const { ccclass, property } = _decorator;
import { GameScene } from './GameScene';
@ccclass('Table')
export class Table extends Component {
    @property(Node)
    public showHandA: Node = null!;

    @property(Node)
    public showHandB: Node = null!;

    @property(Node)
    public showHandC: Node = null!;

    @property(Node)
    public showHandD: Node = null!;

    @property(Node)
    public onTable: Node = null!;

    @property(Prefab)
    public cardPrefab: Prefab = null!;

    @property(Node)
    public desk: Node = null!;

    private showHandMap = new Map<string, Node>();
    private readonly validSeats = ['A', 'B', 'C', 'D'];
    private gameScene: GameScene = null!;
    private gameOverNode: Node = null;
    onLoad() {
        this.node.active = false;
        log("pass-start")

        this.showHandMap.set('A', this.showHandA)
        this.showHandMap.set('B', this.showHandB)
        this.showHandMap.set('C', this.showHandC)
        this.showHandMap.set('D', this.showHandD)

        this.gameOverNode = this.onTable.getChildByName("GameOver")
        this.gameOverNode.active = false

        for (let key of this.validSeats) {
            this.showHandMap.get(key)!.active = false

        }

        this.gameScene = this.desk.getComponent(GameScene);
        this.newRound()
    }

    newRound() {
        this.node.active = true
        this.onTable.active = false
        const tableBg = this.onTable.getChildByName("Bg")
        tableBg.destroyAllChildren()
    }

    /**
     * 顯示指定座位的 "Pass" 提示，2 秒後自動隱藏
     * @param seat 座位標識，必須為 'A'、'B'、'C' 或 'D'
     */
    showPass(seat: string) {
        log(seat)
        const hand = this.showHandMap.get(seat)
        const bg = hand.getChildByName("Bg")
        const passText = hand.getChildByName("PassText")
        hand.active = true
        passText.active = true
        bg.active = false
        this.node.active = true;


        // 2 秒後隱藏（使用引擎排程，安全且自動清理）
        this.scheduleOnce(() => {
            hand.active = false;
            passText.active = false;
        }, 2.0);
    }

    showCards(seat: string, cardNos: number[]): Promise<boolean> {
        const hand = this.showHandMap.get(seat)
        const passText = hand.getChildByName("PassText")
        const bg = hand.getChildByName("Bg")
        const onTableBg = this.onTable.getChildByName("Bg")
        hand.active = true
        passText.active = false
        bg.active = true;
        let startPosX = 0
        if (cardNos.length == 5) {
            startPosX = startPosX - 50
        }
        bg.destroyAllChildren()
        const setCard = (i : number,cardNo : number,card: Node, parent: Node) => {

            card.parent = parent
            card.setPosition(startPosX + 25 * i, 0, 0)
            const cardImage = card.getChildByName("CardImage")
            const sprite = cardImage.getComponent(Sprite)
            sprite.spriteFrame = this.gameScene.getSpriteFrame(cardNo + "")
        }

        const create = (cardNums : number[], parent: Node) =>{
            for (let i = 0; i < cardNums.length; i++) {
                const cardNo = cardNums[i]
                const card1 = instantiate(this.cardPrefab)
                setCard(i,cardNo,card1, parent)
            }
        }
        create(cardNos, bg)

        
        this.onTable.active = true
        let promise = new Promise<boolean>((resolve, reject) => {
            const originPos = hand.getPosition()
            tween(hand)
                .to(1, { position: originPos })
                .call(() => {
                    onTableBg.destroyAllChildren()
                    onTableBg.active = false
                })
                .to(1, { position: new Vec3(0, 0, 0) })   // 1.5 秒内移动到 endPos
                .call(() => {
                    log('create table')
                    create(cardNos,onTableBg)
                    onTableBg.active = true
                    hand.active = false
                    hand.setPosition(originPos)
                    resolve(true)
                })
                .start();
        })
        return promise
    }

    public setGameOver(status: boolean) {
        this.gameOverNode.active = status
    }

    // 可選：保留 update，但目前無需實現
    update(deltaTime: number) {
        // 留空或移除均可
    }
}