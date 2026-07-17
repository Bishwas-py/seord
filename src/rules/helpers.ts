import type { RuleResult, RuleStatus } from "../types";

export interface RangeMessages { tooLow: string; tooHigh: string; inRange: string }

export function checkRange(
    value: number,
    range: { min: number; max: number },
    messages: RangeMessages,
    lowStatus: RuleStatus = "warning",
): RuleResult {
    if (value > range.max) return { status: "warning", message: messages.tooHigh };
    if (value < range.min) return { status: lowStatus, message: messages.tooLow };
    return { status: "good", message: messages.inRange };
}
