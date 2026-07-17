import type { KeywordDensity } from "./types";

export function normalizeWhitespace(text: string): string {
    return text.trim().replace(/\s+/g, " ");
}

export function wordCount(text: string): number {
    const normalized = normalizeWhitespace(text.toLowerCase());
    return normalized === "" ? 0 : normalized.split(" ").length;
}

export function countOccurrences(keyword: string, text: string): number {
    if (!keyword) return 0;
    return text.split(keyword).length - 1;
}

export function density(keyword: string, text: string): number {
    const words = wordCount(text);
    if (words === 0) return 0;
    return (countOccurrences(keyword, text) / words) * 100;
}

export function keywordPosition(text: string, keyword: string): number {
    if (!text || !keyword) return -1;
    return text.split(keyword)[0].split(" ").length;
}

export function keywordInText(keyword: string, text: string): KeywordDensity {
    return {
        keyword,
        density: density(keyword, text),
        position: keywordPosition(text, keyword),
    };
}
