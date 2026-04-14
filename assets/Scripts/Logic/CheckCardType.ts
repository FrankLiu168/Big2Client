// cardrule.ts

// 模拟 Go 中的 consts.CardType
export const enum CardType {
    CARD_TYPE_UNKNOWN = 0,
    CARD_TYPE_SINGLE = 1,
    CARD_TYPE_ONE_PAIR = 2,
    CARD_TYPE_STRAIGHT = 3,
    CARD_TYPE_FULL_HOUSE = 4,
    CARD_TYPE_FOUR_OF_A_KIND = 5,
    CARD_TYPE_STRAIGHT_FLUSH = 6,
    // 可按需添加 FOUR_OF_A_KIND 等
}

/**
 * 获取牌型
 */
export function getCardType(cards: number[]): CardType {
    if (isStraightFlush(cards)) return CardType.CARD_TYPE_STRAIGHT_FLUSH;
    if (isFourOfAKind(cards)) return CardType.CARD_TYPE_FOUR_OF_A_KIND;
    if (isFullHouse(cards)) return CardType.CARD_TYPE_FULL_HOUSE;
    if (isStraight(cards)) return CardType.CARD_TYPE_STRAIGHT;
    if (isPair(cards)) return CardType.CARD_TYPE_ONE_PAIR;
    if (isSingle(cards)) return CardType.CARD_TYPE_SINGLE;
    return CardType.CARD_TYPE_UNKNOWN;
}

export function isSingle(cards: number[]): boolean {
    return cards.length === 1;
}

export function isPair(cards: number[]): boolean {
    if (cards.length !== 2) return false;
    return (cards[0] % 100) === (cards[1] % 100);
}

export function isStraight(cards: number[]): boolean {
    if (cards.length !== 5) return false;

    const nums = cards.map(c => c % 100).sort((a, b) => a - b);

    // 特殊顺子：A-10-J-Q-K (1,10,11,12,13)
    const specialStraight = [1, 10, 11, 12, 13];
    if (nums.every((v, i) => v === specialStraight[i])) {
        return true;
    }

    // 普通顺子检查
    for (let i = 0; i < 4; i++) {
        if (nums[i] + 1 !== nums[i + 1]) {
            return false;
        }
    }
    return true;
}

export function isFullHouse(cards: number[]): boolean {
    if (cards.length !== 5) return false;

    const nums = cards.map(c => c % 100);
    const countMap = new Map<number, number>();

    for (const num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }

    if (countMap.size !== 2) return false;

    const counts = Array.from(countMap.values()).sort();
    // 必须是 [2, 3]
    return counts[0] === 2 && counts[1] === 3;
}

export function isFourOfAKind(cards: number[]): boolean {
    if (cards.length !== 5) return false;

    const nums = cards.map(c => c % 100); // 注意：原 Go 代码错误地用了 %4，应为 %100 取点数
    const countMap = new Map<number, number>();

    for (const num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }

    if (countMap.size !== 2) return false;

    const counts = Array.from(countMap.values());
    return counts.some(c => c === 4) && counts.some(c => c === 1);
}

function isFlush(cards: number[]): boolean {
    if (cards.length < 5) return false;
    const suit = Math.floor(cards[0] / 100);
    return cards.every(card => Math.floor(card / 100) === suit);
}

export function isStraightFlush(cards: number[]): boolean {
    return isStraight(cards) && isFlush(cards);
}