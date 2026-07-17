import { describe, expect, it } from "vitest";
import { analyzeSeo } from "../src/analyze";

const content = {
    title: "Does Progressive raise your rates after 6 months?",
    htmlText: `
        <h1>Does Progressive Raise Your Rates After 6 Months?</h1>
        <h2>How Are Car Insurance Rates Determined?</h2>
        <p>When it comes to car insurance, finding the right provider matters.
        Progressive is one of the largest insurers and progressive rates depend on
        many factors like driving history, location and coverage level.</p>
        <h3>How to Save Money on Car Insurance</h3>
        <p>You can save money by comparing rates and premiums across providers.
        Visit <a href="/guides/insurance">our insurance guide</a> or
        <a href="https://www.iii.org">the Insurance Information Institute</a>.</p>
    `,
    keyword: "progressive",
    subKeywords: ["car insurance", "rates"],
    metaDescription:
        "Find out if Progressive raises your rates after 6 months and what factors can impact your insurance premiums. Learn how to save money on car insurance.",
};

describe("analyzeSeo", () => {
    const result = analyzeSeo(content, { siteDomainName: "example.com" });

    it("returns a score between 0 and 100 with per rule outcomes", () => {
        expect(result.seoScore).toBeGreaterThan(0);
        expect(result.seoScore).toBeLessThanOrEqual(100);
        expect(result.rules.length).toBeGreaterThan(0);
        expect(result.rules[0]).toHaveProperty("id");
        expect(result.rules[0]).toHaveProperty("weight");
    });

    it("issue #4: one real h1 yields no h1 warnings", () => {
        const h1Warnings = result.messages.warnings.filter((w) => w.includes("h1"));
        expect(h1Warnings).toEqual([]);
        expect(result.messages.goodPoints).toContain("Nice. You have h1 tag, which is essential.");
    });

    it("groups data by concern", () => {
        expect(result.keyword.frequency).toBeGreaterThan(0);
        expect(result.subKeywords.density).toHaveLength(2);
        expect(result.links.total).toBe(2);
        expect(result.links.internal.unique).toHaveLength(1);
        expect(result.links.outbound.unique).toHaveLength(1);
        expect(result.words.total).toBeGreaterThan(50);
    });

    it("derives messages from rule outcomes", () => {
        const messageCount =
            result.messages.warnings.length +
            result.messages.minorWarnings.length +
            result.messages.goodPoints.length;
        expect(messageCount).toBe(result.rules.length);
    });

    it("supports disabling rules by id, removing them from score and messages", () => {
        const without = analyzeSeo(content, {
            siteDomainName: "example.com",
            rules: { "heading-h3-presence": "off", "headings-sub-keywords": "off" },
        });
        expect(without.rules.find((r) => r.id === "heading-h3-presence")).toBeUndefined();
    });

    it("does not mutate the caller's content object", () => {
        expect(content.keyword).toBe("progressive");
        expect(content.title.startsWith("Does")).toBe(true);
    });
});
