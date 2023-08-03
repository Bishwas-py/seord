interface Link {
    text: string;
    href: string;
}
interface LinksGroup {
    all: Link[];
    duplicate: Link[];
    unique: Link[];
}
interface KeywordDensity {
    keyword: string;
    density: number;
    position?: number;
}
interface ContentJson {
    title: string;
    keyword: string;
    subKeywords: string[];
    htmlText: string;
    metaDescription: string;
    languageCode: string;
    countryCode: string;
}
interface SeoData {
    seoScore: number;
    wordCount: number;
    keywordSeoScore: number;
    keywordFrequency: number;
    messages: {
        warnings: string[];
        goodPoints: string[];
        minorWarnings: string[];
    };
    keywordDensity: number;
    subKeywordDensity: KeywordDensity[];
    totalLinks: number;
    internalLinks: LinksGroup;
    outboundLinks: LinksGroup;
    titleSEO: {
        subKeywordsWithTitle: KeywordDensity[];
        keywordWithTitle: KeywordDensity;
        wordCount: number;
    };
}
export { Link, LinksGroup, KeywordDensity, ContentJson, SeoData };
