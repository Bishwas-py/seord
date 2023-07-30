const SeoAnalyzer = require('./seo-analyzer');
const HtmlAnalyzer = require('./html-analyzer');

/**
 * Class to perform SEO check of a website
 * @class
 */
class SeoCheck {
    /**
     * Constructor
     * @param {string} htmlContent - The HTML content of the website
     * @param {string} keyword - The main keyword for the website
     * @param {Array<string>} subKeywords - Array of sub keywords
     * @param {string} languageCode - Default='en', Language of the website
     * @param {string} countryCode - Default='US', Country code of the website
     * @param {?string} siteDomainName - Domain name of the website
     */
    constructor(htmlContent, keyword, subKeywords, languageCode = 'en', countryCode = 'US', siteDomainName = null) {
        this.htmlContent = htmlContent;
        this.keyword = keyword;
        this.subKeywords = subKeywords;
        this.languageCode = languageCode;
        this.countryCode = countryCode;
        this.siteDomainName = siteDomainName;
    }

    /**
     * Function to perform SEO analysis
     * @returns {Object} Object containing details of SEO analysis
     */
    analyzeSeo() {
        const htmlAnalyzer = new HtmlAnalyzer(this.htmlContent, this.siteDomainName);
        const seoAnalyzer = new SeoAnalyzer(
            this.keyword,
            this.subKeywords,
            htmlAnalyzer,
            this.siteDomainName,
            this.languageCode,
            this.countryCode
        );

        return {
            seoScore: seoAnalyzer.getSeoScore(),
            warnings: seoAnalyzer.getWarnings(),
            goodPoints: seoAnalyzer.getGoodPoints(),
            keywordDensity: seoAnalyzer.getKeywordDensity(),
            subKeywordDensity: seoAnalyzer.getSubKeywordsDensity(),
            totalLinks: htmlAnalyzer.getTotalLinks(),
            totalInternalLinks: htmlAnalyzer.getTotalInternalLinks(),
            totalOutboundLinks: htmlAnalyzer.getTotalOutboundLinks(),
            criticalWarning: seoAnalyzer.getCriticalsWarning()
        };
    }
}

module.exports = SeoCheck;