"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisContext = void 0;
const html_1 = require("./html");
const text_1 = require("./text");
class AnalysisContext {
    constructor(input, siteDomainName = null) {
        this.content = Object.assign(Object.assign({}, input), { title: input.title.toLowerCase(), keyword: input.keyword.toLowerCase(), subKeywords: input.subKeywords.map((subKeyword) => subKeyword.toLowerCase()), metaDescription: input.metaDescription.toLowerCase() });
        this.siteDomainName = siteDomainName;
        this.html = new html_1.HtmlDocument(this.content.htmlText);
        this.headings = this.html.headings();
        this.allLinks = this.html.links();
        this.internalLinks = (0, html_1.groupLinks)(this.allLinks, (href) => (0, html_1.isInternalHref)(href, siteDomainName));
        this.outboundLinks = (0, html_1.groupLinks)(this.allLinks, (href) => !(0, html_1.isInternalHref)(href, siteDomainName));
        this.wordCount = (0, text_1.wordCount)(this.html.bodyText);
        this.titleWordCount = (0, text_1.wordCount)(this.content.title);
        this.keywordDensity = (0, text_1.density)(this.content.keyword, this.html.bodyText);
        this.keywordFrequency = (0, text_1.countOccurrences)(this.content.keyword, this.html.bodyText);
        this.keywordInTitle = (0, text_1.keywordInText)(this.content.keyword, this.content.title);
        this.subKeywordDensities = this.content.subKeywords.map((subKeyword) => ({
            keyword: subKeyword,
            density: (0, text_1.density)(subKeyword, this.html.bodyText),
        }));
        this.subKeywordsInTitle = this.content.subKeywords.map((subKeyword) => (0, text_1.keywordInText)(subKeyword, this.content.title));
        this.keywordInMetaDescription = (0, text_1.keywordInText)(this.content.keyword, this.content.metaDescription);
        this.subKeywordsInMetaDescription = this.content.subKeywords.map((subKeyword) => (0, text_1.keywordInText)(subKeyword, this.content.metaDescription));
    }
}
exports.AnalysisContext = AnalysisContext;
//# sourceMappingURL=context.js.map