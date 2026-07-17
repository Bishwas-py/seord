"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THRESHOLDS = void 0;
exports.THRESHOLDS = {
    keyword: { minDensity: 0.46, maxDensity: 1.1, overstuffingDensity: 5 },
    subKeyword: { minDensity: 0.12, maxDensity: 0.9, extremeLowDensity: 0.09 },
    title: { minLength: 40, maxLength: 70 },
    metaDescription: {
        minLength: 100,
        maxLength: 160,
        minKeywordDensity: 2,
        maxKeywordDensity: 5,
        subKeywordMinDensity: 2,
        subKeywordMaxDensity: 5,
        subKeywordExtremeLowDensity: 0.2,
    },
    links: { wordsPerInternalLink: 300, wordsPerOutboundLink: 400 },
};
//# sourceMappingURL=defaults.js.map