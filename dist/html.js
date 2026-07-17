"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupLinks = exports.isInternalHref = exports.isMailtoHref = exports.isRelativeHref = exports.isAbsoluteHref = exports.HtmlDocument = void 0;
const cheerio_1 = require("cheerio");
class HtmlDocument {
    constructor(htmlText) {
        this.dom = (0, cheerio_1.load)(htmlText);
        this.bodyText = this.dom.text().toLowerCase();
    }
    headings() {
        const found = [];
        this.dom("h1,h2,h3,h4,h5,h6").each((_, element) => {
            const el = this.dom(element);
            found.push({ text: el.text(), tag: el.prop("tagName") });
        });
        return found;
    }
    links() {
        const found = [];
        this.dom("a").each((_, element) => {
            const el = this.dom(element);
            const href = el.attr("href");
            if (href)
                found.push({ href, text: el.text() });
        });
        return found;
    }
}
exports.HtmlDocument = HtmlDocument;
function isAbsoluteHref(href) {
    return href.startsWith("http://") || href.startsWith("https://");
}
exports.isAbsoluteHref = isAbsoluteHref;
function isRelativeHref(href) {
    return href.startsWith("./") || href.startsWith("../") || href.startsWith("/") || href.startsWith("#");
}
exports.isRelativeHref = isRelativeHref;
function isMailtoHref(href) {
    return href.startsWith("mailto:");
}
exports.isMailtoHref = isMailtoHref;
function isInternalHref(href, siteDomainName) {
    return ((!!siteDomainName && href.includes(siteDomainName) && isAbsoluteHref(href)) ||
        (isRelativeHref(href) && !isMailtoHref(href)));
}
exports.isInternalHref = isInternalHref;
function groupLinks(links, predicate) {
    const all = [];
    const duplicate = [];
    const unique = [];
    for (const link of links) {
        if (!predicate(link.href))
            continue;
        if (unique.some((seen) => seen.href === link.href)) {
            duplicate.push(link);
        }
        else {
            unique.push(link);
        }
        all.push(link);
    }
    return { all, duplicate, unique };
}
exports.groupLinks = groupLinks;
//# sourceMappingURL=html.js.map