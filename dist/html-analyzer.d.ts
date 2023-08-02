import { type CheerioAPI } from "cheerio";
import type { Link, LinksGroup } from "./interfaces";
/**
 * Class to analyze HTML content
 * @class
 */
export declare class HtmlAnalyzer {
    htmlDom: CheerioAPI;
    siteDomainName: string | null;
    constructor(htmlContent: string, siteDomainName?: string | null);
    getAllLinks(): Link[];
    isRelativeLink(href: string): boolean;
    startAsAbsoluteLink(href: string): boolean;
    isMailToLink(href: string): boolean;
    isInternalLink(href: string): boolean;
    getOutboundLinks(): LinksGroup;
    getInternalLinks(): LinksGroup;
    getWordCount(): number;
}
