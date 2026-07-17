import { describe, expect, it } from "vitest";
import { countOccurrences, density, keywordInText, keywordPosition, wordCount } from "../src/text";

describe("wordCount", () => {
    it("counts words separated by any whitespace", () => {
        expect(wordCount("one two\n three\t four")).toBe(4);
    });
    it("returns 0 for empty or whitespace-only text", () => {
        expect(wordCount("   ")).toBe(0);
    });
});

describe("countOccurrences", () => {
    it("counts substring occurrences", () => {
        expect(countOccurrences("rate", "rate my rates, rate!")).toBe(3);
    });
    it("returns 0 for empty keyword", () => {
        expect(countOccurrences("", "anything")).toBe(0);
    });
});

describe("density", () => {
    it("is occurrences per word as a percentage", () => {
        expect(density("alpha", "alpha beta gamma delta")).toBe(25);
    });
});

describe("keywordPosition", () => {
    it("is the 1-based word position of the keyword", () => {
        expect(keywordPosition("find out if progressive raises", "progressive")).toBe(4);
    });
    it("is -1 when text or keyword is empty", () => {
        expect(keywordPosition("", "x")).toBe(-1);
        expect(keywordPosition("x", "")).toBe(-1);
    });
});

describe("keywordInText", () => {
    it("bundles keyword, density and position", () => {
        expect(keywordInText("beta", "alpha beta gamma delta")).toEqual({
            keyword: "beta",
            density: 25,
            position: 2,
        });
    });
});
