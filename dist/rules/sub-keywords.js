"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subKeywordDensity = exports.subKeywordsPresence = void 0;
const defaults_1 = require("../defaults");
const hasSubKeywords = (ctx) => ctx.content.subKeywords.length > 0;
exports.subKeywordsPresence = {
    id: "sub-keywords-presence",
    weight: 4,
    evaluate: (ctx) => hasSubKeywords(ctx)
        ? { status: "good", message: `Good, your content has sub keywords "${ctx.content.subKeywords.join(", ")}".` }
        : { status: "minor", message: "Missing sub keywords, please add some." },
};
exports.subKeywordDensity = {
    id: "sub-keyword-density",
    weight: 6,
    appliesTo: hasSubKeywords,
    evaluate: (ctx) => ctx.subKeywordDensities.map((kd) => {
        if (kd.density > defaults_1.THRESHOLDS.subKeyword.maxDensity) {
            return {
                status: "warning",
                message: `The density of sub keyword "${kd.keyword}" is too high in the content, i.e. ${kd.density.toFixed(2)}%.`,
            };
        }
        if (kd.density < defaults_1.THRESHOLDS.subKeyword.minDensity) {
            const lowness = kd.density < defaults_1.THRESHOLDS.subKeyword.extremeLowDensity ? "too low" : "low";
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
//# sourceMappingURL=sub-keywords.js.map