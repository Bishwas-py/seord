import { describe, expect, it } from "vitest";
import { checkRange } from "../src/rules/helpers";

const MESSAGES = { tooLow: "low!", tooHigh: "high!", inRange: "ok" };

describe("checkRange", () => {
    it("warns above max", () => {
        expect(checkRange(11, { min: 2, max: 10 }, MESSAGES)).toEqual({ status: "warning", message: "high!" });
    });
    it("warns below min", () => {
        expect(checkRange(1, { min: 2, max: 10 }, MESSAGES)).toEqual({ status: "warning", message: "low!" });
    });
    it("supports minor severity for the low side", () => {
        expect(checkRange(1, { min: 2, max: 10 }, MESSAGES, "minor")).toEqual({ status: "minor", message: "low!" });
    });
    it("is good inside the range, inclusive", () => {
        expect(checkRange(2, { min: 2, max: 10 }, MESSAGES)).toEqual({ status: "good", message: "ok" });
        expect(checkRange(10, { min: 2, max: 10 }, MESSAGES)).toEqual({ status: "good", message: "ok" });
    });
});
