import { describe, expect, it } from "vitest";
import { HtmlDocument, groupLinks, isInternalHref } from "../src/html";

const HTML = `
<h1>Main Title</h1>
<h2>Section</h2>
<p>Some body text</p>
<a href="/about">About</a>
<a href="https://mysite.com/page">Same site</a>
<a href="https://other.com">Other</a>
<a href="https://other.com">Other again</a>
<a href="mailto:me@mysite.com">Mail</a>
`;

describe("HtmlDocument", () => {
    const doc = new HtmlDocument(HTML);

    it("lowercases body text", () => {
        expect(doc.bodyText).toContain("main title");
    });

    it("extracts headings with uppercase tag names", () => {
        expect(doc.headings()).toEqual([
            { text: "Main Title", tag: "H1" },
            { text: "Section", tag: "H2" },
        ]);
    });

    it("extracts links with href", () => {
        expect(doc.links().map((l) => l.href)).toEqual([
            "/about",
            "https://mysite.com/page",
            "https://other.com",
            "https://other.com",
            "mailto:me@mysite.com",
        ]);
    });
});

describe("isInternalHref", () => {
    it("treats relative links as internal", () => {
        expect(isInternalHref("/about", null)).toBe(true);
        expect(isInternalHref("#anchor", null)).toBe(true);
    });
    it("treats absolute links on the site domain as internal", () => {
        expect(isInternalHref("https://mysite.com/page", "mysite.com")).toBe(true);
    });
    it("treats other domains and mailto as external", () => {
        expect(isInternalHref("https://other.com", "mysite.com")).toBe(false);
        expect(isInternalHref("mailto:me@mysite.com", "mysite.com")).toBe(false);
    });
});

describe("groupLinks", () => {
    const doc = new HtmlDocument(HTML);
    it("splits matching links into all, unique and duplicate", () => {
        const outbound = groupLinks(doc.links(), (href) => !isInternalHref(href, "mysite.com"));
        expect(outbound.unique.map((l) => l.href)).toEqual(["https://other.com", "mailto:me@mysite.com"]);
        expect(outbound.duplicate.map((l) => l.href)).toEqual(["https://other.com"]);
        expect(outbound.all).toHaveLength(3);
    });
});
