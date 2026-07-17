import { THRESHOLDS } from "../defaults";
import type { Rule } from "../types";

export const internalLinksCount: Rule = {
    id: "links-internal-count",
    weight: 6,
    evaluate: (ctx) => {
        const count = ctx.internalLinks.unique.length;
        return count < ctx.wordCount / THRESHOLDS.links.wordsPerInternalLink
            ? {
                  status: "warning",
                  message: `Not enough internal links. You only have ${count} unique internal links, try increasing it.`,
              }
            : { status: "good", message: `You have ${count} internal links.` };
    },
};

export const outboundLinksCount: Rule = {
    id: "links-outbound-count",
    weight: 4,
    evaluate: (ctx) => {
        const count = ctx.outboundLinks.unique.length;
        return count < ctx.wordCount / THRESHOLDS.links.wordsPerOutboundLink
            ? { status: "warning", message: `Not enough outbound links. You only have ${count}, try increasing it.` }
            : { status: "good", message: `You have ${count} outbound links.` };
    },
};

export const internalLinkDuplicates: Rule = {
    id: "links-internal-duplicates",
    weight: 2,
    evaluate: (ctx) =>
        ctx.internalLinks.duplicate.length > 1
            ? { status: "minor", message: `You have ${ctx.internalLinks.duplicate.length} duplicate internal links.` }
            : { status: "good", message: "No duplicate internal links." },
};

export const outboundLinkDuplicates: Rule = {
    id: "links-outbound-duplicates",
    weight: 2,
    evaluate: (ctx) =>
        ctx.outboundLinks.duplicate.length > 1
            ? { status: "minor", message: `You have ${ctx.outboundLinks.duplicate.length} duplicate outbound links.` }
            : { status: "good", message: "No duplicate outbound links." },
};
