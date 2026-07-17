"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headingsSubKeywords = exports.headingsKeyword = exports.headingH3Presence = exports.headingH2Presence = exports.headingSingleH1 = exports.headingsPresence = void 0;
const text_1 = require("../text");
const hasHeadings = (ctx) => ctx.headings.length > 0;
const headingsOf = (ctx, tag) => ctx.headings.filter((heading) => heading.tag.toLowerCase() === tag);
exports.headingsPresence = {
    id: "headings-presence",
    weight: 6,
    evaluate: (ctx) => hasHeadings(ctx)
        ? { status: "good", message: `You have ${ctx.headings.length} headings.` }
        : { status: "warning", message: "Missing headings, please add at least one heading tag." },
};
exports.headingSingleH1 = {
    id: "heading-single-h1",
    weight: 8,
    appliesTo: hasHeadings,
    evaluate: (ctx) => {
        const h1s = headingsOf(ctx, "h1");
        if (h1s.length === 0)
            return { status: "warning", message: "Missing h1 tag, please add at least one h1 tag." };
        if (h1s.length > 1) {
            return { status: "warning", message: "More than one h1 tag found, please remove all but one h1 tag." };
        }
        return { status: "good", message: "Nice. You have h1 tag, which is essential." };
    },
};
exports.headingH2Presence = {
    id: "heading-h2-presence",
    weight: 4,
    appliesTo: hasHeadings,
    evaluate: (ctx) => headingsOf(ctx, "h2").length > 0
        ? { status: "good", message: "Nice. You have h2 tag, which is essential." }
        : {
            status: "warning",
            message: "Missing h2 tag, please add at least one h2 tag. It is recommended to have at least one h2 tag.",
        },
};
exports.headingH3Presence = {
    id: "heading-h3-presence",
    weight: 2,
    appliesTo: hasHeadings,
    evaluate: (ctx) => headingsOf(ctx, "h3").length > 0
        ? { status: "good", message: "You have h3 tag, which is good." }
        : {
            status: "minor",
            message: "Missing h3 tag, please add at least one h3 tag. Having h3 tag is not mandatory, but it is recommended to have at least one h3 tag.",
        },
};
exports.headingsKeyword = {
    id: "headings-keyword",
    weight: 4,
    appliesTo: (ctx) => hasHeadings(ctx) && ctx.content.keyword !== "",
    evaluate: (ctx) => ctx.headings.map((heading) => (0, text_1.countOccurrences)(ctx.content.keyword, heading.text.toLowerCase()) > 0
        ? {
            status: "good",
            message: `Keyword "${ctx.content.keyword}" found in ${heading.tag} tag "${heading.text}".`,
        }
        : {
            status: "minor",
            message: `Keyword "${ctx.content.keyword}" not found in ${heading.tag} tag "${heading.text}".`,
        }),
};
exports.headingsSubKeywords = {
    id: "headings-sub-keywords",
    weight: 2,
    appliesTo: (ctx) => hasHeadings(ctx) && ctx.content.subKeywords.length > 0,
    evaluate: (ctx) => ctx.headings.flatMap((heading) => ctx.content.subKeywords.map((subKeyword) => (0, text_1.countOccurrences)(subKeyword, heading.text.toLowerCase()) > 0
        ? {
            status: "good",
            message: `Sub keyword "${subKeyword}" found in ${heading.tag} tag "${heading.text}", which is good.`,
        }
        : {
            status: "minor",
            message: `Sub keyword "${subKeyword}" not found in ${heading.tag} tag "${heading.text}".`,
        })),
};
//# sourceMappingURL=headings.js.map