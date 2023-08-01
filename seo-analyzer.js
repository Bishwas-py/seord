/**
 * @typedef {{warnings: Array<string>, goodPoints: Array<string>}} SeoAnalyzerMessages
 * @typedef {{keyword: string, density: number}} KeywordDensity
 */
/**
 * Class to analyze the SEO of a website.
 * @class
 */
export class SeoAnalyzer {

    MINIMUM_KEYWORD_DENSITY = 0.5
    MAXIMUM_KEYWORD_DENSITY = 5

    /**
     * Constructor
     * @param {ContentJson} content - JSON object containing html content, main keyword, sub keywords, language code and country code
     * @param {HtmlAnalyzer} htmlAnalyzer - HtmlAnalyzer object
     */
    constructor(content, htmlAnalyzer) {
        this.content = content;
        this.htmlAnalyzer = htmlAnalyzer;
        this.htmlDom = htmlAnalyzer.htmlDom;
        this.bodyText = this.htmlDom.text().toLowerCase();
    }


    /**
     * Function to get sub keyword density
     * @returns {Array<{ keyword: string, density: number }>} Array of keyword and its density
     */
    getSubKeywordsDensity() {
        const densities = [];
        for (const subKeyword of this.content.sub_keywords) {
            let data = {
                keyword: subKeyword,
                density: this.calculateDensity(subKeyword)
            }
            densities.push(data);
        }
        return densities;
    }

    /**
     * Function to calculate the density of a keyword
     * @param {null} keyword - Count of the keyword
     * @param {string, null} bodyText - The text to lookup
     * @returns {number} Density of keyword
     */
    calculateDensity(keyword, bodyText= null) {
        if (!bodyText) {
            bodyText = this.bodyText;
        }
        let keywordCount = this.countOccurrencesInString(keyword, bodyText);
        return (keywordCount / bodyText.split(' ').length) * 100;
    }

    /**
     * Function to get keyword density
     * @returns {number} Keyword density
     */
    getKeywordDensity() {
        return this.calculateDensity(this.content.keyword);
    }


    /**
     * Function to get total internal links count
     * @returns {number} Total internal links count
     */
    totalUniqueInternalLinksCount() {
        return this.htmlAnalyzer.getInternalLinks().unique.length;
    }

    /**
     * Function to get total outbound links count
     * @returns {number} Total outbound links count
     */
    totalUniqueExternalLinksCount() {
        return this.htmlAnalyzer.getOutboundLinks().unique.length;
    }

    /**
     * Function to get SEO warnings
     * @returns {{warnings: Array<string>, goodPoints: Array<string>}} Object containing warnings and good points
     */
    getMessages() {
        const warnings = [];
        const goodPoints = [];

        let keywordDensity = this.getKeywordDensity();
        const wordCount = this.htmlAnalyzer.getWordCount();

        if (this.content.keyword) {
            goodPoints.push(`Your main keyword is "${this.content.keyword}".`);
        } else {
            warnings.push('Missing main keyword.');
        }

        if (this.content.sub_keywords.length > 0) {
            goodPoints.push(`Your sub keywords are "${this.content.sub_keywords.join('", "')}".`);
        } else {
            warnings.push('Missing sub keywords.');
        }
        // warning for keyword density too high or too low based on content length
        if (keywordDensity < this.MINIMUM_KEYWORD_DENSITY) {
            warnings.push(`Keyword density is too low. It is ${keywordDensity.toFixed(2)}%, try increasing it.`)
        } else if (keywordDensity > this.MAXIMUM_KEYWORD_DENSITY) {
            warnings.push(`Keyword density is too high. It is ${keywordDensity.toFixed(2)}%, try decreasing it.`)
        } else {
            goodPoints.push(`Keyword density is ${keywordDensity.toFixed(2)}%.`);
        }


        // checking keyword density for subKeywords
        const subKeywordsDensity = this.getSubKeywordsDensity();
        subKeywordsDensity.forEach((subKeywordDensity) => {
            if (subKeywordDensity.density > 3) {
                warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is too high, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
            } else if (subKeywordDensity.density < 0.3) {
                let densityBeingLowString = subKeywordDensity.density < 0.2 ? 'too low' : 'low';
                warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${ densityBeingLowString }, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
            } else {
                goodPoints.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${subKeywordDensity.density.toFixed(2)}%.`);
            }
        });


        if (this.getKeywordInQuestion()) {
            goodPoints.push(`You have your main keyword in question.`);
        } else {
            warnings.push('No main keyword in question.');
        }

        if (this.getSubKeywordsInQuestion().length > 0) {
            goodPoints.push(`You have ${this.getSubKeywordsInQuestion().length} sub keywords in question.`);
        } else {
            warnings.push('No sub keywords in question.');
        }

        // warning for less internal links based on content length
        if (this.totalUniqueInternalLinksCount() < (wordCount / 100)) {
            warnings.push(`Not enough internal links. You only have ${this.totalUniqueInternalLinksCount()} unique internal links, try increasing it.`)
        } else {
            goodPoints.push(`You have ${this.totalUniqueInternalLinksCount()} internal links.`);
        }
        // warning for less outbound links based on content length
        if (this.totalUniqueExternalLinksCount() < (wordCount / 200)) {
            warnings.push(`Not enough outbound links. You only have ${this.totalUniqueExternalLinksCount()}, try increasing it.`)
        }


        // warning for duplicate internal links
        if (this.htmlAnalyzer.getInternalLinks().duplicate.length > 1) {
            warnings.push(`You have ${this.htmlAnalyzer.getInternalLinks().duplicate.length} duplicate internal links.`);
        } else {
            goodPoints.push('No duplicate internal links.');
        }

        // warning for duplicate external links
        if (this.htmlAnalyzer.getOutboundLinks().duplicate.length > 1) {
            warnings.push(`You have ${this.htmlAnalyzer.getOutboundLinks().duplicate.length} duplicate outbound links.`);
        } else {
            goodPoints.push('No duplicate outbound links.');
        }

        if (this.getKeywordDensity() > 10) warnings.push('Serious keyword overstuffing.');
        if (this.htmlDom('title').text().length > 60) warnings.push('Title tag is too long.');
        if (!this.content.meta_description) warnings.push('Missing meta description.');

        return {warnings, goodPoints};
    }

    getKeywordInQuestion(keyword = null) {
        if (!keyword) {
            keyword = this.content.keyword
        }
        const density = this.calculateDensity(keyword, this.content.question);
        return {
            keyword,
            density
        }
    }

    getSubKeywordsInQuestion() {
        let subKeywordsInQuestion = []
        this.content.sub_keywords.forEach((sub_keyword) => {
            subKeywordsInQuestion.push(this.getKeywordInQuestion(sub_keyword));
        })
        return subKeywordsInQuestion;
    }

    countOccurrencesInString(keyword, string) {
        return string.split(keyword).length - 1;
    }



    /**
     * Function to get the SEO score; based on different factors
     * @returns {number} SEO score
     */
    getSeoScore() {
        const MAX_SCORE = 100;
        const { warnings, goodPoints } = this.getMessages();
         const messagesScore = ((goodPoints.length) / (warnings.length + goodPoints.length)) * 100;
        return Math.min(messagesScore, MAX_SCORE); // SEO score should never go above 100
    }
}

