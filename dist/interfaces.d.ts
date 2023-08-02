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
}
interface ContentJson {
    question: string;
    keyword: string;
    subKeywords: string[];
    htmlText: string;
    metaDescription: string;
    languageCode: string;
    countryCode: string;
}
interface SeoData {
    seoScore: number;
    keywordSeoScore: number;
    messages: {
        warnings: string[];
        goodPoints: string[];
    };
    keywordDensity: number;
    subKeywordDensity: KeywordDensity[];
    totalLinks: number;
    internalLinks: LinksGroup;
    outboundLinks: LinksGroup;
    questionSEO: {
        subKeywordsWithQuestion: KeywordDensity[];
        keywordWithQuestion: KeywordDensity;
    };
}
export { Link, LinksGroup, KeywordDensity, ContentJson, SeoData };
