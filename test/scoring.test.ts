import { describe, expect, it } from "vitest";
import { computeKeywordSeoScore, computeSeoScore } from "../src/scoring";
import { makeContext } from "./helpers";
import type { EvaluatedRule } from "../src/types";

function evaluated(weight: number, statuses: Array<"good" | "warning" | "minor">): EvaluatedRule {
    return {
        rule: { id: `r${weight}`, weight, evaluate: () => [] },
        results: statuses.map((status) => ({ status, message: "" })),
    };
}

describe("computeSeoScore", () => {
    it("is earned weight over applicable weight", () => {
        expect(computeSeoScore([evaluated(10, ["good"]), evaluated(10, ["warning"])])).toBe(50);
    });
    it("credits minor results at half weight", () => {
        expect(computeSeoScore([evaluated(10, ["minor"])])).toBe(50);
    });
    it("averages multi result rules so size does not distort", () => {
        expect(computeSeoScore([evaluated(10, ["good", "warning"]), evaluated(10, ["good"])])).toBe(75);
    });
    it("returns 0 with no applicable rules", () => {
        expect(computeSeoScore([])).toBe(0);
    });
    it("rounds to two decimals", () => {
        const score = computeSeoScore([evaluated(3, ["good"]), evaluated(7, ["warning"])]);
        expect(score).toBe(30);
    });
});

describe("computeKeywordSeoScore", () => {
    it("caps at 100", () => {
        const stuffed = makeContext({ htmlText: "<p>progressive progressive rates</p>" });
        expect(computeKeywordSeoScore(stuffed)).toBe(100);
    });
});
