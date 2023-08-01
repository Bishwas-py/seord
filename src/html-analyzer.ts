import {type CheerioAPI, load} from "cheerio";
import type {Link, LinksGroup} from "./interfaces";

/**
 * Class to analyze HTML content
 * @class
 */
export class HtmlAnalyzer {
    public htmlDom:  CheerioAPI;
    public siteDomainName: string|null;

    constructor(htmlContent: string, siteDomainName: string | null = null) {
        this.htmlDom = load(htmlContent);
        this.siteDomainName = siteDomainName;
    }


    getAllLinks(): Link[] {
        let allLinks: Link[] = []
        this.htmlDom("a").each((index: number, element) => {
            let hrefElement = this.htmlDom(element);
            const href = hrefElement.attr('href') as string;
            const text = hrefElement.text() as string;

            allLinks.push({
                href,
                text
            });
        });
        return allLinks;
    }

    isRelativeLink(href: string): boolean {
        return href.startsWith('./') || href.startsWith('../') || href.startsWith('/') || href.startsWith('#');
    }

    startAsAbsoluteLink(href: string): boolean {
        return href.startsWith('http://') || href.startsWith('https://');
    }

    isMailToLink(href: string): boolean {
        return href.startsWith('mailto:');
    }


    isInternalLink(href: string): boolean {
        return (this.siteDomainName && href.includes(this.siteDomainName) && this.startAsAbsoluteLink(href)) || this.isRelativeLink(href) && !this.isMailToLink(href);
    }


    getOutboundLinks(): LinksGroup {
        let allOutboundLinks = [] as Link[];
        let duplicateOutboundLinks = [] as Link[];
        let uniqueOutboundLinks = [] as Link[];
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


    getInternalLinks(): LinksGroup {
        let allInternalLinks = [] as Link[];
        let duplicateInternalLinks = [] as Link[];
        let uniqueInternalLinks = [] as Link[];
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


    getWordCount(): number {
        return this.htmlDom.text().split(' ').length;
    }
}
