"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoAnalyzer = void 0;
class SeoAnalyzer {
    constructor(content, htmlAnalyzer) {
        this.MINIMUM_KEYWORD_DENSITY = 1;
        this.MAXIMUM_KEYWORD_DENSITY = 3;
        this.MAXIMUM_SUB_KEYWORD_DENSITY = 1;
        this.MINIMUM_SUB_KEYWORD_DENSITY = 0.12;
        this.EXTREME_LOW_SUB_KEYWORD_DENSITY = 0.09;
        this.MAXIMUM_META_DESCRIPTION_LENGTH = 160;
        this.MAXIMUM_META_DESCRIPTION_DENSITY = 5;
        this.MINIMUM_META_DESCRIPTION_DENSITY = 2;
        this.MAXIMUM_TITLE_LENGTH = 70;
        this.MINIMUM_TITLE_LENGTH = 40;
        this.MAXIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY = 5;
        this.MINIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY = 2;
        this.messages = {
            warnings: [],
            minorWarnings: [],
            goodPoints: []
        };
        this.content = content;
        this.htmlAnalyzer = htmlAnalyzer;
        this.keywordDensity = this.calculateDensity(this.content.keyword);
        this.assignMessages();
    }
    getSubKeywordsDensity() {
        const densities = [];
        for (const subKeyword of this.content.subKeywords) {
            let data = {
                keyword: subKeyword,
                density: this.calculateDensity(subKeyword)
            };
            densities.push(data);
        }
        return densities;
    }
    totalUniqueInternalLinksCount() {
        return this.htmlAnalyzer.getInternalLinks().unique.length;
    }
    totalUniqueExternalLinksCount() {
        return this.htmlAnalyzer.getOutboundLinks().unique.length;
    }
    getKeywordInTitle(keyword = null) {
        var _a;
        keyword = keyword !== null && keyword !== void 0 ? keyword : this.content.keyword;
        const density = this.calculateDensity(keyword, this.content.title);
        return {
            keyword,
            density,
            position: (_a = this.content.title) === null || _a === void 0 ? void 0 : _a.indexOf(keyword)
        };
    }
    getSubKeywordsInTitle() {
        let subKeywordsInTitle = [];
        this.content.subKeywords.forEach((sub_keyword) => {
            subKeywordsInTitle.push(this.getKeywordInTitle(sub_keyword));
        });
        return subKeywordsInTitle;
    }
    getKeywordInMetaDescription(keyword = null) {
        var _a;
        if (keyword === null) {
            keyword = this.content.keyword;
        }
        const density = this.calculateDensity(keyword, this.content.metaDescription);
        return {
            keyword,
            density,
            position: (_a = this.content.metaDescription) === null || _a === void 0 ? void 0 : _a.indexOf(keyword)
        };
    }
    getSubKeywordsInMetaDescription() {
        let subKeywordsInTitle = [];
        this.content.subKeywords.forEach((sub_keyword) => {
            subKeywordsInTitle.push(this.getKeywordInMetaDescription(sub_keyword));
        });
        return subKeywordsInTitle;
    }
    getSeoScore() {
        const MAX_SCORE = 100;
        const { warnings, goodPoints } = this.messages;
        const messagesScore = ((goodPoints.length) / (warnings.length + goodPoints.length)) * 100;
        return Math.min(messagesScore, MAX_SCORE); // SEO score should never go above 100
    }
    getKeywordSeoScore() {
        const MAX_SCORE = 100;
        const keywordInTitle = this.getKeywordInTitle();
        const subKeywordsInTitle = this.getSubKeywordsInTitle();
        const subKeywordsDensity = this.getSubKeywordsDensity();
        const keywordInTitleScore = keywordInTitle.density * 10;
        const subKeywordsInTitleScore = subKeywordsInTitle.length * 10;
        const subKeywordsDensityScore = subKeywordsDensity.reduce((total, subKeywordDensity) => {
            return total + (subKeywordDensity.density * 10);
        }, 0);
        const keywordDensityScore = this.keywordDensity * 10;
        const totalScore = keywordInTitleScore + subKeywordsInTitleScore + subKeywordsDensityScore + keywordDensityScore;
        return Math.min(totalScore, MAX_SCORE); // SEO score should never go above 100
    }
    getTitleWordCount() {
        return this.htmlAnalyzer.getWordCount(this.content.title);
    }
    assignMessagesForKeyword() {
        // warning for keyword not in content
        if (this.content.keyword) {
            this.messages.goodPoints.push(`Good, your content has a keyword "${this.content.keyword}".`);
            // warning for keyword overstuffing
            if (this.keywordDensity > 5) {
                this.messages.warnings.push('Serious keyword overstuffing.');
            }
            // warning for keyword density too high or too low based on content length
            if (this.keywordDensity < this.MINIMUM_KEYWORD_DENSITY) {
                this.messages.warnings.push(`Keyword density is too low. It is ${this.keywordDensity.toFixed(2)}%, try increasing it.`);
            }
            else if (this.keywordDensity > this.MAXIMUM_KEYWORD_DENSITY) {
                this.messages.warnings.push(`Keyword density is too high. It is ${this.keywordDensity.toFixed(2)}%, try decreasing it.`);
            }
            else {
                this.messages.goodPoints.push(`Keyword density is ${this.keywordDensity.toFixed(2)}%.`);
            }
        }
        else {
            this.messages.warnings.push('Missing main keyword, please add one.');
        }
    }
    assignMessagesForSubKeywords() {
        // warning for sub keywords in content
        if (this.content.subKeywords.length > 0) {
            this.messages.goodPoints.push(`Good, your content has sub keywords "${this.content.subKeywords.join(', ')}".`);
            // warning for sub keywords not in title
            const subKeywordsDensity = this.getSubKeywordsDensity();
            subKeywordsDensity.forEach((subKeywordDensity) => {
                if (subKeywordDensity.density > this.MAXIMUM_SUB_KEYWORD_DENSITY) {
                    this.messages.warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is too high in the content, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
                }
                else if (subKeywordDensity.density < this.MINIMUM_SUB_KEYWORD_DENSITY) {
                    let densityBeingLowString = subKeywordDensity.density < this.EXTREME_LOW_SUB_KEYWORD_DENSITY ? 'too low' : 'low';
                    this.messages.warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${densityBeingLowString} in the content, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
                }
                else {
                    this.messages.goodPoints.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${subKeywordDensity.density.toFixed(2)}% in the content, which is good.`);
                }
            });
        }
        else {
            this.messages.minorWarnings.push('Missing sub keywords, please add some.');
        }
    }
    assignMessagesForTitle() {
        // warning for content title and its length
        if (this.content.title) {
            if (this.content.title.length > this.MAXIMUM_TITLE_LENGTH) {
                this.messages.warnings.push('Title tag is too long.');
            }
            else if (this.content.title.length < this.MINIMUM_TITLE_LENGTH) {
                this.messages.warnings.push('Title tag is too short.');
            }
            else {
                this.messages.goodPoints.push(`Title tag is ${this.content.title.length} characters long.`);
            }
            const keywordInTitle = this.getKeywordInTitle();
            if (keywordInTitle.density) {
                this.messages.goodPoints.push(`Keyword density in title is ${keywordInTitle.density.toFixed(2)}%, which is good.`);
            }
            else {
                this.messages.warnings.push('No main keyword in title.');
            }
            if (this.content.title) {
                if (this.getSubKeywordsInTitle().length > 0) {
                    this.messages.goodPoints.push(`You have ${this.getSubKeywordsInTitle().length} sub keywords in title.`);
                }
                else {
                    this.messages.minorWarnings.push('No sub keywords in the title.');
                }
            }
        }
        else {
            this.messages.warnings.push('Missing title tag, please add one.');
        }
    }
    assignMessagesForLinks() {
        let wordCount = this.htmlAnalyzer.getWordCount();
        // warning for less internal links based on content length
        if (this.totalUniqueInternalLinksCount() < (wordCount / 300)) {
            this.messages.warnings.push(`Not enough internal links. You only have ${this.totalUniqueInternalLinksCount()} unique internal links, try increasing it.`);
        }
        else {
            this.messages.goodPoints.push(`You have ${this.totalUniqueInternalLinksCount()} internal links.`);
        }
        // warning for less outbound links based on content length
        if (this.totalUniqueExternalLinksCount() < (wordCount / 400)) {
            this.messages.warnings.push(`Not enough outbound links. You only have ${this.totalUniqueExternalLinksCount()}, try increasing it.`);
        }
        // warning for duplicate internal links
        if (this.htmlAnalyzer.getInternalLinks().duplicate.length > 1) {
            this.messages.minorWarnings.push(`You have ${this.htmlAnalyzer.getInternalLinks().duplicate.length} duplicate internal links.`);
        }
        else {
            this.messages.goodPoints.push('No duplicate internal links.');
        }
        // warning for duplicate external links
        if (this.htmlAnalyzer.getOutboundLinks().duplicate.length > 1) {
            this.messages.minorWarnings.push(`You have ${this.htmlAnalyzer.getOutboundLinks().duplicate.length} duplicate outbound links.`);
        }
        else {
            this.messages.goodPoints.push('No duplicate outbound links.');
        }
    }
    assignMessagesForMetaDescription() {
        if (this.content.metaDescription) {
            let keywordInMetaDescription = this.getKeywordInMetaDescription();
            // warning for meta description length
            if (this.content.metaDescription.length > this.MAXIMUM_META_DESCRIPTION_LENGTH) {
                this.messages.warnings.push(`Meta description is too long. It is ${this.content.metaDescription.length} characters long, try reducing it.`);
            }
            else if (this.content.metaDescription.length < 100) {
                this.messages.warnings.push(`Meta description is too short. It is ${this.content.metaDescription.length} characters long, try increasing it.`);
            }
            else {
                this.messages.goodPoints.push(`Meta description is ${this.content.metaDescription.length} characters long.`);
                // warning for meta description keyword density
                if (keywordInMetaDescription.density > this.MAXIMUM_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`Keyword density of meta description is too high. It is ${keywordInMetaDescription.density.toFixed(2)}%, try decreasing it.`);
                }
                else if (keywordInMetaDescription.density < this.MINIMUM_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`Keyword density of meta description is too low. It is ${keywordInMetaDescription.density.toFixed(2)}%, try increasing it.`);
                }
                else {
                    this.messages.goodPoints.push(`Keyword density of meta description is ${keywordInMetaDescription.density.toFixed(2)}%, which is good.`);
                }
            }
            // warning for meta description not starting with keyword
            if (keywordInMetaDescription.position > 1) {
                this.messages.minorWarnings.push(`Meta description does not start with keyword. It starts with "${this.content.metaDescription.substring(0, 20)}", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.`);
            }
            else {
                this.messages.goodPoints.push(`Meta description starts with keyword, i.e. "${this.content.metaDescription.substring(0, 20)}".`);
            }
            // warning for meta description not ending with keyword
            let subKeywordsInMetaDescription = this.getSubKeywordsInMetaDescription();
            subKeywordsInMetaDescription.forEach((subKeyword) => {
                if (subKeyword.density > this.MAXIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is too high, i.e. ${subKeyword.density.toFixed(2)}%.`);
                }
                else if (subKeyword.density < this.MINIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY) {
                    let densityBeingLowString = subKeyword.density < 0.2 ? 'too low' : 'low';
                    this.messages.warnings.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is ${densityBeingLowString}, i.e. ${subKeyword.density.toFixed(2)}%.`);
                }
                else {
                    this.messages.goodPoints.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is ${subKeyword.density.toFixed(2)}%.`);
                }
            });
        }
        else {
            this.messages.warnings.push('Missing meta description.');
        }
    }
    /**
     * Returns the messages object.
     * @return object The messages object.
     * @example
     * {
     *    goodPoints: [],
     *    warnings: [],
     *    minorWarnings: [],
     * }
     * @see SeoAnalyzer.messages
     */
    assignMessages() {
        this.assignMessagesForKeyword();
        this.assignMessagesForSubKeywords();
        this.assignMessagesForTitle();
        this.assignMessagesForLinks();
        this.assignMessagesForMetaDescription();
        return this.messages;
    }
    /**
     * Calculates the density of a keyword in the given string of body text.
     * @param keyword Should not be null.
     * @param bodyText If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     */
    calculateDensity(keyword, bodyText = null) {
        bodyText = bodyText !== null && bodyText !== void 0 ? bodyText : this.htmlAnalyzer.bodyText;
        return (this.countOccurrencesInString(keyword, bodyText) / this.htmlAnalyzer.getWordCount(bodyText)) * 100;
    }
    /**
     * Returns the number of occurrences of a keyword in a string. Or you can say, it returns the keyword count in the given string.
     * @param keyword If null, it will use the default value, i.e. `this.content.keyword`
     * @param stringContent If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     * @return number The number of occurrences of the keyword in the string.
     */
    countOccurrencesInString(keyword = null, stringContent = null) {
        keyword = keyword !== null && keyword !== void 0 ? keyword : this.content.keyword;
        stringContent = stringContent !== null && stringContent !== void 0 ? stringContent : this.htmlAnalyzer.bodyText;
        return stringContent.split(keyword).length - 1; // -1 because the split function will always return one more than the actual occurrences
    }
}
exports.SeoAnalyzer = SeoAnalyzer;
//# sourceMappingURL=seo-analyzer.js.map