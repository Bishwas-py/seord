import { type CheerioAPI } from "cheerio";
import type { Heading, Link, LinksGroup } from "./interfaces";
/**
 * Class to analyze HTML content
 * @class
 */
export declare class HtmlAnalyzer {
    htmlDom: CheerioAPI;
    siteDomainName: string | null;
    bodyText: string;
    constructor(htmlContent: string, siteDomainName?: string | null);
    getAllLinks(): Link[];
    getAllHeadingTags(): Heading[];
    isRelativeLink(href: string): boolean;
    startAsAbsoluteLink(href: string): boolean;
    isMailToLink(href: string): boolean;
    isInternalLink(href: string): boolean;
    getOutboundLinks(): LinksGroup;
    getInternalLinks(): LinksGroup;
    getPureText(stringContent: string): string;
    getWordCount(stringContent?: string | null): number;
}
