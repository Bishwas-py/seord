import type { KeywordDensity } from "./types";
export declare function normalizeWhitespace(text: string): string;
export declare function wordCount(text: string): number;
export declare function countOccurrences(keyword: string, text: string): number;
export declare function density(keyword: string, text: string): number;
export declare function keywordPosition(text: string, keyword: string): number;
export declare function keywordInText(keyword: string, text: string): KeywordDensity;
