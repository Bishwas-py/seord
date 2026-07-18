import { describe, expect, it } from "vitest";
import { allRules } from "../src/rules";
import {
    internalLinkDuplicates,
    internalLinksCount,
    outboundLinkDuplicates,
    outboundLinksCount,
} from "../src/rules/links";
import { makeContext } from "./helpers";

describe("link rules", () => {
    it("links-internal-count: warns when below one per 300 words", () => {
        const longText = `<p>${"word ".repeat(600)}</p>`;
        expect(internalLinksCount.evaluate(makeContext({ htmlText: longText }))).toMatchObject({ status: "warning" });
        const linked = `<a href="/a">a</a><a href="/b">b</a><p>${"word ".repeat(300)}</p>`;
        expect(internalLinksCount.evaluate(makeContext({ htmlText: linked }))).toMatchObject({ status: "good" });
    });

    it("links-outbound-count: warns when below one per 400 words", () => {
        const longText = `<p>${"word ".repeat(600)}</p>`;
        expect(outboundLinksCount.evaluate(makeContext({ htmlText: longText }))).toMatchObject({ status: "warning" });
    });

    it("duplicate rules stay quiet until more than one duplicate", () => {
        const twoDupes = `<a href="/a">1</a><a href="/a">2</a><a href="/a">3</a><p>text</p>`;
        expect(internalLinkDuplicates.evaluate(makeContext({ htmlText: twoDupes }))).toMatchObject({ status: "minor" });
        expect(outboundLinkDuplicates.evaluate(makeContext())).toEqual({
            status: "good",
            message: "No duplicate outbound links.",
        });
    });
});

describe("rule registry", () => {
    it("contains every rule exactly once with unique ids", () => {
        const ids = allRules.map((rule) => rule.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toHaveLength(22);
    });
});
