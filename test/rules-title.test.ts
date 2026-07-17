import { describe, expect, it } from "vitest";
import { titleKeyword, titleLength, titleSubKeywords } from "../src/rules/title";
import { makeContext } from "./helpers";

describe("title rules", () => {
    it("title-length: good between 40 and 70 chars", () => {
        expect(titleLength.evaluate(makeContext())).toMatchObject({ status: "good" });
    });
    it("title-length: too short, too long, missing", () => {
        expect(titleLength.evaluate(makeContext({ title: "short" }))).toEqual({
            status: "warning",
            message: "Title tag is too short.",
        });
        expect(titleLength.evaluate(makeContext({ title: "x".repeat(80) }))).toEqual({
            status: "warning",
            message: "Title tag is too long.",
        });
        expect(titleLength.evaluate(makeContext({ title: "" }))).toEqual({
            status: "warning",
            message: "Missing title tag, please add one.",
        });
    });

    it("title-keyword: good when keyword in title, warning otherwise", () => {
        expect(titleKeyword.evaluate(makeContext())).toMatchObject({ status: "good" });
        expect(titleKeyword.evaluate(makeContext({ keyword: "absent" }))).toEqual({
            status: "warning",
            message: "No main keyword in title.",
        });
    });

    it("title-sub-keywords: counts only sub keywords actually in the title", () => {
        const ctx = makeContext({ subKeywords: ["rates", "nowhere"] });
        expect(titleSubKeywords.evaluate(ctx)).toEqual({
            status: "good",
            message: "You have 1 sub keywords in title.",
        });
        expect(titleSubKeywords.evaluate(makeContext({ subKeywords: ["nowhere"] }))).toEqual({
            status: "minor",
            message: "No sub keywords in the title.",
        });
    });

    it("keyword and sub keyword title rules skip without title", () => {
        const noTitle = makeContext({ title: "" });
        expect(titleKeyword.appliesTo!(noTitle)).toBe(false);
        expect(titleSubKeywords.appliesTo!(noTitle)).toBe(false);
    });
});
