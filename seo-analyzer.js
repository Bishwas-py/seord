const cheerio = require('cheerio');
const HtmlAnalyzer = require('./html-analyzer.js');

/**
 * Class to analyze the SEO of a website.
 * @class
 */
export class SeoAnalyzer {
    /**
     * Constructor
     * @param {ContentJson} content - JSON object containing html content, main keyword, sub keywords, language code and country code
     * @param {HtmlAnalyzer} htmlAnalyzer - HtmlAnalyzer object
     */
    constructor(content, htmlAnalyzer) {
        this.content = content;
        this.htmlAnalyzer = htmlAnalyzer;
        this.htmlDom = htmlAnalyzer.htmlDom;
    }

    /**
     * Function to get the SEO score
     * @returns {number} SEO score
     */
    getSeoScore() {
        let score = 0;
        score += this.getKeywordDensity() * 10;
        score += this.htmlAnalyzer.getTotalInternalLinks() * 3;
        score += this.htmlAnalyzer.getTotalOutboundLinks() * 2;
        score = score / 15;
        return Math.min(score, 100);
    }

    /**
     * Function to get keyword density
     * @returns {number} Keyword density
     */
    getKeywordDensity() {
        const keywordCount = this.countOccurrencesInBody(this.content.keyword);
        const bodyText = this.htmlDom('body').text();
        return this.calculateDensity(keywordCount, bodyText);
    }

    /**
     * Function to get sub keyword density
     * @returns {Array<{ keyword: string, density: number }>} Array of keyword and its density
     */
    getSubKeywordsDensity() {
        const densities = [];
        for (const subKeyword of this.content.sub_keywords) {
            const subKeywordCount = this.countOccurrencesInBody(subKeyword);
            const bodyText = this.htmlDom('body').text();
            densities.push({
                keyword: subKeyword,
                density: this.calculateDensity(subKeywordCount, bodyText)
            });
        }
        return densities;
    }

    /**
     * Function to count the occurrence of a keyword in the body content
     * @param {string} keyword - The keyword to lookup
     * @returns {number} Count of occurrence
     */
    countOccurrencesInBody(keyword) {
        return this.htmlDom(`body:contains(${keyword})`).length;
    }

    /**
     * Function to calculate the density of a keyword
     * @param {number} count - Count of the keyword
     * @param {string} bodyText - The text to lookup
     * @returns {number} Density of keyword
     */
    calculateDensity(count, bodyText) {
        return (count / bodyText.split(' ').length) * 100;
    }

    /**
     * Function to get total internal links count
     * @returns {number} Total internal links count
     */
    totalInternalLinks() {
        return this.htmlAnalyzer.getTotalInternalLinks();
    }

    /**
     * Function to get total outbound links count
     * @returns {number} Total outbound links count
     */
    totalExternalLinks() {
        return this.htmlAnalyzer.getTotalOutboundLinks();
    }

    /**
     * Function to get SEO warnings
     * @returns {Array<string>} Array of warnings
     */
    getWarnings() {
        const warnings = [];

        let keywordDensity = this.getKeywordDensity();
        const wordCount = this.htmlAnalyzer.getWordCount();

        // warning for keyword density > 5.5%
        if (keywordDensity > 5.5) warnings.push('Keyword density is too high.');

        // warning for less internal links based on content length
        if (this.totalInternalLinks() < (wordCount / 100)) {
            warnings.push('Not enough internal links based on content length.');
        }

        // warning for less outbound links based on content length
        if (this.totalExternalLinks() < (wordCount / 200)) {
            warnings.push('Not enough outbound links based on content length.');
        }

        // checking keyword density for subKeywords
        const subKeywordsDensity = this.getSubKeywordsDensity();
        for (let i = 0; i < subKeywordsDensity.length; i++) {
            if (subKeywordsDensity[i].density > 5.5) {
                warnings.push(`The density of ${subKeywordsDensity[i].keyword} is too high.`);
            }
        }

        return warnings;
    }

    /**
     * Function to get SEO good points
     * @returns {Array<string>} Array of good points
     */
    getGoodPoints() {
        const goodPoints = [];
        if (this.getKeywordDensity() <= 5.5) goodPoints.push('Good keyword density.');
        if (this.totalInternalLinks() >= 100) goodPoints.push('Good internal links.');
        if (this.totalExternalLinks() >= 10) goodPoints.push('Good outbound links.');
        return goodPoints;
    }

    /**
     * Function to get SEO critical warnings
     * @returns {Array<string>} Array of critical warnings
     */
    getCriticalWarning() {
        const criticalWarnings = [];
        if (this.getKeywordDensity() > 10) criticalWarnings.push('Serious keyword overstuffing.');
        if (this.htmlDom('title').text().length > 60) criticalWarnings.push('Title tag is too long.');
        if (!this.content.meta_description) criticalWarnings.push('Missing meta description.');
        return criticalWarnings;
    }

    getKeywordInQuestion() {
        const keyword = this.content.keyword;
        const keywordCount = this.countOccurrencesInString(keyword, this.content.question);
        const density = this.calculateDensity(keywordCount, this.content.question);
        return {
            keyword,
            density
        }
    }

    countOccurrencesInString(keyword, string) {
        return string.split(keyword).length - 1;
    }
}
