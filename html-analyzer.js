const cheerio = require('cheerio');

/**
 * @typedef {{ text: string, href: string }} Link
 * @typedef {{all: Link[], duplicate: Link[], unique: Link[]}} LinkInfo
*/

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
     * Function to get total number of external links
     * @returns {Link[]} Array of external links
     */
    getAllLinks() {
        let allLinks = []
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
     * @returns LinkInfo
     */
    getOutboundLinks() {
        let allOutboundLinks = []
        let duplicateOutboundLinks = []
        let uniqueOutboundLinks = []
        this.getAllLinks().forEach((link) => {
            if (!this.isInternalLink(link.href)) {
                if (allOutboundLinks.find(l => l.href === link.href)) {
                    duplicateOutboundLinks.push(link)
                } else {
                    uniqueOutboundLinks.push(link);
                }
                allOutboundLinks.push(link)
            }
        });
        return {
            all: allOutboundLinks,
            duplicate: duplicateOutboundLinks,
            unique: uniqueOutboundLinks
        }
    }


    /**
     * Function to get total number of internal links
     * @returns LinkInfo
     */
    getInternalLinks() {
        let allInternalLinks = [];
        let duplicateInternalLinks = [];
        let uniqueInternalLinks = []
        this.getAllLinks().forEach((link) => {
            if (this.isInternalLink(link.href)) {
                if (allInternalLinks.find(l => l.href === link.href)) {
                    duplicateInternalLinks.push(link)
                } else {
                    uniqueInternalLinks.push(link);
                }
                allInternalLinks.push(link)
            }
        });
        return {
            all: allInternalLinks,
            duplicate: duplicateInternalLinks,
            unique: uniqueInternalLinks
        }
    }


    getWordCount() {
        return this.htmlDom.text().split(' ').length;
    }
}

module.exports = HtmlAnalyzer;