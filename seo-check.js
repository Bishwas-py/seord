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
        this.htmlAnalyzer = new HtmlAnalyzer(this.content.html_text, this.siteDomainName);
        this.seoAnalyzer = new SeoAnalyzer(
            this.content,
            this.htmlAnalyzer
        );

        return {
            seoScore: this.seoAnalyzer.getSeoScore(),
            messages: this.seoAnalyzer.getMessages(),
            keywordDensity: this.seoAnalyzer.getKeywordDensity(),
            subKeywordDensity: this.seoAnalyzer.getSubKeywordsDensity(),
            totalLinks: this.htmlAnalyzer.getAllLinks().length,
            internalLinks: this.htmlAnalyzer.getInternalLinks(),
            outboundLinks: this.htmlAnalyzer.getOutboundLinks(),
            questionSEO: {
                subKeywordsWithQuestion: this.seoAnalyzer.getSubKeywordsInQuestion(),
                keywordWithQuestion: this.seoAnalyzer.getKeywordInQuestion(),
            }
        };
    }
}

module.exports = SeoCheck;