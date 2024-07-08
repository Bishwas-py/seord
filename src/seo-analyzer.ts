import type {HtmlAnalyzer} from "./html-analyzer";
import type {ContentJson, Heading, KeywordDensity} from "./interfaces";

export class SeoAnalyzer {

    MINIMUM_KEYWORD_DENSITY = 0.46
    MAXIMUM_KEYWORD_DENSITY = 1.1

    MAXIMUM_SUB_KEYWORD_DENSITY = 0.9
    MINIMUM_SUB_KEYWORD_DENSITY = 0.12
    EXTREME_LOW_SUB_KEYWORD_DENSITY = 0.09

    MAXIMUM_META_DESCRIPTION_LENGTH = 160
    MAXIMUM_META_DESCRIPTION_DENSITY = 5
    MINIMUM_META_DESCRIPTION_DENSITY = 2

    MAXIMUM_TITLE_LENGTH = 70
    MINIMUM_TITLE_LENGTH = 40

    MAXIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY = 5
    MINIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY = 2

    public content: ContentJson;
    public htmlAnalyzer: HtmlAnalyzer;
    public keywordDensity: number;
    public strictMode: boolean;
    public headings: Heading[] = [];

    public messages: { warnings: string[], minorWarnings: string[], goodPoints: string[] } = {
        warnings: [],
        minorWarnings: [],
        goodPoints: []
    }

