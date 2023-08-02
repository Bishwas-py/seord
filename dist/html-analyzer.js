"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlAnalyzer = void 0;
const cheerio_1 = require("cheerio");
/**
 * Class to analyze HTML content
 * @class
 */
class HtmlAnalyzer {
    constructor(htmlContent, siteDomainName = null) {
        this.htmlDom = (0, cheerio_1.load)(htmlContent);
        this.siteDomainName = siteDomainName;
    }
    getAllLinks() {
        let allLinks = [];
        this.htmlDom("a").each((index, element) => {
            let hrefElement = this.htmlDom(element);
            const href = hrefElement.attr('href');
            const text = hrefElement.text();
            allLinks.push({
                href,
                text
            });
        });
        return allLinks;
    }
    isRelativeLink(href) {
        return href.startsWith('./') || href.startsWith('../') || href.startsWith('/') || href.startsWith('#');
    }
    startAsAbsoluteLink(href) {
        return href.startsWith('http://') || href.startsWith('https://');
    }
    isMailToLink(href) {
        return href.startsWith('mailto:');
    }
    isInternalLink(href) {
        return (this.siteDomainName && href.includes(this.siteDomainName) && this.startAsAbsoluteLink(href)) || this.isRelativeLink(href) && !this.isMailToLink(href);
    }
    getOutboundLinks() {
        let allOutboundLinks = [];
        let duplicateOutboundLinks = [];
        let uniqueOutboundLinks = [];
        this.getAllLinks().forEach((link) => {
            if (!this.isInternalLink(link.href)) {
                if (allOutboundLinks.find(l => l.href === link.href)) {
                    duplicateOutboundLinks.push(link);
                }
                else {
                    uniqueOutboundLinks.push(link);
                }
                allOutboundLinks.push(link);
            }
        });
        return {
            all: allOutboundLinks,
            duplicate: duplicateOutboundLinks,
            unique: uniqueOutboundLinks
        };
    }
    getInternalLinks() {
        let allInternalLinks = [];
        let duplicateInternalLinks = [];
        let uniqueInternalLinks = [];
        this.getAllLinks().forEach((link) => {
            if (this.isInternalLink(link.href)) {
                if (allInternalLinks.find(l => l.href === link.href)) {
                    duplicateInternalLinks.push(link);
                }
                else {
                    uniqueInternalLinks.push(link);
                }
                allInternalLinks.push(link);
            }
        });
        return {
            all: allInternalLinks,
            duplicate: duplicateInternalLinks,
            unique: uniqueInternalLinks
        };
    }
    getWordCount() {
        return this.htmlDom.text().split(' ').length;
    }
}
exports.HtmlAnalyzer = HtmlAnalyzer;
//# sourceMappingURL=html-analyzer.js.map