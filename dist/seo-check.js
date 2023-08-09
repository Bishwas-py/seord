"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoCheck = void 0;
const seo_analyzer_1 = require("./seo-analyzer");
const html_analyzer_1 = require("./html-analyzer");
class SeoCheck {
    constructor(contentJson, siteDomainName = null, strictMode = false) {
        this.content = contentJson;
        this.makeContentLowerCase();
        this.siteDomainName = siteDomainName;
        this.htmlAnalyzer = new html_analyzer_1.HtmlAnalyzer(this.content.htmlText, this.siteDomainName);
        this.seoAnalyzer = new seo_analyzer_1.SeoAnalyzer(this.content, this.htmlAnalyzer, strictMode);
    }
    makeContentLowerCase() {
        this.content.title = this.content.title.toLowerCase();
        this.content.metaDescription = this.content.metaDescription.toLowerCase();
        this.content.keyword = this.content.keyword.toLowerCase();
        this.content.subKeywords = this.content.subKeywords.map((subKeyword) => {
            return subKeyword.toLowerCase();
        });
    }
    analyzeSeo() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.SeoCheck = SeoCheck;
//# sourceMappingURL=seo-check.js.map