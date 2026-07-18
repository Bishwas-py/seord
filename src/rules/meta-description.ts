import { THRESHOLDS } from "../defaults";
import type { AnalysisContext } from "../context";
import type { Rule, RuleResult } from "../types";
import { checkRange } from "./helpers";

const hasMetaDescription = (ctx: AnalysisContext) => ctx.content.metaDescription !== "";

export const metaDescriptionLength: Rule = {
    id: "meta-description-length",
    weight: 8,
    evaluate: (ctx) => {
        const meta = ctx.content.metaDescription;
        if (!meta) return { status: "warning", message: "Missing meta description." };
        if (meta.length > THRESHOLDS.metaDescription.maxLength) {
            return {
                status: "warning",
                message: `Meta description is too long. It is ${meta.length} characters long, try reducing it.`,
            };
        }
        if (meta.length < THRESHOLDS.metaDescription.minLength) {
            return {
                status: "warning",
                message: `Meta description is too short. It is ${meta.length} characters long, try increasing it.`,
            };
        }
        return { status: "good", message: `Meta description is ${meta.length} characters long.` };
    },
};

export const metaDescriptionKeywordDensity: Rule = {
    id: "meta-description-keyword-density",
    weight: 6,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => {
        const metaDensity = ctx.keywordInMetaDescription.density;
        return checkRange(
            metaDensity,
            { min: THRESHOLDS.metaDescription.minKeywordDensity, max: THRESHOLDS.metaDescription.maxKeywordDensity },
            {
                tooLow: `Keyword density of meta description is too low. It is ${metaDensity.toFixed(2)}%, try increasing it.`,
                tooHigh: `Keyword density of meta description is too high. It is ${metaDensity.toFixed(2)}%, try decreasing it.`,
                inRange: `Keyword density of meta description is ${metaDensity.toFixed(2)}%, which is good.`,
            },
        );
    },
};

export const metaDescriptionStartsWithKeyword: Rule = {
    id: "meta-description-starts-with-keyword",
    weight: 2,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => {
        const lead = ctx.content.metaDescription.substring(0, 20);
        return (ctx.keywordInMetaDescription.position ?? -1) > 1
            ? {
                  status: "minor",
                  message: `Meta description does not start with keyword. It starts with "${lead}", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.`,
              }
            : { status: "good", message: `Meta description starts with keyword, i.e. "${lead}".` };
    },
};

export const metaDescriptionSubKeywords: Rule = {
    id: "meta-description-sub-keywords",
    weight: 4,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.subKeywords.length > 0,
    evaluate: (ctx) =>
        ctx.subKeywordsInMetaDescription.map((kd): RuleResult => {
            if (kd.density > THRESHOLDS.metaDescription.subKeywordMaxDensity) {
                return {
                    status: "warning",
                    message: `The density of sub keyword "${kd.keyword}" in meta description is too high, i.e. ${kd.density.toFixed(2)}%.`,
                };
            }
            if (kd.density < THRESHOLDS.metaDescription.subKeywordMinDensity) {
                const lowness = kd.density < THRESHOLDS.metaDescription.subKeywordExtremeLowDensity ? "too low" : "low";
                return {
                    status: "minor",
                    message: `The density of sub keyword "${kd.keyword}" in meta description is ${lowness}, i.e. ${kd.density.toFixed(2)}%.`,
                };
            }
            return {
                status: "good",
                message: `The density of sub keyword "${kd.keyword}" in meta description is ${kd.density.toFixed(2)}%.`,
            };
        }),
};
