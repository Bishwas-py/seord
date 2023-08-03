import type { HtmlAnalyzer } from "./html-analyzer";
import type { ContentJson, KeywordDensity } from "./interfaces";
export declare class SeoAnalyzer {
    MINIMUM_KEYWORD_DENSITY: number;
    MAXIMUM_KEYWORD_DENSITY: number;
    content: ContentJson;
    htmlAnalyzer: HtmlAnalyzer;
    htmlDom: HtmlAnalyzer['htmlDom'];
    bodyText: string;
    messages: {
        warnings: string[];
        minorWarnings: string[];
        goodPoints: string[];
    };
    constructor(content: ContentJson, htmlAnalyzer: HtmlAnalyzer);
    getSubKeywordsDensity(): KeywordDensity[];
    assignDensityScore(key: any, defaultValue: any): any;
    calculateDensity(keyword: string, bodyText?: string | null): number;
    getKeywordDensity(): number;
    totalUniqueInternalLinksCount(): number;
    totalUniqueExternalLinksCount(): number;
    getKeywordInTitle(keyword?: string | null): KeywordDensity;
    getSubKeywordsInTitle(): KeywordDensity[];
    getKeywordInMetaDescription(keyword?: string | null): KeywordDensity;
    getSubKeywordsInMetaDescription(): KeywordDensity[];
    countOccurrencesInString(keyword?: string | null, stringContent?: string | null): number;
    getSeoScore(): number;
    getKeywordSeoScore(): number;
    getTitleWordCount(): number;
    assignMessagesForKeyword(): void;
    assignMessagesForSubKeywords(): void;
    assignMessagesForTitle(): void;
    assignMessagesForLinks(): void;
    assignMessagesForMetaDescription(): void;
    getMessages(): {
        warnings: string[];
        minorWarnings: string[];
        goodPoints: string[];
    };
}
