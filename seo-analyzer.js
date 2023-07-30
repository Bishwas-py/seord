const cheerio = require('cheerio');
const HtmlAnalyzer = require('./html-analyzer.js');

/**
 * Class to analyze the SEO of a website.
 * @class
 */
class SeoAnalyzer {
    /**
     * Constructor
     * @param {string} keyword - The main keyword for the website
     * @param {Array<string>} subKeywords - Array of sub keywords
     * @param {HtmlAnalyzer} htmlAnalyzer - An instance of HtmlAnalyzer
     * @param {?string} siteDomainName - Domain name of the website
     * @param {string} languageCode - Default='en', Language of the website
     * @param {string} countryCode - Default='us', Country code of the website
     */
    constructor(keyword, subKeywords, htmlAnalyzer, siteDomainName = null, languageCode = 'en', countryCode = 'us') {
        this.keyword = keyword;
        this.subKeywords = subKeywords;
        this.htmlAnalyzer = htmlAnalyzer;
        this.siteDomainName = siteDomainName;
        this.languageCode = languageCode;
        this.countryCode = countryCode;
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
        const keywordCount = this.countOccurrences(this.keyword);
        const bodyText = this.htmlDom('body').text();
        return this.calculateDensity(keywordCount, bodyText);
    }

    /**
     * Function to get sub keyword density
     * @returns {Array<{ keyword: string, density: number }>} Array of keyword and its density
     */
    getSubKeywordsDensity() {
        const densities = [];
        for (const subKeyword of this.subKeywords) {
            const subKeywordCount = this.countOccurrences(subKeyword);
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
    countOccurrences(keyword) {
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
        if (this.getKeywordDensity() > 5.5) warnings.push('Keyword overstuffing.');
        if (this.totalInternalLinks() < 100) warnings.push('Not enough internal links.');
        if (this.totalExternalLinks() < 10) warnings.push('Not enough outbound links.');
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
    getCriticalsWarning() {
        const criticalWarnings = [];
        if (this.getKeywordDensity() > 10) criticalWarnings.push('Serious keyword overstuffing.');
        if (this.htmlDom('title').text().length > 60) criticalWarnings.push('Title tag is too long.');
        if (!this.htmlDom('meta[name="description"]').attr('content')) criticalWarnings.push('Missing meta description.');
        return criticalWarnings;
    }
}

module.exports = SeoAnalyzer;