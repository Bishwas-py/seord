import { HtmlDocument, groupLinks, isInternalHref } from "./html";
import { countOccurrences, density, keywordInText, wordCount } from "./text";
import type { ContentInput, Heading, KeywordDensity, Link, LinksGroup } from "./types";

export class AnalysisContext {
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

    constructor(input: ContentInput, siteDomainName: string | null = null) {
        this.content = {
            ...input,
            title: input.title.toLowerCase(),
            keyword: input.keyword.toLowerCase(),
            subKeywords: input.subKeywords.map((subKeyword) => subKeyword.toLowerCase()),
            metaDescription: input.metaDescription.toLowerCase(),
        };
        this.siteDomainName = siteDomainName;
        this.html = new HtmlDocument(this.content.htmlText);
        this.headings = this.html.headings();
        this.allLinks = this.html.links();
        this.internalLinks = groupLinks(this.allLinks, (href) => isInternalHref(href, siteDomainName));
        this.outboundLinks = groupLinks(this.allLinks, (href) => !isInternalHref(href, siteDomainName));
        this.wordCount = wordCount(this.html.bodyText);
        this.titleWordCount = wordCount(this.content.title);
        this.keywordDensity = density(this.content.keyword, this.html.bodyText);
        this.keywordFrequency = countOccurrences(this.content.keyword, this.html.bodyText);
        this.keywordInTitle = keywordInText(this.content.keyword, this.content.title);
        this.subKeywordDensities = this.content.subKeywords.map((subKeyword) => ({
            keyword: subKeyword,
            density: density(subKeyword, this.html.bodyText),
        }));
        this.subKeywordsInTitle = this.content.subKeywords.map((subKeyword) =>
            keywordInText(subKeyword, this.content.title),
        );
        this.keywordInMetaDescription = keywordInText(this.content.keyword, this.content.metaDescription);
        this.subKeywordsInMetaDescription = this.content.subKeywords.map((subKeyword) =>
            keywordInText(subKeyword, this.content.metaDescription),
        );
    }
}
