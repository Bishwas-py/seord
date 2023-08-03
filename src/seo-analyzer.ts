import type {HtmlAnalyzer} from "./html-analyzer";
import type {ContentJson, KeywordDensity} from "./interfaces";

export class SeoAnalyzer {

    MINIMUM_KEYWORD_DENSITY = 0.5
    MAXIMUM_KEYWORD_DENSITY = 5

    public content: ContentJson;
    public htmlAnalyzer: HtmlAnalyzer;
    public htmlDom: HtmlAnalyzer['htmlDom'];
    public bodyText: string;

    constructor(content: ContentJson, htmlAnalyzer: HtmlAnalyzer) {
        this.content = content;
        this.htmlAnalyzer = htmlAnalyzer;
        this.htmlDom = htmlAnalyzer.htmlDom;
        this.bodyText = this.htmlDom.text().toLowerCase();
    }


    getSubKeywordsDensity(): KeywordDensity[] {
        const densities: KeywordDensity[] = [];
        for (const subKeyword of this.content.subKeywords) {
            let data: KeywordDensity = {
                keyword: subKeyword,
                density: this.calculateDensity(subKeyword)
            }
            densities.push(data);
        }
        return densities;
    }


    calculateDensity(keyword: string, bodyText: string | null = null): number {
        if (!bodyText) {
            bodyText = this.bodyText;
        }
        let keywordCount = this.countOccurrencesInString(keyword, bodyText);
        return (keywordCount / bodyText.split(' ').length) * 100;
    }

    getKeywordDensity(): number {
        return this.calculateDensity(this.content.keyword);
    }


    totalUniqueInternalLinksCount(): number {
        return this.htmlAnalyzer.getInternalLinks().unique.length;
    }

    totalUniqueExternalLinksCount(): number {
        return this.htmlAnalyzer.getOutboundLinks().unique.length;
    }

    getMessages() {
        const warnings: string[] = [];
        const goodPoints: string[] = [];

        let keywordDensity = this.getKeywordDensity();
        const wordCount = this.htmlAnalyzer.getWordCount();

        if (this.content.keyword) {
            goodPoints.push(`Your main keyword is "${this.content.keyword}".`);
        } else {
            warnings.push('Missing main keyword.');
        }

        if (this.content.subKeywords.length > 0) {
            goodPoints.push(`Your sub keywords are "${this.content.subKeywords.join('", "')}".`);
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
                warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${densityBeingLowString}, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
            } else {
                goodPoints.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${subKeywordDensity.density.toFixed(2)}%.`);
            }
        });


        if (this.getKeywordInTitle()) {
            goodPoints.push(`You have your main keyword in question.`);
        } else {
            warnings.push('No main keyword in question.');
        }

        if (this.getSubKeywordsInTitle().length > 0) {
            goodPoints.push(`You have ${this.getSubKeywordsInTitle().length} sub keywords in question.`);
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
        if (!this.content.metaDescription) warnings.push('Missing meta description.');

        return {warnings, goodPoints};
    }

    getKeywordInTitle(keyword: string|null = null): KeywordDensity {
        if (keyword === null) {
            keyword = this.content.keyword as string;
        }
        const density = this.calculateDensity(keyword, this.content.title);
        return {
            keyword,
            density,
            position: this.content.title?.indexOf(keyword)
        } as KeywordDensity;
    }

    getSubKeywordsInTitle(): KeywordDensity[] {
        let subKeywordsInQuestion: KeywordDensity[] = []
        this.content.subKeywords.forEach((sub_keyword: string) => {
            subKeywordsInQuestion.push(this.getKeywordInTitle(sub_keyword));
        })
        return subKeywordsInQuestion;
    }

    countOccurrencesInString(keyword: string, stringContent: string): number {
        return stringContent.split(keyword).length - 1;
    }


    getSeoScore(): number {
        const MAX_SCORE = 100;
        const {warnings, goodPoints} = this.getMessages();
        const messagesScore = ((goodPoints.length) / (warnings.length + goodPoints.length)) * 100;
        return Math.min(messagesScore, MAX_SCORE); // SEO score should never go above 100
    }

    getKeywordSeoScore(): number {
        const MAX_SCORE = 100;
        const keywordDensity = this.getKeywordDensity();
        const keywordInQuestion = this.getKeywordInTitle();
        const subKeywordsInQuestion = this.getSubKeywordsInTitle();
        const subKeywordsDensity = this.getSubKeywordsDensity();
        const keywordInQuestionScore = keywordInQuestion.density * 10;
        const subKeywordsInQuestionScore = subKeywordsInQuestion.length * 10;
        const subKeywordsDensityScore = subKeywordsDensity.reduce((total, subKeywordDensity) => {
            return total + (subKeywordDensity.density * 10);
        }, 0);
        const keywordDensityScore = keywordDensity * 10;
        const totalScore = keywordInQuestionScore + subKeywordsInQuestionScore + subKeywordsDensityScore + keywordDensityScore;
        return Math.min(totalScore, MAX_SCORE); // SEO score should never go above 100
    }

    getTitleWordCount(): number {
        return this.htmlAnalyzer.getWordCount(this.content.title);
    }
}

