"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordDensityRule = exports.keywordOverstuffing = exports.keywordPresence = void 0;
const defaults_1 = require("../defaults");
const helpers_1 = require("./helpers");
const hasKeyword = (ctx) => ctx.content.keyword !== "";
exports.keywordPresence = {
    id: "keyword-presence",
    weight: 10,
    evaluate: (ctx) => ctx.content.keyword
        ? { status: "good", message: `Good, your content has a keyword "${ctx.content.keyword}".` }
        : { status: "warning", message: "Missing main keyword, please add one." },
};
exports.keywordOverstuffing = {
    id: "keyword-overstuffing",
    weight: 8,
    appliesTo: hasKeyword,
    evaluate: (ctx) => ctx.keywordDensity > defaults_1.THRESHOLDS.keyword.overstuffingDensity
        ? { status: "warning", message: "Serious keyword overstuffing." }
        : { status: "good", message: "No keyword overstuffing." },
};
exports.keywordDensityRule = {
    id: "keyword-density",
    weight: 10,
    appliesTo: hasKeyword,
    evaluate: (ctx) => (0, helpers_1.checkRange)(ctx.keywordDensity, { min: defaults_1.THRESHOLDS.keyword.minDensity, max: defaults_1.THRESHOLDS.keyword.maxDensity }, {
        tooLow: `Keyword density is too low. It is ${ctx.keywordDensity.toFixed(2)}%, try increasing it.`,
        tooHigh: `Keyword density is too high. It is ${ctx.keywordDensity.toFixed(2)}%, try decreasing it.`,
        inRange: `Keyword density is ${ctx.keywordDensity.toFixed(2)}%.`,
    }),
};
//# sourceMappingURL=keyword.js.map