
import { SeoAnalyzer } from './seo-analyzer.js';
import { HtmlAnalyzer } from './html-analyzer.js';

/**
 * Class to perform SEO check of a website
 * @typedef {{
 *    question: string,
 *    html_text: string,
 *    keyword: string,
 *    sub_keywords: Array<string>,
 *    meta_description: string,
 *    language_code: string|null,
 *    country_code: string|null
 *    }} ContentJson
 */

/**
 * Class to perform SEO check of a website
 * @class
 */
export class SeoCheck {
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
     * @returns {{
     *     seoScore: number,
     *     messages: SeoAnalyzerMessages,
     *     keywordDensity: number,
     *     subKeywordDensity: number,
     *     totalLinks: number,
     *     internalLinks: Link[],
     *     outboundLinks: Link[],
     *     questionSEO: {
     *          subKeywordsWithQuestion: KeywordDensity[],
     *          keywordWithQuestion: KeywordDensity
     *      }
     *    }}
     *     Object containing SEO score, messages, keyword density, sub keyword density, total links, internal links, outbound links, sub keywords with question and keyword with question
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