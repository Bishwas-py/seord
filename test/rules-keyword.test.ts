import { describe, expect, it } from "vitest";
import { keywordDensityRule, keywordOverstuffing, keywordPresence } from "../src/rules/keyword";
import { subKeywordDensity, subKeywordsPresence } from "../src/rules/sub-keywords";
import { makeContext } from "./helpers";

describe("keyword rules", () => {
    it("keyword-presence: good when keyword given, warning when missing", () => {
        expect(keywordPresence.evaluate(makeContext())).toMatchObject({ status: "good" });
        expect(keywordPresence.evaluate(makeContext({ keyword: "" }))).toEqual({
            status: "warning",
            message: "Missing main keyword, please add one.",
        });
    });

    it("keyword-overstuffing: warns above 5 percent density", () => {
        const stuffed = makeContext({ htmlText: "<p>progressive progressive progressive</p>" });
        expect(keywordOverstuffing.evaluate(stuffed)).toEqual({
            status: "warning",
            message: "Serious keyword overstuffing.",
        });
    });

    it("keyword-density: warning outside 0.46 to 1.1, good inside", () => {
        const sparse = makeContext({
            htmlText: `<p>progressive ${"word ".repeat(400)}</p>`,
        });
        expect(sparse.keywordDensity).toBeLessThan(0.46);
        expect(keywordDensityRule.evaluate(sparse)).toMatchObject({ status: "warning" });
    });

    it("keyword rules skip when no keyword", () => {
        const noKeyword = makeContext({ keyword: "" });
        expect(keywordOverstuffing.appliesTo!(noKeyword)).toBe(false);
        expect(keywordDensityRule.appliesTo!(noKeyword)).toBe(false);
    });
});

describe("sub keyword rules", () => {
    it("sub-keywords-presence: good when given, minor when missing", () => {
        expect(subKeywordsPresence.evaluate(makeContext())).toMatchObject({ status: "good" });
        expect(subKeywordsPresence.evaluate(makeContext({ subKeywords: [] }))).toEqual({
            status: "minor",
            message: "Missing sub keywords, please add some.",
        });
    });

    it("sub-keyword-density: one result per sub keyword", () => {
        const ctx = makeContext({ subKeywords: ["rates", "nowhere"] });
        const results = subKeywordDensity.evaluate(ctx) as any[];
        expect(results).toHaveLength(2);
        expect(results[1].status).toBe("minor");
        expect(results[1].message).toContain('"nowhere" is too low');
    });

    it("sub-keyword-density does not apply without sub keywords", () => {
        expect(subKeywordDensity.appliesTo!(makeContext({ subKeywords: [] }))).toBe(false);
    });
});
