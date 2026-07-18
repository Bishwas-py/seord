"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordInText = exports.keywordPosition = exports.density = exports.countOccurrences = exports.wordCount = exports.normalizeWhitespace = void 0;
function normalizeWhitespace(text) {
    return text.trim().replace(/\s+/g, " ");
}
exports.normalizeWhitespace = normalizeWhitespace;
function wordCount(text) {
    const normalized = normalizeWhitespace(text.toLowerCase());
    return normalized === "" ? 0 : normalized.split(" ").length;
}
exports.wordCount = wordCount;
function countOccurrences(keyword, text) {
    if (!keyword)
        return 0;
    return text.split(keyword).length - 1;
}
exports.countOccurrences = countOccurrences;
function density(keyword, text) {
    const words = wordCount(text);
    if (words === 0)
        return 0;
    return (countOccurrences(keyword, text) / words) * 100;
}
exports.density = density;
function keywordPosition(text, keyword) {
    if (!text || !keyword)
        return -1;
    return text.split(keyword)[0].split(" ").length;
}
exports.keywordPosition = keywordPosition;
function keywordInText(keyword, text) {
    return {
        keyword,
        density: density(keyword, text),
        position: keywordPosition(text, keyword),
    };
}
exports.keywordInText = keywordInText;
//# sourceMappingURL=text.js.map