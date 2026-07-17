import { describe, expect, it } from "vitest";
import { AnalysisContext } from "../src/context";

const input = {
    title: "Alpha Beta Guide",
    htmlText: "<h1>Alpha</h1><p>alpha beta gamma delta alpha</p><a href='/x'>x</a>",
    keyword: "Alpha",
    subKeywords: ["Beta", "Zeta"],
    metaDescription: "Alpha beta all the way",
};

describe("AnalysisContext", () => {
    const ctx = new AnalysisContext(input, "mysite.com");

    it("lowercases content fields without mutating the input", () => {
        expect(ctx.content.keyword).toBe("alpha");
        expect(ctx.content.subKeywords).toEqual(["beta", "zeta"]);
        expect(input.keyword).toBe("Alpha");
    });

    it("computes keyword frequency and density once", () => {
        expect(ctx.keywordFrequency).toBe(3);
        expect(ctx.keywordDensity).toBeGreaterThan(0);
    });

    it("computes per sub keyword densities", () => {
        expect(ctx.subKeywordDensities.map((d) => d.keyword)).toEqual(["beta", "zeta"]);
        expect(ctx.subKeywordDensities[1].density).toBe(0);
    });

    it("collects headings and links", () => {
        expect(ctx.headings).toEqual([{ text: "Alpha", tag: "H1" }]);
        expect(ctx.internalLinks.unique).toHaveLength(1);
        expect(ctx.outboundLinks.all).toHaveLength(0);
    });

    it("exposes keyword-in-title data", () => {
        expect(ctx.keywordInTitle.density).toBeGreaterThan(0);
        expect(ctx.keywordInTitle.position).toBe(1);
    });
});
