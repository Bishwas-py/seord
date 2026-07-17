import { load, type CheerioAPI } from "cheerio";
import type { Heading, Link, LinksGroup } from "./types";

export class HtmlDocument {
    readonly dom: CheerioAPI;
    readonly bodyText: string;

    constructor(htmlText: string) {
        this.dom = load(htmlText);
        this.bodyText = this.dom.text().toLowerCase();
    }

    headings(): Heading[] {
        const found: Heading[] = [];
        this.dom("h1,h2,h3,h4,h5,h6").each((_, element) => {
            const el = this.dom(element);
            found.push({ text: el.text(), tag: el.prop("tagName") as string });
        });
        return found;
    }

    links(): Link[] {
        const found: Link[] = [];
        this.dom("a").each((_, element) => {
            const el = this.dom(element);
            const href = el.attr("href");
            if (href) found.push({ href, text: el.text() });
        });
        return found;
    }
}

export function isAbsoluteHref(href: string): boolean {
    return href.startsWith("http://") || href.startsWith("https://");
}

export function isRelativeHref(href: string): boolean {
    return href.startsWith("./") || href.startsWith("../") || href.startsWith("/") || href.startsWith("#");
}

export function isMailtoHref(href: string): boolean {
    return href.startsWith("mailto:");
}

export function isInternalHref(href: string, siteDomainName: string | null): boolean {
    return (
        (!!siteDomainName && href.includes(siteDomainName) && isAbsoluteHref(href)) ||
        (isRelativeHref(href) && !isMailtoHref(href))
    );
}

export function groupLinks(links: Link[], predicate: (href: string) => boolean): LinksGroup {
    const all: Link[] = [];
    const duplicate: Link[] = [];
    const unique: Link[] = [];
    for (const link of links) {
        if (!predicate(link.href)) continue;
        if (unique.some((seen) => seen.href === link.href)) {
            duplicate.push(link);
        } else {
            unique.push(link);
        }
        all.push(link);
    }
    return { all, duplicate, unique };
}
