import { describe, expect, it } from "vitest";
import {
    headingH2Presence,
    headingH3Presence,
    headingSingleH1,
    headingsKeyword,
    headingsPresence,
    headingsSubKeywords,
} from "../src/rules/headings";
import { makeContext } from "./helpers";

describe("heading rules", () => {
    it("headings-presence: warning with no headings at all", () => {
        expect(headingsPresence.evaluate(makeContext({ htmlText: "<p>plain</p>" }))).toEqual({
            status: "warning",
            message: "Missing headings, please add at least one heading tag.",
        });
        expect(headingsPresence.evaluate(makeContext())).toMatchObject({ status: "good" });
    });

    it("issue #4 regression: one real h1 plus a title is exactly one h1", () => {
        const ctx = makeContext({
            title: "a perfectly reasonable page title for this test",
            htmlText: "<h1>The Only Heading</h1><h2>Sub</h2><p>text</p>",
        });
        expect(headingSingleH1.evaluate(ctx)).toEqual({
            status: "good",
            message: "Nice. You have h1 tag, which is essential.",
        });
    });

    it("heading-single-h1: warns on zero and on two real h1s", () => {
        expect(headingSingleH1.evaluate(makeContext({ htmlText: "<h2>only</h2>" }))).toMatchObject({
            status: "warning",
            message: "Missing h1 tag, please add at least one h1 tag.",
        });
        expect(headingSingleH1.evaluate(makeContext({ htmlText: "<h1>a</h1><h1>b</h1>" }))).toMatchObject({
            status: "warning",
            message: "More than one h1 tag found, please remove all but one h1 tag.",
        });
    });

    it("h2 and h3 presence", () => {
        expect(headingH2Presence.evaluate(makeContext({ htmlText: "<h1>x</h1>" }))).toMatchObject({ status: "warning" });
        expect(headingH3Presence.evaluate(makeContext({ htmlText: "<h1>x</h1>" }))).toMatchObject({ status: "minor" });
    });

    it("headings-keyword: matches case-insensitively", () => {
        const ctx = makeContext({ htmlText: "<h1>Progressive Rates</h1>" });
        const results = headingsKeyword.evaluate(ctx) as any[];
        expect(results[0].status).toBe("good");
    });

    it("headings-sub-keywords: one result per heading per sub keyword", () => {
        const ctx = makeContext({ htmlText: "<h1>Progressive Rates</h1><h2>Other</h2>", subKeywords: ["rates"] });
        const results = headingsSubKeywords.evaluate(ctx) as any[];
        expect(results).toHaveLength(2);
        expect(results[0].status).toBe("good");
        expect(results[1].status).toBe("minor");
    });
});
