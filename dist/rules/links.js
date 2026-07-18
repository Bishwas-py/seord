"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outboundLinkDuplicates = exports.internalLinkDuplicates = exports.outboundLinksCount = exports.internalLinksCount = void 0;
const defaults_1 = require("../defaults");
exports.internalLinksCount = {
    id: "links-internal-count",
    weight: 6,
    evaluate: (ctx) => {
        const count = ctx.internalLinks.unique.length;
        return count < ctx.wordCount / defaults_1.THRESHOLDS.links.wordsPerInternalLink
            ? {
                status: "warning",
                message: `Not enough internal links. You only have ${count} unique internal links, try increasing it.`,
            }
            : { status: "good", message: `You have ${count} internal links.` };
    },
};
exports.outboundLinksCount = {
    id: "links-outbound-count",
    weight: 4,
    evaluate: (ctx) => {
        const count = ctx.outboundLinks.unique.length;
        return count < ctx.wordCount / defaults_1.THRESHOLDS.links.wordsPerOutboundLink
            ? { status: "warning", message: `Not enough outbound links. You only have ${count}, try increasing it.` }
            : { status: "good", message: `You have ${count} outbound links.` };
    },
};
exports.internalLinkDuplicates = {
    id: "links-internal-duplicates",
    weight: 2,
    evaluate: (ctx) => ctx.internalLinks.duplicate.length > 1
        ? { status: "minor", message: `You have ${ctx.internalLinks.duplicate.length} duplicate internal links.` }
        : { status: "good", message: "No duplicate internal links." },
};
exports.outboundLinkDuplicates = {
    id: "links-outbound-duplicates",
    weight: 2,
    evaluate: (ctx) => ctx.outboundLinks.duplicate.length > 1
        ? { status: "minor", message: `You have ${ctx.outboundLinks.duplicate.length} duplicate outbound links.` }
        : { status: "good", message: "No duplicate outbound links." },
};
//# sourceMappingURL=links.js.map