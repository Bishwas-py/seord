import type { HtmlAnalyzer } from "./html-analyzer";
import type { ContentJson, KeywordDensity } from "./interfaces";
export declare class SeoAnalyzer {
    MINIMUM_KEYWORD_DENSITY: number;
    MAXIMUM_KEYWORD_DENSITY: number;
    MAXIMUM_SUB_KEYWORD_DENSITY: number;
    MINIMUM_SUB_KEYWORD_DENSITY: number;
    EXTREME_LOW_SUB_KEYWORD_DENSITY: number;
    MAXIMUM_META_DESCRIPTION_LENGTH: number;
    MAXIMUM_META_DESCRIPTION_DENSITY: number;
    MINIMUM_META_DESCRIPTION_DENSITY: number;
    MAXIMUM_TITLE_LENGTH: number;
    MINIMUM_TITLE_LENGTH: number;
    MAXIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY: number;
    MINIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY: number;
    content: ContentJson;
    htmlAnalyzer: HtmlAnalyzer;
    keywordDensity: number;
    messages: {
        warnings: string[];
        minorWarnings: string[];
        goodPoints: string[];
    };
    constructor(content: ContentJson, htmlAnalyzer: HtmlAnalyzer);
    getSubKeywordsDensity(): KeywordDensity[];
    totalUniqueInternalLinksCount(): number;
    totalUniqueExternalLinksCount(): number;
    getKeywordInTitle(keyword?: string | null): KeywordDensity;
    getSubKeywordsInTitle(): KeywordDensity[];
    getKeywordInMetaDescription(keyword?: string | null): KeywordDensity;
    getSubKeywordsInMetaDescription(): KeywordDensity[];
    getSeoScore(): number;
    getKeywordSeoScore(): number;
    getTitleWordCount(): number;
    private assignMessagesForKeyword;
    private assignMessagesForSubKeywords;
    private assignMessagesForTitle;
    private assignMessagesForLinks;
    private assignMessagesForMetaDescription;
    /**
     * Returns the messages object.
     * @return object The messages object.
     * @example
     * {
     *    goodPoints: [],
     *    warnings: [],
     *    minorWarnings: [],
     * }
     * @see SeoAnalyzer.messages
     */
    private assignMessages;
    /**
     * Calculates the density of a keyword in the given string of body text.
     * @param keyword Should not be null.
     * @param bodyText If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     */
    calculateDensity(keyword: string, bodyText?: string | null): number;
    /**
     * Returns the number of occurrences of a keyword in a string. Or you can say, it returns the keyword count in the given string.
     * @param keyword If null, it will use the default value, i.e. `this.content.keyword`
     * @param stringContent If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     * @return number The number of occurrences of the keyword in the string.
     */
    countOccurrencesInString(keyword?: string | null, stringContent?: string | null): number;
}
