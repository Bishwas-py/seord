
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
        this.siteDomainName = siteDomainName;
        this.htmlAnalyzer = new HtmlAnalyzer(this.content.htmlText, this.siteDomainName);
        this.seoAnalyzer = new SeoAnalyzer(
            this.content,
            this.htmlAnalyzer
        );
    }

    analyzeSeo() {
        return {
            seoScore: this.seoAnalyzer.getSeoScore(),
            keywordSeoScore: this.seoAnalyzer.getKeywordSeoScore(),
            messages: this.seoAnalyzer.getMessages(),
            keywordDensity: this.seoAnalyzer.getKeywordDensity(),
            subKeywordDensity: this.seoAnalyzer.getSubKeywordsDensity(),
            totalLinks: this.htmlAnalyzer.getAllLinks().length,
            internalLinks: this.htmlAnalyzer.getInternalLinks(),
            outboundLinks: this.htmlAnalyzer.getOutboundLinks(),
            titleSEO: {
                subKeywordsWithTitle: this.seoAnalyzer.getSubKeywordsInTitle(),
                keywordWithTitle: this.seoAnalyzer.getKeywordInTitle(),
            }
        };
    }
}