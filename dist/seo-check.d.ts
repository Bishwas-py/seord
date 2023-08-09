import { SeoAnalyzer } from './seo-analyzer';
import { HtmlAnalyzer } from './html-analyzer';
import { ContentJson } from "./interfaces";
export declare class SeoCheck {
    content: ContentJson;
    siteDomainName: string | null;
    htmlAnalyzer: HtmlAnalyzer;
    seoAnalyzer: SeoAnalyzer;
    constructor(contentJson: ContentJson, siteDomainName?: string | null, strictMode?: boolean);
    private makeContentLowerCase;
    analyzeSeo(): Promise<{
        seoScore: number;
        wordCount: number;
        keywordSeoScore: number;
        keywordFrequency: number;
        messages: {
            warnings: string[];
            minorWarnings: string[];
            goodPoints: string[];
        };
        keywordDensity: number;
        subKeywordDensity: import("./interfaces").KeywordDensity[];
        totalLinks: number;
        internalLinks: import("./interfaces").LinksGroup;
        outboundLinks: import("./interfaces").LinksGroup;
        titleSEO: {
            subKeywordsWithTitle: import("./interfaces").KeywordDensity[];
            keywordWithTitle: import("./interfaces").KeywordDensity;
            wordCount: number;
        };
    }>;
}
