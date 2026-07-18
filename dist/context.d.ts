import { HtmlDocument } from "./html";
import type { ContentInput, Heading, KeywordDensity, Link, LinksGroup } from "./types";
export declare class AnalysisContext {
    readonly content: ContentInput;
    readonly siteDomainName: string | null;
    readonly html: HtmlDocument;
    readonly headings: Heading[];
    readonly allLinks: Link[];
    readonly internalLinks: LinksGroup;
    readonly outboundLinks: LinksGroup;
    readonly wordCount: number;
    readonly titleWordCount: number;
    readonly keywordDensity: number;
    readonly keywordFrequency: number;
    readonly keywordInTitle: KeywordDensity;
    readonly subKeywordDensities: KeywordDensity[];
    readonly subKeywordsInTitle: KeywordDensity[];
    readonly keywordInMetaDescription: KeywordDensity;
    readonly subKeywordsInMetaDescription: KeywordDensity[];
    constructor(input: ContentInput, siteDomainName?: string | null);
}
