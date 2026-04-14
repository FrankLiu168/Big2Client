import { tween, Sprite, _decorator, Component, Node, resources, SpriteFrame, log, Asset, instantiate, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { UserPanel1 } from './UserPanel1';
import { UserPanel2 } from './UserPanel2';
import { Table } from './Table';
import { IconCom } from './IconCom';
import * as Commands from './Command/commands';
import { WebSocketClient } from './WebSocketClient';
import { EventGo } from './EventGo';
import { PlayerInfo,PlayerAction,PlayerActionCheck } from './Logic/ActionCheck';
import {  getCardType , CardType} from './Logic/CheckCardType';
// 工具函数：将 callback API 转为 Promise
function loadDirAsPromise<T extends Asset>(path: string, type?: new () => T): Promise<T[]> {
    return new Promise((resolve, reject) => {
        resources.loadDir(path, type, (err, assets: T[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(assets || []);
            }
        });
    });
}

@ccclass('GameScene')
export class GameScene extends Component {
    @property(Node)
    userPanelA: Node = null!;
    @property(Node)
    userPanelB: Node = null!;
    @property(Node)
    userPanelC: Node = null!;
    @property(Node)
    userPanelD: Node = null!;
    @property(Prefab)
    cardPrefab1: Prefab = null!;
    @property(Node)
    tableNode: Node = null!;
    @property(Node)
    IconNode: Node = null!;

    private _cardSpriteFrames: Map<string, SpriteFrame> = new Map();
    private _userPanelA: UserPanel1 = null!;
    private _userPanelB: UserPanel2 = null!;
    private _userPanelC: UserPanel1 = null!;
    private _userPanelD: UserPanel2 = null!;
    private _userPanelMap = new Map<string, UserPanel1 | UserPanel2>();
    private _startX = 500
    private _startY = 350
    //private wsClient: WebSocketClient = null;
    private replyID : string = ""
    private tableCom : Table = null;
    private seatMap = new Map<number,string>()
    private iconCom : IconCom = null;
    private playerInfo : PlayerInfo = null;
    private actionCheck : PlayerActionCheck = new PlayerActionCheck();
    private tableAction : PlayerAction = null;
    private isFirstAction : boolean = true;
    private countdownSeatName : string = ""

    private _test = 0

    async start() {
        await this.preloadAllCardSprites(); // ✅ 现在会真正等待加载完成
        log("创建游戏场景");
        this.initMap();
        this.tableCom = this.tableNode.getComponent(Table);
        this.iconCom = this.IconNode.getComponent(IconCom);
        this.playerInfo = {
            playerID: 1,
            handCards: [],
        };
        //this.dispatchAction()
        //this.startWebsocket();
        EventGo.on("server-message-game",(cmd : Commands.BasePayload)=>{
            this.onAction(cmd);
        });
    }

    initMap() {
        this._userPanelA = this.userPanelA.getComponent(UserPanel1);
        this._userPanelB = this.userPanelB.getComponent(UserPanel2);
        this._userPanelC = this.userPanelC.getComponent(UserPanel1);
        this._userPanelD = this.userPanelD.getComponent(UserPanel2);

        this._userPanelA.setScene(this);
        this._userPanelB.setScene(this);
        this._userPanelC.setScene(this);
        this._userPanelD.setScene(this);

        this._userPanelMap.set('A', this._userPanelA);
        this._userPanelMap.set('B', this._userPanelB);
        this._userPanelMap.set('C', this._userPanelC);
        this._userPanelMap.set('D', this._userPanelD);

        this.seatMap.set(1, "A");
        this.seatMap.set(2, "B");
        this.seatMap.set(3, "C");
        this.seatMap.set(4, "D");

    }

    // works(type: string) {
    //     this._userPanelMap.get(type).setScene(this);
    //     this._userPanelMap.get(type).setCards([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113])
    // }

    async dispatchAction(cards : number[]) {
        const orders = ["A", "B", "C", "D"]
        let idx = 0
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let cardNum = 0
                let index = i * 13 + j
                index = index % 4
                if (index == 0) {
                     cardNum = cards[idx]
                    idx++;
                }
                const order = orders[index]
                await this.dispatchCard(order, cardNum)
                this._userPanelMap.get(order).addCard(cardNum)
                this.playerInfo.handCards.push(cardNum)
            }
        }
    }

    dispatchCard(whichPanel: string, cardNum: number): Promise<boolean> {
        const panel = this._userPanelMap.get(whichPanel);
        const card = instantiate(this.cardPrefab1)
        card.parent = this.node;
        card.setPosition(this._startX, this._startY, 0);
        const cardImage = card.getChildByName("CardImage")

        const sprite = cardImage.getComponent(Sprite);
        let cardName = "s"
        if (cardNum > 0) {
            cardName = cardNum + ""
        }
        sprite.spriteFrame = this.getSpriteFrame(cardName);
        const p = new Promise<boolean>((resolve, reject) => {
            tween(card)
                .to(0.1, { position: new Vec3(panel.getSpot().x, panel.getSpot().y, 0) })   // 1.5 秒内移动到 endPos
                .call(() => {
                    card.destroy();
                    resolve(true)
                })
                .start();
        })
        return p
    }

    async onAction(basePayload: Commands.BasePayload) {
        log("call onAction")
        if (basePayload.commandAction == Commands.CommandAction.OnCmdServerDealCards) {
            const payload = JSON.parse(basePayload.data) as Commands.CmdServerDealCards;
            await this.dispatchAction(payload.cards)
        }
        if (basePayload.commandAction == Commands.CommandAction.OnCmdServerNewRound) {
            this.tableCom.newRound()
            this.tableAction = null
            this.isFirstAction = true
        }
        if (basePayload.commandAction == Commands.CommandAction.OnCmdServerCurrentPlayer) {
            const payload = JSON.parse(basePayload.data) as Commands.CmdServerCurrentPlayer;
            const seatName = this.seatMap.get(payload.playerID)
            const nowUnix = Math.floor(Date.now() / 1000);
            const remainingSeconds = payload.takeTime - nowUnix;
            this.countdownSeatName = seatName;
            this.iconCom.showTimer(seatName, remainingSeconds)
            if (payload.playerID == 1) {
                this._userPanelA.setCanOperator(true)
                this.replyID = payload.replyID;
            }
        }
        if (basePayload.commandAction == Commands.CommandAction.OnCmdServerPlayerAction) {
            const payload = JSON.parse(basePayload.data) as Commands.CmdServerPlayerAction;
            const seatName = this.seatMap.get(payload.playerID)
            if (payload.playerID == this.playerInfo.playerID && !payload.isPass) {
                const cardsToRemove = new Set(payload.cards);
                this.playerInfo.handCards = this.playerInfo.handCards
                .filter(card => !cardsToRemove.has(card));
                for (const card of payload.cards) {
                    this._userPanelA.removeCard(card)
                }
                this._userPanelA.updateCards()
            } else if(!payload.isPass) {
                const seat = this.seatMap.get(payload.playerID)
                const panel = this._userPanelMap.get(seat)
                panel.removeHideCard(payload.cards.length)
            }
            this.isFirstAction = false
            this.iconCom.clearCountdown(this.countdownSeatName)
            if (payload.isPass) {
                this.tableCom.showPass(seatName)
            } else {
                await this.tableCom.showCards(seatName, payload.cards)
                this.tableAction = {
                    isPass: payload.isPass,
                    cardType: payload.cardType,
                    cards: payload.cards
                }
            }
        }
        if (basePayload.commandAction == Commands.CommandAction.OnCmdServerGameOver) {
            this.tableCom.setGameOver(true)
        }
    }

    onClick(cmd: string) {
        if (cmd == "start") {
            // const payload : Commands.CmdClientReady = {
            //     playerID: 1,
            //     //replyID: "12345"
            // }
            // const basePayload : Commands.BasePayload = {
            //     commandAction: Commands.CommandAction.OnCmdClientReady,
            //     commandSubAction: 0,
            //     data: JSON.stringify(payload),
            //     target: ""
            // }
            // EventGo.emit("client-message",basePayload)
        }
        if (cmd == "send") {
            const isPass = false;
            const cards = this._userPanelA.getSelectedCards();
            log("selected cards",cards)
            const sendCardType = getCardType(cards)
            const action : PlayerAction = {
                isPass : isPass,
                cardType : sendCardType,
                cards : cards
            }
            const [isOk,msg] = this.actionCheck.isActionValid(this.isFirstAction, this.tableAction, action,this.playerInfo)
            if (!isOk) {
                log(msg)
                return
            } else {
                log("isOk")
            }
            const payload : Commands.CmdClientPlayerAction = {
                replyID: this.replyID,          // json: "replyID"
                playerID: this.playerInfo.playerID,         // json: "playerID"
                isPass: action.isPass,          // json: "isPass"
                cardType: action.cardType,       // json: "cardType"
                cards: action.cards,          // json: "cards"
                reason: "",           // json: "reason"
            }
            const basePayload : Commands.BasePayload = {
                commandAction: Commands.CommandAction.OnCmdClientPlayerAction,
                commandSubAction:0,
                target: "",
                data: JSON.stringify(payload),
            }
            this.replyID = ""
            EventGo.emit("client-message",basePayload)
        }
        if (cmd == "pass") {;
            const payload : Commands.CmdClientPlayerAction = {
                replyID: this.replyID,          // json: "replyID"
                playerID: this.playerInfo.playerID,         // json: "playerID"
                isPass: true,          // json: "isPass"
                cardType: 0,       // json: "cardType"
                cards: [],          // json: "cards"
                reason: "",           // json: "reason"
            }
            const basePayload : Commands.BasePayload = {
                commandAction: Commands.CommandAction.OnCmdClientPlayerAction,
                commandSubAction: 0,
                target: "",
                data: JSON.stringify(payload),
            }
            this.replyID = ""
            EventGo.emit("client-message",basePayload)
        }
        // const textes = ["A", "B", "C", "D"]
        // const text = textes[this._test % 4]
        // if (arg == "send") {

        //     log("show  cards")
        //     const p = this.tableNode.getComponent(Table)
        //     //p.showCards("A",[101,102,103,104,105])
        //     await p.showCards(text, [101, 102])
        //     this._test++
        //     //p.showCards("A",[101])
        // }
        // if (arg == "pass") {
        //     log("ClickObj.onClick pass");
        //     const p = this.IconNode.getComponent(IconCom)
        //     p.showTimer(text, 15)
        //     this._test++

        // }
        // if (arg == "test1") {
        //     const p = this.tableNode.getComponent(Table)
        //     p.showPass(text)
        //     this._test++

        // }
    }



    update(deltaTime: number) { }

    public getSpriteFrame(cardName: string): SpriteFrame | null {
        return this._cardSpriteFrames.get(cardName) || null;
    }

    async preloadAllCardSprites() {
        try {
            const assets = await loadDirAsPromise<SpriteFrame>('Cards', SpriteFrame);
            assets.forEach(spriteFrame => {
                this._cardSpriteFrames.set(spriteFrame.name, spriteFrame);
            });
            console.log(`Preloaded ${this._cardSpriteFrames.size} card images.`);
        } catch (err) {
            console.error('Failed to load cards directory:', err);
        }
    }

    public sendCommand(command: Commands.BasePayload) {

    }

    // public startWebsocket() {
    //     // 建立實例
    //     this.wsClient = new WebSocketClient('ws://127.0.0.1:8080/ws');

    //     // 設定回調
    //     this.wsClient.onOpen = () => {
    //         console.log('連線成功！');
    //         //wsClient.send({ cmd: 'login', playerId: 1001 });
    //     };

    //     this.wsClient.onMessage = (data) => {
    //         console.log('收到伺服器訊息:', data);
    //         EventGo.emit("server-message",data)
    //         // 處理你的遊戲協議
    //     };

    //     this.wsClient.onError = (err) => {
    //         console.error('WebSocket 錯誤:', err);
    //     };

    //     this.wsClient.onClose = (code, reason) => {
    //         console.log(`連線關閉: ${code} - ${reason}`);
    //     };

    //     // 發起連線
    //     this.wsClient.connect();

    // }
}