import { THRESHOLDS } from "../defaults";
import type { AnalysisContext } from "../context";
import type { Rule } from "../types";
import { checkRange } from "./helpers";

const hasKeyword = (ctx: AnalysisContext) => ctx.content.keyword !== "";

export const keywordPresence: Rule = {
    id: "keyword-presence",
    weight: 10,
    evaluate: (ctx) =>
        ctx.content.keyword
            ? { status: "good", message: `Good, your content has a keyword "${ctx.content.keyword}".` }
            : { status: "warning", message: "Missing main keyword, please add one." },
};

export const keywordOverstuffing: Rule = {
    id: "keyword-overstuffing",
    weight: 8,
    appliesTo: hasKeyword,
    evaluate: (ctx) =>
        ctx.keywordDensity > THRESHOLDS.keyword.overstuffingDensity
            ? { status: "warning", message: "Serious keyword overstuffing." }
            : { status: "good", message: "No keyword overstuffing." },
};

export const keywordDensityRule: Rule = {
    id: "keyword-density",
    weight: 10,
    appliesTo: hasKeyword,
    evaluate: (ctx) =>
        checkRange(
            ctx.keywordDensity,
            { min: THRESHOLDS.keyword.minDensity, max: THRESHOLDS.keyword.maxDensity },
            {
                tooLow: `Keyword density is too low. It is ${ctx.keywordDensity.toFixed(2)}%, try increasing it.`,
                tooHigh: `Keyword density is too high. It is ${ctx.keywordDensity.toFixed(2)}%, try decreasing it.`,
                inRange: `Keyword density is ${ctx.keywordDensity.toFixed(2)}%.`,
            },
        ),
};
