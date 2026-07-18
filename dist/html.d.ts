import { type CheerioAPI } from "cheerio";
import type { Heading, Link, LinksGroup } from "./types";
export declare class HtmlDocument {
    readonly dom: CheerioAPI;
    readonly bodyText: string;
    constructor(htmlText: string);
    headings(): Heading[];
    links(): Link[];
}
export declare function isAbsoluteHref(href: string): boolean;
export declare function isRelativeHref(href: string): boolean;
export declare function isMailtoHref(href: string): boolean;
export declare function isInternalHref(href: string, siteDomainName: string | null): boolean;
export declare function groupLinks(links: Link[], predicate: (href: string) => boolean): LinksGroup;
