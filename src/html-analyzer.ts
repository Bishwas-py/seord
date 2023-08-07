import {type CheerioAPI, load} from "cheerio";
import type {Heading, Link, LinksGroup} from "./interfaces";

/**
 * Class to analyze HTML content
 * @class
 */
export class HtmlAnalyzer {
    public htmlDom: CheerioAPI;
    public siteDomainName: string | null;
    public bodyText: string;

    constructor(htmlContent: string, siteDomainName: string | null = null) {
        this.htmlDom = load(htmlContent);
        this.siteDomainName = siteDomainName;
        this.bodyText = this.htmlDom.text().toLowerCase();
    }


    getAllLinks(): Link[] {
        let allLinks: Link[] = []
        this.htmlDom("a").each((index: number, element) => {
            let hrefElement = this.htmlDom(element);
            const href = hrefElement.attr('href') as string;
            const text = hrefElement.text() as string;
            if (href) {
                allLinks.push({
                    href,
                    text
                });
            }
        });
        return allLinks;
    }

    getAllHeadingTags(): Heading[] {
        let allHeadingTags: Heading[] = []
        this.htmlDom("h1,h2,h3,h4,h5,h6").each((index: number, element) => {
            let headingElement = this.htmlDom(element);
            allHeadingTags.push({
                text: headingElement.text(),
                tag: headingElement.prop('tagName')
            });
        });
        return allHeadingTags;
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
            if (link.href && !this.isInternalLink(link.href)) {
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
            if (link.href && this.isInternalLink(link.href)) {
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

    getPureText(stringContent: string) {
        let gapSpaceRegex = /\s+/gi;
        return stringContent.trim().replace(gapSpaceRegex, ' ');
    }

    getWordCount(stringContent: string | null = null): number {
        stringContent = stringContent ? stringContent.toLowerCase() : this.htmlDom.text().toLowerCase();
        return this.getPureText(stringContent).split(' ').length;
    }

}
