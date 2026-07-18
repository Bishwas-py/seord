"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaDescriptionSubKeywords = exports.metaDescriptionStartsWithKeyword = exports.metaDescriptionKeywordDensity = exports.metaDescriptionLength = void 0;
const defaults_1 = require("../defaults");
const helpers_1 = require("./helpers");
const hasMetaDescription = (ctx) => ctx.content.metaDescription !== "";
exports.metaDescriptionLength = {
    id: "meta-description-length",
    weight: 8,
    evaluate: (ctx) => {
        const meta = ctx.content.metaDescription;
        if (!meta)
            return { status: "warning", message: "Missing meta description." };
        if (meta.length > defaults_1.THRESHOLDS.metaDescription.maxLength) {
            return {
                status: "warning",
                message: `Meta description is too long. It is ${meta.length} characters long, try reducing it.`,
            };
        }
        if (meta.length < defaults_1.THRESHOLDS.metaDescription.minLength) {
            return {
                status: "warning",
                message: `Meta description is too short. It is ${meta.length} characters long, try increasing it.`,
            };
        }
        return { status: "good", message: `Meta description is ${meta.length} characters long.` };
    },
};
exports.metaDescriptionKeywordDensity = {
    id: "meta-description-keyword-density",
    weight: 6,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => {
        const metaDensity = ctx.keywordInMetaDescription.density;
        return (0, helpers_1.checkRange)(metaDensity, { min: defaults_1.THRESHOLDS.metaDescription.minKeywordDensity, max: defaults_1.THRESHOLDS.metaDescription.maxKeywordDensity }, {
            tooLow: `Keyword density of meta description is too low. It is ${metaDensity.toFixed(2)}%, try increasing it.`,
            tooHigh: `Keyword density of meta description is too high. It is ${metaDensity.toFixed(2)}%, try decreasing it.`,
            inRange: `Keyword density of meta description is ${metaDensity.toFixed(2)}%, which is good.`,
        });
    },
};
exports.metaDescriptionStartsWithKeyword = {
    id: "meta-description-starts-with-keyword",
    weight: 2,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => {
        var _a;
        const lead = ctx.content.metaDescription.substring(0, 20);
        return ((_a = ctx.keywordInMetaDescription.position) !== null && _a !== void 0 ? _a : -1) > 1
            ? {
                status: "minor",
                message: `Meta description does not start with keyword. It starts with "${lead}", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.`,
            }
            : { status: "good", message: `Meta description starts with keyword, i.e. "${lead}".` };
    },
};
exports.metaDescriptionSubKeywords = {
    id: "meta-description-sub-keywords",
    weight: 4,
    appliesTo: (ctx) => hasMetaDescription(ctx) && ctx.content.subKeywords.length > 0,
    evaluate: (ctx) => ctx.subKeywordsInMetaDescription.map((kd) => {
        if (kd.density > defaults_1.THRESHOLDS.metaDescription.subKeywordMaxDensity) {
            return {
                status: "warning",
                message: `The density of sub keyword "${kd.keyword}" in meta description is too high, i.e. ${kd.density.toFixed(2)}%.`,
            };
        }
        if (kd.density < defaults_1.THRESHOLDS.metaDescription.subKeywordMinDensity) {
            const lowness = kd.density < defaults_1.THRESHOLDS.metaDescription.subKeywordExtremeLowDensity ? "too low" : "low";
            return {
                status: "minor",
                message: `The density of sub keyword "${kd.keyword}" in meta description is ${lowness}, i.e. ${kd.density.toFixed(2)}%.`,
            };
        }
        return {
            status: "good",
            message: `The density of sub keyword "${kd.keyword}" in meta description is ${kd.density.toFixed(2)}%.`,
        };
    }),
};
//# sourceMappingURL=meta-description.js.map