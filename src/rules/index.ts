import type { Rule } from "../types";
import { keywordDensityRule, keywordOverstuffing, keywordPresence } from "./keyword";
import { subKeywordDensity, subKeywordsPresence } from "./sub-keywords";
import { titleKeyword, titleLength, titleSubKeywords } from "./title";
import {
    metaDescriptionKeywordDensity,
    metaDescriptionLength,
    metaDescriptionStartsWithKeyword,
    metaDescriptionSubKeywords,
} from "./meta-description";
import {
    headingH2Presence,
    headingH3Presence,
    headingSingleH1,
    headingsKeyword,
    headingsPresence,
    headingsSubKeywords,
} from "./headings";
import {
    internalLinkDuplicates,
    internalLinksCount,
    outboundLinkDuplicates,
    outboundLinksCount,
} from "./links";

export const allRules: Rule[] = [
    keywordPresence,
    keywordOverstuffing,
    keywordDensityRule,
    subKeywordsPresence,
    subKeywordDensity,
    titleLength,
    titleKeyword,
    titleSubKeywords,
    metaDescriptionLength,
    metaDescriptionKeywordDensity,
    metaDescriptionStartsWithKeyword,
    metaDescriptionSubKeywords,
    headingsPresence,
    headingSingleH1,
    headingH2Presence,
    headingH3Presence,
    headingsKeyword,
    headingsSubKeywords,
    internalLinksCount,
    outboundLinksCount,
    internalLinkDuplicates,
    outboundLinkDuplicates,
];
