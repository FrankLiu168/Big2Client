// cardrule-compare.ts
export enum CompareType {
    CompareSingle,
    ComparePair,
    CompareStraight,
    CompareFullHouse,
    CompareFourOfAKind,
    CompareStraightFlush,
}
/**
 * 比较单张：cards2 是否能压 cards1
 * 返回 true 表示 cards2 > cards1
 */
export function compareSingle(cards1: number[], cards2: number[]): boolean {
    const rank1 = cards1[0] % 100;
    const rank2 = cards2[0] % 100;

    if (rank2 === rank1) {
        const suit1 = Math.floor(cards1[0] / 100);
        const suit2 = Math.floor(cards2[0] / 100);
        return suit2 > suit1; // 花色大的胜（假设花色数字越大越强）
    }

    // 特殊规则：2 最大，A 次之（但小于 2）
    if (rank2 === 2) return true;
    if (rank2 === 1 && rank1 !== 2) return true;

    // 普通比较（排除 A=1 和 2 的情况）
    if (rank1 !== 1 && rank1 !== 2 && rank2 > rank1) {
        return true;
    }

    return false;
}

/**
 * 比较对子
 */
export function comparePair(cards1: number[], cards2: number[]): boolean {
    const sorted1 = [...cards1].sort((a, b) => a - b);
    const sorted2 = [...cards2].sort((a, b) => a - b);

    const rank1 = sorted1[1] % 100; // 对子的点数（排序后第2张）
    const rank2 = sorted2[1] % 100;

    if (rank2 === rank1) {
        // 点数相同，比花色（这里简化为比整张牌值，或可改为比最小/最大花色）
        return sorted2[1] > sorted1[1];
    }

    // 点数不同，按单张规则比较（实际是比较对子点数）
    // 注意：这里复用 compareSingle 逻辑，但只传对子中的一张即可
    return compareSingle([sorted1[1]], [sorted2[1]]);
}

/**
 * 比较顺子
 */
export function compareStraight(cards1: number[], cards2: number[]): boolean {
    const sorted1 = [...cards1].sort((a, b) => a - b);
    const sorted2 = [...cards2].sort((a, b) => a - b);

    const rank1s = sorted1[0] % 100;
    const rank1e = sorted1[4] % 100;
    const rank2s = sorted2[0] % 100;
    const rank2e = sorted2[4] % 100;

    // 起始点相同
    if (rank2s === rank1s) {
        if (rank2s === 2) {
            // 2-3-4-5-6，比最小牌（即起始牌）
            return sorted2[0] > sorted1[0];
        }
        if (rank2s === 1 && rank2e === 5) {
            // A-2-3-4-5，比最大牌（5）
            return sorted2[4] > sorted1[4];
        }
        if (rank2s === 1 && rank2e === 13) {
            // 10-J-Q-K-A，比最小牌（10）
            return sorted2[0] > sorted1[0];
        }
        // 其他顺子，比最大牌
        return sorted2[4] > sorted1[4];
    }

    // 特殊顺子：10-J-Q-K-A（A=1, K=13）视为最大顺子（仅次于 2 开头的？根据你的规则）
    if (rank2s === 2) return true;
    if (rank2s === 1 && rank2e === 13 && rank1s !== 2) return true;
    if (rank1s === 2) return false;
    if (rank1s === 1 && rank1e === 13 && rank2s !== 2) return false;

    // 普通顺子比较结尾点数
    return rank2e > rank1e;
}

/**
 * 辅助函数：获取三张的点数（用于葫芦、四条）
 */
function getTripleRank(cards: number[]): number {
    const counts = new Map<number, number>();
    for (const card of cards) {
        const rank = card % 100;
        counts.set(rank, (counts.get(rank) || 0) + 1);
    }
    for (const [rank, count] of counts) {
        if (count >= 3) return rank;
    }
    return 0; // 不应发生
}

/**
 * 比较葫芦（Full House）
 */
export function compareFullHouse(cards1: number[], cards2: number[]): boolean {
    const triple1 = getTripleRank(cards1);
    const triple2 = getTripleRank(cards2);
    return triple2 > triple1;
}

/**
 * 比较四条（Four of a Kind）
 * 规则同葫芦：比四张的点数
 */
export function compareFourOfAKind(cards1: number[], cards2: number[]): boolean {
    // 复用 same logic as full house（实际应提取公共函数）
    const triple1 = getTripleRank(cards1); // 在四条中，getTripleRank 会返回四张的点数
    const triple2 = getTripleRank(cards2);
    return triple2 > triple1;
}

/**
 * 比较同花顺
 */
export function compareStraightFlush(cards1: number[], cards2: number[]): boolean {
    return compareStraight(cards1, cards2);
}