// player-action-check.ts

import * as CheckCardType from './CheckCardType';
import * as CompareCardType from './CompareCardType';

   

export interface PlayerAction {
    isPass : boolean
    cardType: CheckCardType.CardType;
    cards: number[];
}

export interface PlayerInfo {
    playerID: number,
    handCards: number[],
}

export class PlayerActionCheck {
    /**
     * 检查玩家出牌动作是否合法
     */
    public isActionValid(
        isFirst : boolean,
        tableAction : PlayerAction,
        action: PlayerAction,
        info: PlayerInfo,
    ): [boolean, string] {
        let flag: boolean;
        let msg: string;

        // 1. 检查牌型是否已知
        [flag, msg] = this.checkCardType(action);
        if (!flag) return [false, msg];

        // 2. 检查手牌是否包含所出的牌
        [flag, msg] = this.checkHandCards(action, info);
        if (!flag) return [false, msg];

        // 3. 检查所出牌是否符合该牌型规则
        [flag, msg] = this.checkCardTypeWithCards(action);
        if (!flag) return [false, msg];

        // 4. 如果桌面上有牌，需进一步校验
        if (tableAction != null) {
            // 4a. 检查是否允许切换牌型（如炸弹压其他）
            [flag, msg] = this.checkCardTypeWithDesktop(isFirst,tableAction, action);
            if (!flag) return [false, msg];

            // 4b. 比较大小
            [flag, msg] = this.compareCards(tableAction, action);
            if (!flag) return [false, msg];
        }

        return [true, ''];
    }

    private checkCardType(action: PlayerAction): [boolean, string] {
        if (action.cardType === CheckCardType.CardType.CARD_TYPE_UNKNOWN) {
            return [false, '未知的牌型'];
        }
        return [true, ''];
    }

    private checkCardTypeWithDesktop(isFirst : boolean,tableAction : PlayerAction, action: PlayerAction): [boolean, string] {
        // 如果是第一手，无需比较
        if (isFirst) {
            return [true, ''];
        }



        // 特殊规则：四条及以上可压任何牌（且牌型更大）
        if (
            action.cardType >= CheckCardType.CardType.CARD_TYPE_FOUR_OF_A_KIND &&
            action.cardType > tableAction.cardType
        ) {
            return [true, ''];
        }

        // 否则必须同牌型
        if (tableAction.cardType !== action.cardType) {
            return [false, '與當前桌面牌型不一致'];
        }

        return [true, ''];
    }

    private checkCardTypeWithCards(action: PlayerAction): [boolean, string] {
        switch (action.cardType) {
            case CheckCardType.CardType.CARD_TYPE_STRAIGHT_FLUSH:
                if (!CheckCardType.isStraightFlush(action.cards)) return [false, '所出的牌不是同花順'];
                break;
            case CheckCardType.CardType.CARD_TYPE_FOUR_OF_A_KIND:
                if (!CheckCardType.isFourOfAKind(action.cards)) return [false, '所出的牌不是鐵支'];
                break;
            case CheckCardType.CardType.CARD_TYPE_FULL_HOUSE:
                if (!CheckCardType.isFullHouse(action.cards)) return [false, '所出的牌不是葫蘆'];
                break;
            case CheckCardType.CardType.CARD_TYPE_STRAIGHT:
                if (!CheckCardType.isStraight(action.cards)) return [false, '所出的牌不是順子'];
                break;
            case CheckCardType.CardType.CARD_TYPE_ONE_PAIR:
                if (!CheckCardType.isPair(action.cards)) return [false, '所出的牌不是對子'];
                break;
            case CheckCardType.CardType.CARD_TYPE_SINGLE:
                if (!CheckCardType.isSingle(action.cards)) return [false, '所出的牌不是單張'];
                break;
        }
        return [true, ''];
    }

    private compareCards(
        tableAction : PlayerAction,
        action: PlayerAction
    ): [boolean, string] {
        // 特殊规则：更高阶炸弹可直接压
        if (
            action.cardType > tableAction.cardType &&
            action.cardType >= CheckCardType.CardType.CARD_TYPE_FOUR_OF_A_KIND
        ) {
            return [true, ''];
        }

        let flag = false;
        switch (tableAction.cardType) {
            case CheckCardType.CardType.CARD_TYPE_STRAIGHT_FLUSH:
                flag = CompareCardType.compareStraightFlush(tableAction.cards, action.cards);
                break;
            case CheckCardType.CardType.CARD_TYPE_FOUR_OF_A_KIND:
                flag = CompareCardType.compareFourOfAKind(tableAction.cards, action.cards);
                break;
            case CheckCardType.CardType.CARD_TYPE_FULL_HOUSE:
                flag = CompareCardType.compareFullHouse(tableAction.cards, action.cards);
                break;
            case CheckCardType.CardType.CARD_TYPE_STRAIGHT:
                flag = CompareCardType.compareStraight(tableAction.cards, action.cards);
                break;
            case CheckCardType.CardType.CARD_TYPE_ONE_PAIR:
                flag = CompareCardType.comparePair(tableAction.cards, action.cards);
                break;
            case CheckCardType.CardType.CARD_TYPE_SINGLE:
                flag = CompareCardType.compareSingle(tableAction.cards, action.cards);
                break;
            default:
                return [false, '不支持的牌型比较'];
        }

        if (flag) {
            return [true, ''];
        } else {
            return [false, '所出的牌比桌面的牌小，请重新出牌，或pass'];
        }
    }

    private checkHandCards(action: PlayerAction, info: PlayerInfo): [boolean, string] {
        const unMatchedCards: number[] = [];
        for (const card of action.cards) {
            if (info.handCards.indexOf(card) < 0) {
                unMatchedCards.push(card);
            }
        }

        if (unMatchedCards.length > 0) {
            //const cardNames = getCardNameList(unMatchedCards);
            //const names = cardNames.join(',');
            return [false, `所出的牌 ${unMatchedCards} 不在你的手牌里`];
        }

        return [true, ''];
    }
}