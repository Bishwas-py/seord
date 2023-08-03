# SEO Analyzer - SEOrd

SEOrd `(pronounced "sword")` is an advanced content SEO Analyzer library that allows you to perform a rapid SEO analysis
on your rich text-ed content. SEOrd helps check the SEO friendliness of a website by looking at different factors such
as keyword density, meta description, and link analysis `(internal and external link)`.

I created this library because I had a hard time finding a good SEO analyzer library that can be used
in `Node.js`. I hope this library will help you as well.

> **Note:** This library analyzes the SEO of the given content on the basis of the standard on-page SEO rules.
> This library is just a tool to help you improve your SEO score or use it as a reference or a supplement to
> your webapps.

## Install

```
npm i seord
```

## Features

- Keyword Density and Frequency Analysis
- Sub Keywords Density Analysis
- SEO Messages: Get warnings and good points related to SEO.
- Checks for Internal and Outbound Links
- Checks for Duplicate Links and Unique Links; both Internal and Outbound
- Checks for Keyword Placement within a given question
- SEO Score Analysis
- Keyword SEO Score
- Word Count Analysis
- Checks for meta description length, placement, keyword density, and keyword frequency 

## Usage

First, require the library at the top of your file like so:

```javascript
import {SeoCheck} from "seord";
```

Next, you will need to set up the ContentJson and domain name before performing an 
SEO analysis. Here's an example:

```javascript
import {SeoCheck} from "seord";
const htmlContent = `<h1>Does Progressive Raise Your Rates After 6 Months?</h1><p>When it comes to car insurance, 
finding the right provider...
`
const contentJson = {
    title: 'Does Progressive raise your rates after 6 months?',
    htmlText: htmlContent,
    keyword: 'progressive',
    subKeywords: ['car insurance', 'rates', 'premiums', 'save money', 'US'],
    metaDescription: 'Find out if Progressive raises your rates after 6 months and what factors can impact your insurance premiums. Learn how to save money on car insurance in the US.',
    languageCode: 'en',
    countryCode: 'us'
};

// Initialize SeoCheck with html content, main keyword and sub keywords
const seoCheck = new SeoCheck(contentJson, 'liveinabroad.com');

// Perform analysis
const result = seoCheck.analyzeSeo();
// Print the result
console.log(`Warnings: ${result.messages.warnings.length}`);
result.messages.warnings.forEach((warning) => {
    console.log(`  - ${warning}`);
});

console.log(`\nGood Points: ${result.messages.goodPoints.length}`);
result.messages.goodPoints.forEach((error) => {
    console.log(`  - ${error}`);
});

console.log(`\nMinor Warnings: ${result.messages.minorWarnings.length}`);
result.messages.minorWarnings.forEach((error) => {
    console.log(`  - ${error}`);
});

console.log("\nSEO Score: " + result.seoScore);
console.log(`Keyword SEO Score: ${result.keywordSeoScore}`);
console.log(`Keyword Density: ${result.keywordDensity}`);
console.log(`Sub Keyword Density: ${result.subKeywordDensity.map((subKeywordDensity) => {
    return `(${subKeywordDensity.keyword} ${subKeywordDensity.density})`;
})}`);
console.log(`Keyword Frequency: ${result.keywordFrequency}`);
console.log(`Word Count: ${result.wordCount}`);
console.log(`Total Links: ${result.totalLinks}`);
```

I am using the `readFile` function from the `fs` module to read the HTML content from a file.
You can use any method to get the HTML content, or you can just pass the HTML content directly
as `string`.

The result of the above example will be:
```text
Warnings: 7
  - The density of sub keyword "car insurance" is too high in the content, i.e. 2.34%.
  - The density of sub keyword "rates" is too high in the content, i.e. 4.28%.
  - The density of sub keyword "premiums" is too high in the content, i.e. 1.38%.
  - The density of sub keyword "us" is too high in the content, i.e. 1.38%.
  - Not enough internal links. You only have 1 unique internal links, try increasing it.
  - Not enough outbound links. You only have 0, try increasing it.
  - Meta description is too long. It is 161 characters long, try reducing it.

Good Points: 14
  - Good, your content has a keyword "progressive".
  - Keyword density is 1.52%.
  - Good, your content has sub keywords "car insurance, rates, premiums, save money, us".
  - The density of sub keyword "save money" is 0.55% in the content, which is good.
  - Title tag is 49 characters long.
  - Keyword density in title is 12.50%, which is good.
  - You have 5 sub keywords in title.
  - No duplicate internal links.
  - No duplicate outbound links.
  - The density of sub keyword "car insurance" in meta description is 3.45%.
  - The density of sub keyword "rates" in meta description is 3.45%.
  - The density of sub keyword "premiums" in meta description is 3.45%.
  - The density of sub keyword "save money" in meta description is 3.45%.
  - The density of sub keyword "us" in meta description is 3.45%.

Minor Warnings: 1
  - Meta description does not start with keyword. It starts with "find out if progress", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.

SEO Score: 66.66666666666666
Keyword SEO Score: 100
Keyword Density: 1.5172413793103448
Sub Keyword Density: (car insurance 2.344827586206897),(rates 4.275862068965517),(premiums 1.3793103448275863),(save money 0.5517241379310345),(us 1.3793103448275863)
Keyword Frequency: 11
Word Count: 725
Total Links: 1
```

The data returned by the `analyzeSeo` function is in the following format:

```typescript
import type {KeywordDensity, LinksGroup} from "seord";

interface SeoData {
    seoScore: number,
    wordCount: number,
    keywordSeoScore: number,
    keywordFrequency: number,
    messages: { warnings: string[], goodPoints: string[], minorWarnings: string[] },
    keywordDensity: number,
    subKeywordDensity: KeywordDensity[],
    totalLinks: number,
    internalLinks: LinksGroup,
    outboundLinks: LinksGroup,
    titleSEO: {
        subKeywordsWithTitle: KeywordDensity[],
        keywordWithTitle: KeywordDensity,
        wordCount: number
    }
}
```
> You do not need TypeScript to use this library. The above is just to show the data structure.

## Issue Reporting

If you have [found a bug](https://github.com/Bishwas-py/seord/issues) or if you have a feature request, please report them at this repository issues section.

## Contributing

Contributions are welcome, and they are greatly appreciated! Every little bit helps, and credit will always be given.

## License

This project is licensed under the MIT license. Please see the [LICENSE](LICENSE) file for more information.

> **Note:** This library is still in development. I will be adding more features in the future.
> If you have any suggestions, please let me know.

Please note that this library is not affiliated with Google or any other search engine.
> It does not guarantee the SEO score calculated by this library will be the same as the SEO score
> calculated by Google or any other search engine.
