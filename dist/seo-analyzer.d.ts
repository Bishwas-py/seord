import type { HtmlAnalyzer } from "./html-analyzer";
import type { ContentJson, KeywordDensity } from "./interfaces";
export declare class SeoAnalyzer {
    MINIMUM_KEYWORD_DENSITY: number;
    MAXIMUM_KEYWORD_DENSITY: number;
    content: ContentJson;
    htmlAnalyzer: HtmlAnalyzer;
    htmlDom: HtmlAnalyzer['htmlDom'];
    bodyText: string;
    constructor(content: ContentJson, htmlAnalyzer: HtmlAnalyzer);
    getSubKeywordsDensity(): KeywordDensity[];
    calculateDensity(keyword: string, bodyText?: string | null): number;
    getKeywordDensity(): number;
    totalUniqueInternalLinksCount(): number;
    totalUniqueExternalLinksCount(): number;
    getMessages(): {
        warnings: string[];
        goodPoints: string[];
    };
    getKeywordInQuestion(keyword?: string | null): KeywordDensity;
    getSubKeywordsInQuestion(): KeywordDensity[];
    countOccurrencesInString(keyword: string, string: string): number;
    getSeoScore(): number;
    getKeywordSeoScore(): number;
}
