"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRules = void 0;
const keyword_1 = require("./keyword");
const sub_keywords_1 = require("./sub-keywords");
const title_1 = require("./title");
const meta_description_1 = require("./meta-description");
const headings_1 = require("./headings");
const links_1 = require("./links");
exports.allRules = [
    keyword_1.keywordPresence,
    keyword_1.keywordOverstuffing,
    keyword_1.keywordDensityRule,
    sub_keywords_1.subKeywordsPresence,
    sub_keywords_1.subKeywordDensity,
    title_1.titleLength,
    title_1.titleKeyword,
    title_1.titleSubKeywords,
    meta_description_1.metaDescriptionLength,
    meta_description_1.metaDescriptionKeywordDensity,
    meta_description_1.metaDescriptionStartsWithKeyword,
    meta_description_1.metaDescriptionSubKeywords,
    headings_1.headingsPresence,
    headings_1.headingSingleH1,
    headings_1.headingH2Presence,
    headings_1.headingH3Presence,
    headings_1.headingsKeyword,
    headings_1.headingsSubKeywords,
    links_1.internalLinksCount,
    links_1.outboundLinksCount,
    links_1.internalLinkDuplicates,
    links_1.outboundLinkDuplicates,
];
//# sourceMappingURL=index.js.map