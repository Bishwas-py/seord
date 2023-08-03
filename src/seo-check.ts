
import { SeoAnalyzer } from './seo-analyzer';
import { HtmlAnalyzer } from './html-analyzer';
import {ContentJson} from "./interfaces";

export class SeoCheck {
    public content: ContentJson;
    public siteDomainName: string|null;
    public htmlAnalyzer: HtmlAnalyzer;
    public seoAnalyzer: SeoAnalyzer;

    constructor(contentJson: ContentJson, siteDomainName: string|null = null) {
        this.content = contentJson;
        this.content.title = this.content.title.toLowerCase();
        this.assignKeywordsToLowerCase();
        this.siteDomainName = siteDomainName;
        this.htmlAnalyzer = new HtmlAnalyzer(this.content.htmlText, this.siteDomainName);
        this.seoAnalyzer = new SeoAnalyzer(
            this.content,
            this.htmlAnalyzer
        );
    }

    private assignKeywordsToLowerCase() {
        this.content.keyword = this.content.keyword.toLowerCase();
        this.content.subKeywords = this.content.subKeywords.map((subKeyword) => {
            return subKeyword.toLowerCase();
        });
    }

    analyzeSeo() {
        return {
            seoScore: this.seoAnalyzer.getSeoScore(),
            wordCount: this.htmlAnalyzer.getWordCount(),
            keywordSeoScore: this.seoAnalyzer.getKeywordSeoScore(),
            keywordFrequency: this.seoAnalyzer.countOccurrencesInString(),
            messages: this.seoAnalyzer.messages,
            keywordDensity: this.seoAnalyzer.keywordDensity,
            subKeywordDensity: this.seoAnalyzer.getSubKeywordsDensity(),
            totalLinks: this.htmlAnalyzer.getAllLinks().length,
            internalLinks: this.htmlAnalyzer.getInternalLinks(),
            outboundLinks: this.htmlAnalyzer.getOutboundLinks(),
            titleSEO: {
                subKeywordsWithTitle: this.seoAnalyzer.getSubKeywordsInTitle(),
                keywordWithTitle: this.seoAnalyzer.getKeywordInTitle(),
                wordCount: this.seoAnalyzer.getTitleWordCount(),
            }
        };
    }
}