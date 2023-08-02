"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoCheck = void 0;
const seo_analyzer_1 = require("./seo-analyzer");
const html_analyzer_1 = require("./html-analyzer");
class SeoCheck {
    constructor(contentJson, siteDomainName = null) {
        this.content = contentJson;
        this.siteDomainName = siteDomainName;
        this.htmlAnalyzer = new html_analyzer_1.HtmlAnalyzer(this.content.htmlText, this.siteDomainName);
        this.seoAnalyzer = new seo_analyzer_1.SeoAnalyzer(this.content, this.htmlAnalyzer);
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
            questionSEO: {
                subKeywordsWithQuestion: this.seoAnalyzer.getSubKeywordsInQuestion(),
                keywordWithQuestion: this.seoAnalyzer.getKeywordInQuestion(),
            }
        };
    }
}
exports.SeoCheck = SeoCheck;
//# sourceMappingURL=seo-check.js.map