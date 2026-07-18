import { THRESHOLDS } from "../defaults";
import type { AnalysisContext } from "../context";
import type { Rule, RuleResult } from "../types";

const hasSubKeywords = (ctx: AnalysisContext) => ctx.content.subKeywords.length > 0;

export const subKeywordsPresence: Rule = {
    id: "sub-keywords-presence",
    weight: 4,
    evaluate: (ctx) =>
        hasSubKeywords(ctx)
            ? { status: "good", message: `Good, your content has sub keywords "${ctx.content.subKeywords.join(", ")}".` }
            : { status: "minor", message: "Missing sub keywords, please add some." },
};

export const subKeywordDensity: Rule = {
    id: "sub-keyword-density",
    weight: 6,
    appliesTo: hasSubKeywords,
    evaluate: (ctx) =>
        ctx.subKeywordDensities.map((kd): RuleResult => {
            if (kd.density > THRESHOLDS.subKeyword.maxDensity) {
                return {
                    status: "warning",
                    message: `The density of sub keyword "${kd.keyword}" is too high in the content, i.e. ${kd.density.toFixed(2)}%.`,
                };
            }
            if (kd.density < THRESHOLDS.subKeyword.minDensity) {
                const lowness = kd.density < THRESHOLDS.subKeyword.extremeLowDensity ? "too low" : "low";
                return {
                    status: "minor",
                    message: `The density of sub keyword "${kd.keyword}" is ${lowness} in the content, i.e. ${kd.density.toFixed(2)}%.`,
                };
            }
            return {
                status: "good",
                message: `The density of sub keyword "${kd.keyword}" is ${kd.density.toFixed(2)}% in the content, which is good.`,
            };
        }),
};
