import type { RuleResult, RuleStatus } from "../types";
export interface RangeMessages {
    tooLow: string;
    tooHigh: string;
    inRange: string;
}
export declare function checkRange(value: number, range: {
    min: number;
    max: number;
}, messages: RangeMessages, lowStatus?: RuleStatus): RuleResult;
