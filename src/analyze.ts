import { AnalysisContext } from "./context";
import { allRules } from "./rules";
import { computeKeywordSeoScore, computeSeoScore } from "./scoring";
import type {
    AnalyzeOptions,
    ContentInput,
    EvaluatedRule,
    Messages,
    RuleOutcome,
    RuleResult,
    SeoAnalysisResult,
} from "./types";

export function analyzeSeo(content: ContentInput, options: AnalyzeOptions = {}): SeoAnalysisResult {
    const ctx = new AnalysisContext(content, options.siteDomainName ?? null);
    const disabled = options.rules ?? {};

    const evaluated: EvaluatedRule[] = [];
    for (const rule of allRules) {
        if (disabled[rule.id] === "off") continue;
        if (rule.appliesTo && !rule.appliesTo(ctx)) continue;
        const results = ([] as RuleResult[]).concat(rule.evaluate(ctx));
        if (results.length === 0) continue;
        evaluated.push({ rule, results });
    }

    const outcomes: RuleOutcome[] = evaluated.flatMap(({ rule, results }) =>
        results.map((result) => ({ id: rule.id, status: result.status, weight: rule.weight, message: result.message })),
    );

    return {
        seoScore: computeSeoScore(evaluated),
        keywordSeoScore: computeKeywordSeoScore(ctx),
        messages: buildMessages(outcomes),
        rules: outcomes,
        keyword: { density: ctx.keywordDensity, frequency: ctx.keywordFrequency, inTitle: ctx.keywordInTitle },
        subKeywords: { density: ctx.subKeywordDensities, inTitle: ctx.subKeywordsInTitle },
        links: { total: ctx.allLinks.length, internal: ctx.internalLinks, outbound: ctx.outboundLinks },
        words: { total: ctx.wordCount, title: ctx.titleWordCount },
    };
}

function buildMessages(outcomes: RuleOutcome[]): Messages {
    const messages: Messages = { warnings: [], minorWarnings: [], goodPoints: [] };
    for (const outcome of outcomes) {
        if (outcome.status === "good") messages.goodPoints.push(outcome.message);
        else if (outcome.status === "warning") messages.warnings.push(outcome.message);
        else messages.minorWarnings.push(outcome.message);
    }
    return messages;
}
