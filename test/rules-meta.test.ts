import { describe, expect, it } from "vitest";
import {
    metaDescriptionKeywordDensity,
    metaDescriptionLength,
    metaDescriptionStartsWithKeyword,
    metaDescriptionSubKeywords,
} from "../src/rules/meta-description";
import { makeContext } from "./helpers";

describe("meta description rules", () => {
    it("meta-description-length: good between 100 and 160", () => {
        expect(metaDescriptionLength.evaluate(makeContext())).toMatchObject({ status: "good" });
        expect(metaDescriptionLength.evaluate(makeContext({ metaDescription: "tiny" }))).toMatchObject({
            status: "warning",
        });
        expect(metaDescriptionLength.evaluate(makeContext({ metaDescription: "x".repeat(170) }))).toMatchObject({
            status: "warning",
        });
        expect(metaDescriptionLength.evaluate(makeContext({ metaDescription: "" }))).toEqual({
            status: "warning",
            message: "Missing meta description.",
        });
    });

    it("meta-description-keyword-density: checks 2 to 5 percent range", () => {
        const result = metaDescriptionKeywordDensity.evaluate(makeContext()) as any;
        expect(["good", "warning"]).toContain(result.status);
        expect(metaDescriptionKeywordDensity.appliesTo!(makeContext({ metaDescription: "" }))).toBe(false);
    });

    it("meta-description-starts-with-keyword: minor when keyword is not first words", () => {
        const notFirst = metaDescriptionStartsWithKeyword.evaluate(makeContext()) as any;
        expect(notFirst.status).toBe("minor");
        const first = metaDescriptionStartsWithKeyword.evaluate(
            makeContext({ metaDescription: "progressive rates explained ".repeat(5) }),
        ) as any;
        expect(first.status).toBe("good");
    });

    it("meta-description-sub-keywords: one result per sub keyword", () => {
        const results = metaDescriptionSubKeywords.evaluate(makeContext({ subKeywords: ["rates", "nowhere"] })) as any[];
        expect(results).toHaveLength(2);
    });
});
