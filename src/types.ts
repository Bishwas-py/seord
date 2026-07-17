import type { AnalysisContext } from "./context";

export interface Link { text: string; href: string }
export interface LinksGroup { all: Link[]; duplicate: Link[]; unique: Link[] }
export interface KeywordDensity { keyword: string; density: number; position?: number }
export interface Heading { text: string; tag: string }

export interface ContentInput {
    title: string;
    htmlText: string;
    keyword: string;
    subKeywords: string[];
    metaDescription: string;
}

export interface AnalyzeOptions {
    siteDomainName?: string;
    rules?: Record<string, "off">;
}

export type RuleStatus = "good" | "warning" | "minor";

export interface RuleResult { status: RuleStatus; message: string }

export interface Rule {
    id: string;
    weight: number;
    appliesTo?: (ctx: AnalysisContext) => boolean;
    evaluate: (ctx: AnalysisContext) => RuleResult | RuleResult[];
}

export interface EvaluatedRule { rule: Rule; results: RuleResult[] }

export interface RuleOutcome { id: string; status: RuleStatus; weight: number; message: string }

export interface Messages { warnings: string[]; minorWarnings: string[]; goodPoints: string[] }

export interface SeoAnalysisResult {
    seoScore: number;
    keywordSeoScore: number;
    messages: Messages;
    rules: RuleOutcome[];
    keyword: { density: number; frequency: number; inTitle: KeywordDensity };
    subKeywords: { density: KeywordDensity[]; inTitle: KeywordDensity[] };
    links: { total: number; internal: LinksGroup; outbound: LinksGroup };
    words: { total: number; title: number };
}
