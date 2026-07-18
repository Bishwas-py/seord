"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSeo = void 0;
const context_1 = require("./context");
const rules_1 = require("./rules");
const scoring_1 = require("./scoring");
function analyzeSeo(content, options = {}) {
    var _a, _b;
    const ctx = new context_1.AnalysisContext(content, (_a = options.siteDomainName) !== null && _a !== void 0 ? _a : null);
    const disabled = (_b = options.rules) !== null && _b !== void 0 ? _b : {};
    const evaluated = [];
    for (const rule of rules_1.allRules) {
        if (disabled[rule.id] === "off")
            continue;
        if (rule.appliesTo && !rule.appliesTo(ctx))
            continue;
        const results = [].concat(rule.evaluate(ctx));
        if (results.length === 0)
            continue;
        evaluated.push({ rule, results });
    }
    const outcomes = evaluated.flatMap(({ rule, results }) => results.map((result) => ({ id: rule.id, status: result.status, weight: rule.weight, message: result.message })));
    return {
        seoScore: (0, scoring_1.computeSeoScore)(evaluated),
        keywordSeoScore: (0, scoring_1.computeKeywordSeoScore)(ctx),
        messages: buildMessages(outcomes),
        rules: outcomes,
        keyword: { density: ctx.keywordDensity, frequency: ctx.keywordFrequency, inTitle: ctx.keywordInTitle },
        subKeywords: { density: ctx.subKeywordDensities, inTitle: ctx.subKeywordsInTitle },
        links: { total: ctx.allLinks.length, internal: ctx.internalLinks, outbound: ctx.outboundLinks },
        words: { total: ctx.wordCount, title: ctx.titleWordCount },
    };
}
exports.analyzeSeo = analyzeSeo;
function buildMessages(outcomes) {
    const messages = { warnings: [], minorWarnings: [], goodPoints: [] };
    for (const outcome of outcomes) {
        if (outcome.status === "good")
            messages.goodPoints.push(outcome.message);
        else if (outcome.status === "warning")
            messages.warnings.push(outcome.message);
        else
            messages.minorWarnings.push(outcome.message);
    }
    return messages;
}
//# sourceMappingURL=analyze.js.map