    constructor(content: ContentJson, htmlAnalyzer: HtmlAnalyzer, strictMode: boolean = false) {
        this.content = content;
        this.htmlAnalyzer = htmlAnalyzer;
        this.strictMode = strictMode;
        this.keywordDensity = this.calculateDensity(this.content.keyword);
        this.headings = this.htmlAnalyzer.getAllHeadingTags();
        if (!strictMode) {
            this.headings.push(
                {
                    tag: 'H1',
                    'text': this.content.title
                }
            )
        }
        this.assignMessages();
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

    totalUniqueInternalLinksCount(): number {
        return this.htmlAnalyzer.getInternalLinks().unique.length;
    }

    totalUniqueExternalLinksCount(): number {
        return this.htmlAnalyzer.getOutboundLinks().unique.length;
    }

    getKeywordInTitle(keyword: string | null = null): KeywordDensity {
        keyword = keyword ?? this.content.keyword as string;
        const density = this.calculateDensity(keyword, this.content.title);
        return {
            keyword,
            density,
            position: this.getPosition(this.content.title, keyword)
        } as KeywordDensity;
    }

    getPosition(text: string, keyword: string) {
        if (!text || !keyword) return -1;
        return text.split(keyword)[0].split(' ').length
    }

    getSubKeywordsInTitle(): KeywordDensity[] {
        let subKeywordsInTitle: KeywordDensity[] = []
        this.content.subKeywords.forEach((sub_keyword: string) => {
            subKeywordsInTitle.push(this.getKeywordInTitle(sub_keyword));
        })
        return subKeywordsInTitle;
    }

    getKeywordInMetaDescription(keyword: string | null = null): KeywordDensity {
        if (keyword === null) {
            keyword = this.content.keyword as string;
        }
        const density = this.calculateDensity(keyword, this.content.metaDescription);
        return {
            keyword,
            density,
            position: this.getPosition(this.content.title, keyword)
        } as KeywordDensity;
    }

    getSubKeywordsInMetaDescription(): KeywordDensity[] {
        let subKeywordsInTitle: KeywordDensity[] = []
        this.content.subKeywords.forEach((sub_keyword: string) => {
            subKeywordsInTitle.push(this.getKeywordInMetaDescription(sub_keyword));
        })
        return subKeywordsInTitle;
    }


    getSeoScore(): number {
        const MAX_SCORE = 100;
        const {warnings, goodPoints} = this.messages;
        const messagesScore = ((goodPoints.length) / (warnings.length + goodPoints.length)) * 100;
        return Math.min(messagesScore, MAX_SCORE); // SEO score should never go above 100
    }

    getKeywordSeoScore(): number {
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

    getTitleWordCount(): number {
        return this.htmlAnalyzer.getWordCount(this.content.title);
    }

    private assignMessagesForKeyword() {
        // warning for keyword not in content
        if (this.content.keyword) {
            this.messages.goodPoints.push(`Good, your content has a keyword "${this.content.keyword}".`);

            // warning for keyword overstuffing
            if (this.keywordDensity > 5) {
                this.messages.warnings.push('Serious keyword overstuffing.');
            }

            // warning for keyword density too high or too low based on content length
            if (this.keywordDensity < this.MINIMUM_KEYWORD_DENSITY) {
                this.messages.warnings.push(`Keyword density is too low. It is ${this.keywordDensity.toFixed(2)}%, try increasing it.`)
            } else if (this.keywordDensity > this.MAXIMUM_KEYWORD_DENSITY) {
                this.messages.warnings.push(`Keyword density is too high. It is ${this.keywordDensity.toFixed(2)}%, try decreasing it.`)
            } else {
                this.messages.goodPoints.push(`Keyword density is ${this.keywordDensity.toFixed(2)}%.`);
            }
        } else {
            this.messages.warnings.push('Missing main keyword, please add one.');
        }
    }


    private assignMessagesForSubKeywords() {
        // warning for sub keywords in content
        if (this.content.subKeywords.length > 0) {
            this.messages.goodPoints.push(`Good, your content has sub keywords "${this.content.subKeywords.join(', ')}".`);

            // warning for sub keywords not in title
            const subKeywordsDensity = this.getSubKeywordsDensity();
            subKeywordsDensity.forEach((subKeywordDensity) => {
                if (subKeywordDensity.density > this.MAXIMUM_SUB_KEYWORD_DENSITY) {
                    this.messages.warnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is too high in the content, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
                } else if (subKeywordDensity.density < this.MINIMUM_SUB_KEYWORD_DENSITY) {
                    let densityBeingLowString = subKeywordDensity.density < this.EXTREME_LOW_SUB_KEYWORD_DENSITY ? 'too low' : 'low';
                    this.messages.minorWarnings.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${densityBeingLowString} in the content, i.e. ${subKeywordDensity.density.toFixed(2)}%.`);
                } else {
                    this.messages.goodPoints.push(`The density of sub keyword "${subKeywordDensity.keyword}" is ${subKeywordDensity.density.toFixed(2)}% in the content, which is good.`);
                }
            });
        } else {
            this.messages.minorWarnings.push('Missing sub keywords, please add some.');
        }
    }

    private assignMessagesForTitle() {
        // warning for content title and its length
        if (this.content.title) {
            if (this.content.title.length > this.MAXIMUM_TITLE_LENGTH) {
                this.messages.warnings.push('Title tag is too long.')
            } else if (this.content.title.length < this.MINIMUM_TITLE_LENGTH) {
                this.messages.warnings.push('Title tag is too short.')
            } else {
                this.messages.goodPoints.push(`Title tag is ${this.content.title.length} characters long.`);
            }

            const keywordInTitle = this.getKeywordInTitle();
            if (keywordInTitle.density) {
                this.messages.goodPoints.push(`Keyword density in title is ${keywordInTitle.density.toFixed(2)}%, which is good.`);
            } else {
                this.messages.warnings.push('No main keyword in title.');
            }
            if (this.content.title) {
                if (this.getSubKeywordsInTitle().length > 0) {
                    this.messages.goodPoints.push(`You have ${this.getSubKeywordsInTitle().length} sub keywords in title.`);
                } else {
                    this.messages.minorWarnings.push('No sub keywords in the title.');
                }
            }
        } else {
            this.messages.warnings.push('Missing title tag, please add one.');
        }
    }

    private assignMessagesForLinks() {
        let wordCount = this.htmlAnalyzer.getWordCount();
        // warning for less internal links based on content length
        if (this.totalUniqueInternalLinksCount() < (wordCount / 300)) {
            this.messages.warnings.push(`Not enough internal links. You only have ${this.totalUniqueInternalLinksCount()} unique internal links, try increasing it.`)
        } else {
            this.messages.goodPoints.push(`You have ${this.totalUniqueInternalLinksCount()} internal links.`);
        }
        // warning for less outbound links based on content length
        if (this.totalUniqueExternalLinksCount() < (wordCount / 400)) {
            this.messages.warnings.push(`Not enough outbound links. You only have ${this.totalUniqueExternalLinksCount()}, try increasing it.`)
        }


        // warning for duplicate internal links
        if (this.htmlAnalyzer.getInternalLinks().duplicate.length > 1) {
            this.messages.minorWarnings.push(`You have ${this.htmlAnalyzer.getInternalLinks().duplicate.length} duplicate internal links.`);
        } else {
            this.messages.goodPoints.push('No duplicate internal links.');
        }

        // warning for duplicate external links
        if (this.htmlAnalyzer.getOutboundLinks().duplicate.length > 1) {
            this.messages.minorWarnings.push(`You have ${this.htmlAnalyzer.getOutboundLinks().duplicate.length} duplicate outbound links.`);
        } else {
            this.messages.goodPoints.push('No duplicate outbound links.');
        }
    }

    private assignMessagesForMetaDescription() {
        if (this.content.metaDescription) {
            let keywordInMetaDescription = this.getKeywordInMetaDescription();

            // warning for meta description length
            if (this.content.metaDescription.length > this.MAXIMUM_META_DESCRIPTION_LENGTH) {
                this.messages.warnings.push(`Meta description is too long. It is ${this.content.metaDescription.length} characters long, try reducing it.`)
            } else if (this.content.metaDescription.length < 100) {
                this.messages.warnings.push(`Meta description is too short. It is ${this.content.metaDescription.length} characters long, try increasing it.`)
            } else {
                this.messages.goodPoints.push(`Meta description is ${this.content.metaDescription.length} characters long.`);

                // warning for meta description keyword density
                if (keywordInMetaDescription.density > this.MAXIMUM_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`Keyword density of meta description is too high. It is ${keywordInMetaDescription.density.toFixed(2)}%, try decreasing it.`)
                } else if (keywordInMetaDescription.density < this.MINIMUM_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`Keyword density of meta description is too low. It is ${keywordInMetaDescription.density.toFixed(2)}%, try increasing it.`)
                } else {
                    this.messages.goodPoints.push(`Keyword density of meta description is ${keywordInMetaDescription.density.toFixed(2)}%, which is good.`);
                }
            }

            // warning for meta description not starting with keyword
            if (keywordInMetaDescription.position > 1) {
                this.messages.minorWarnings.push(`Meta description does not start with keyword. It starts with "${this.content.metaDescription.substring(0, 20)}", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.`)
            } else {
                this.messages.goodPoints.push(`Meta description starts with keyword, i.e. "${this.content.metaDescription.substring(0, 20)}".`);
            }

            // warning for meta description not ending with keyword
            let subKeywordsInMetaDescription = this.getSubKeywordsInMetaDescription();
            subKeywordsInMetaDescription.forEach((subKeyword) => {
                if (subKeyword.density > this.MAXIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY) {
                    this.messages.warnings.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is too high, i.e. ${subKeyword.density.toFixed(2)}%.`);
                } else if (subKeyword.density < this.MINIMUM_SUB_KEYWORD_IN_META_DESCRIPTION_DENSITY) {
                    let densityBeingLowString = subKeyword.density < 0.2 ? 'too low' : 'low';
                    this.messages.minorWarnings.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is ${densityBeingLowString}, i.e. ${subKeyword.density.toFixed(2)}%.`);
                } else {
                    this.messages.goodPoints.push(`The density of sub keyword "${subKeyword.keyword}" in meta description is ${subKeyword.density.toFixed(2)}%.`);
                }
            });
        } else {
            this.messages.warnings.push('Missing meta description.')
        }
    }


    filterHeading(headingTag: string): Heading[] {
        return this.headings.filter((heading) => heading.tag.toLowerCase() === headingTag.toLowerCase())
    }

    private assignMessagesForHeadings() {
        if (this.headings.length === 0) {
            this.messages.warnings.push('Missing headings, please add at least one heading tag.');
        } else {
            this.messages.goodPoints.push(`You have ${this.headings.length} this.headings.`);
            // warning for missing h1 tag

            let headingsOne = this.filterHeading('h1');
            if (headingsOne.length === 0) {
                this.messages.warnings.push('Missing h1 tag, please add at least one h1 tag.');
            } else if (headingsOne.length > 1) {
                this.messages.warnings.push('More than one h1 tag found, please remove all but one h1 tag.');
            } else {
                this.messages.goodPoints.push('Nice. You have h1 tag, which is essential.');
            }

            let headingsTwo = this.filterHeading('h2');
            if (headingsTwo.length === 0) {
                this.messages.warnings.push('Missing h2 tag, please add at least one h2 tag. It is recommended to have at least one h2 tag.');
            } else {
                this.messages.goodPoints.push('Nice. You have h2 tag, which is essential.');
            }

            let headingsThree = this.filterHeading('h3');
            if (headingsThree.length === 0) {
                this.messages.minorWarnings.push('Missing h3 tag, please add at least one h3 tag. Having h3 tag is not mandatory, but it is recommended to have at least one h3 tag.');
            } else {
                this.messages.goodPoints.push('You have h3 tag, which is good.');
            }
        }
    }

    // keyword in Headings
    assignMessagesForKeywordInHeadings() {
        this.headings.forEach((heading) => {
            let keywordInHeading = this.countOccurrencesInString(this.content.keyword, heading.text);
            if (keywordInHeading > 0) {
                this.messages.goodPoints.push(`Keyword "${this.content.keyword}" found in ${heading.tag} tag "${heading.text}".`);
            } else {
                this.messages.minorWarnings.push(`Keyword "${this.content.keyword}" not found in ${heading.tag} tag "${heading.text}".`);
            }
        });
    }

    // sub keywords in Headings
    assignMessagesForSubKeywordsInHeadings() {
        this.headings.forEach((heading) => {
            this.content.subKeywords.forEach((subKeyword) => {
                let subKeywordInHeading = this.countOccurrencesInString(subKeyword, heading.text);
                if (subKeywordInHeading > 0) {
                    this.messages.goodPoints.push(`Sub keyword "${subKeyword}" found in ${heading.tag} tag "${heading.text}", which is good.`);
                } else {
                    this.messages.minorWarnings.push(`Sub keyword "${subKeyword}" not found in ${heading.tag} tag "${heading.text}".`);
                }
            });
        });
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
    private assignMessages() {
        this.assignMessagesForKeyword();
        this.assignMessagesForSubKeywords();
        this.assignMessagesForTitle();
        this.assignMessagesForLinks();
        this.assignMessagesForMetaDescription();
        this.assignMessagesForKeywordInHeadings();
        this.assignMessagesForSubKeywordsInHeadings();
        this.assignMessagesForHeadings();
        return this.messages;
    }

    /**
     * Calculates the density of a keyword in the given string of body text.
     * @param keyword Should not be null.
     * @param bodyText If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     */
    calculateDensity(keyword: string, bodyText: string | null = null): number {
        bodyText = bodyText ?? this.htmlAnalyzer.bodyText;
        return (this.countOccurrencesInString(keyword, bodyText) / this.htmlAnalyzer.getWordCount(bodyText)) * 100;
    }


    /**
     * Returns the number of occurrences of a keyword in a string. Or you can say, it returns the keyword count in the given string.
     * @param keyword If null, it will use the default value, i.e. `this.content.keyword`
     * @param stringContent If null, it will use the default value, i.e. `this.htmlAnalyzer.bodyText`
     * @return number The number of occurrences of the keyword in the string.
     */
    countOccurrencesInString(keyword: string | null = null, stringContent: string | null = null): number {
        keyword = keyword ?? this.content.keyword
        stringContent = stringContent ?? this.htmlAnalyzer.bodyText
        return stringContent.split(keyword).length - 1; // -1 because the split function will always return one more than the actual occurrences
    }

}

