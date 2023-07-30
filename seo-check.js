const SeoAnalyzer = require('./seo-analyzer');
const HtmlAnalyzer = require('./html-analyzer');

/**
 * Class to perform SEO check of a website
 * @typedef {{
 *    question: string,
 *    html_text: string,
 *    keyword: string,
 *    sub_keywords: Array<string>,
 *    meta_description: string,
 *    meta_title: string,
 *    meta_keywords: string,
 *    language_code: string,
 *    country_code: string
 *    }} ContentJson
 */

/**
 * Class to perform SEO check of a website
 * @class
 */
class SeoCheck {
    /**
     * Constructor
     * @param {ContentJson} contentJson - JSON object containing html content, main keyword, sub keywords, language code and country code
     * @param {?string} siteDomainName - Domain name of the website
    */
    constructor(contentJson, siteDomainName = null) {
        this.content = contentJson;
        this.siteDomainName = siteDomainName;
    }

    /**
     * Function to perform SEO analysis
     * @returns {Object} Object containing details of SEO analysis
     */
    analyzeSeo() {
        const htmlAnalyzer = new HtmlAnalyzer(this.content.html_text, this.siteDomainName);
        const seoAnalyzer = new SeoAnalyzer(
            this.content,
            htmlAnalyzer
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
            criticalWarning: seoAnalyzer.getCriticalWarning(),
        };
    }
}

module.exports = SeoCheck;