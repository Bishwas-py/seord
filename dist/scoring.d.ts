import type { AnalysisContext } from "./context";
import type { EvaluatedRule } from "./types";
export declare function computeSeoScore(evaluated: EvaluatedRule[]): number;
export declare function computeKeywordSeoScore(ctx: AnalysisContext): number;
