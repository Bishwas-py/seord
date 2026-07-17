"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeKeywordSeoScore = exports.computeSeoScore = void 0;
const CREDIT = { good: 1, minor: 0.5, warning: 0 };
function computeSeoScore(evaluated) {
    let earned = 0;
    let applicable = 0;
    for (const { rule, results } of evaluated) {
        if (results.length === 0)
            continue;
        const credit = results.reduce((total, result) => total + CREDIT[result.status], 0) / results.length;
        earned += rule.weight * credit;
        applicable += rule.weight;
    }
    if (applicable === 0)
        return 0;
    return Math.round((earned / applicable) * 10000) / 100;
}
exports.computeSeoScore = computeSeoScore;
function computeKeywordSeoScore(ctx) {
    const subKeywordsInTitleCount = ctx.subKeywordsInTitle.filter((kd) => kd.density > 0).length;
    const subKeywordsDensityScore = ctx.subKeywordDensities.reduce((total, kd) => total + kd.density * 10, 0);
    const total = ctx.keywordInTitle.density * 10 +
        subKeywordsInTitleCount * 10 +
        subKeywordsDensityScore +
        ctx.keywordDensity * 10;
    return Math.min(total, 100);
}
exports.computeKeywordSeoScore = computeKeywordSeoScore;
//# sourceMappingURL=scoring.js.map