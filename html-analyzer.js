const cheerio = require('cheerio');

/**
 * Class to analyze HTML content
 * @class
 */
class HtmlAnalyzer {
    /**
     * Constructor
     * @param {string} htmlContent - The HTML content to be analyzed
     * @param {?string} siteDomainName - Domain name of the website
     */
    constructor(htmlContent, siteDomainName) {
        this.htmlDom = cheerio.load(htmlContent);
        this.siteDomainName = siteDomainName || '<unknown>';
    }

    /**
     * Function to get total number of links
     * @returns {number} Total number of links
     */
    getTotalLinks() {
        return this.htmlDom("a").length;
    }

    /**
     * Function to get total number of internal links
     * @returns {number} Total number of internal links
     */
    getTotalInternalLinks() {
        let internalLinksCount = 0;
        this.htmlDom("a").each((index, element) => {
            const href = this.htmlDom(element).attr('href');
            this.isInternalLink(href) && internalLinksCount++;
        });
        return internalLinksCount;
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


    /**
     * Function to check if the link is internal or not
     * @param href
     * @returns {*|boolean}
     */
    isInternalLink(href) {
        return (href.includes(this.siteDomainName) && this.startAsAbsoluteLink(href)) || this.isRelativeLink(href) && !this.isMailToLink(href);
    }

    /**
     * Function to get total number of outbound links
     * @returns {number} Total number of outbound links
     */
    getTotalOutboundLinks() {
        let outboundLinksCount = 0;
        this.htmlDom("a").each((index, element) => {
            const href = this.htmlDom(element).attr('href');
            if (!this.isInternalLink(href)) {
                outboundLinksCount++;
            }
        });
        return outboundLinksCount;
    }
}

module.exports = HtmlAnalyzer;