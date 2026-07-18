"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleSubKeywords = exports.titleKeyword = exports.titleLength = void 0;
const defaults_1 = require("../defaults");
const hasTitle = (ctx) => ctx.content.title !== "";
exports.titleLength = {
    id: "title-length",
    weight: 8,
    evaluate: (ctx) => {
        const title = ctx.content.title;
        if (!title)
            return { status: "warning", message: "Missing title tag, please add one." };
        if (title.length > defaults_1.THRESHOLDS.title.maxLength)
            return { status: "warning", message: "Title tag is too long." };
        if (title.length < defaults_1.THRESHOLDS.title.minLength)
            return { status: "warning", message: "Title tag is too short." };
        return { status: "good", message: `Title tag is ${title.length} characters long.` };
    },
};
exports.titleKeyword = {
    id: "title-keyword",
    weight: 8,
    appliesTo: (ctx) => hasTitle(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => ctx.keywordInTitle.density > 0
        ? { status: "good", message: `Keyword density in title is ${ctx.keywordInTitle.density.toFixed(2)}%, which is good.` }
        : { status: "warning", message: "No main keyword in title." },
};
exports.titleSubKeywords = {
    id: "title-sub-keywords",
    weight: 4,
    appliesTo: (ctx) => hasTitle(ctx) && ctx.content.subKeywords.length > 0,
    evaluate: (ctx) => {
        const present = ctx.subKeywordsInTitle.filter((kd) => kd.density > 0);
        return present.length > 0
            ? { status: "good", message: `You have ${present.length} sub keywords in title.` }
            : { status: "minor", message: "No sub keywords in the title." };
    },
};
//# sourceMappingURL=title.js.map