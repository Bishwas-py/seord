## README.md

# SEO Analyzer - SEOrd

SEOrd (pronounced "sword") is an advanced SEO Analyzer library that allows you to perform an SEO analysis on HTML content. SEOrd helps check the SEO friendliness of a website by looking at different factors such as keyword density, meta tags, and link analysis.

## Install

```
npm i SEOrd
```

## Features

- Keyword Density Analysis
- Sub Keywords Density Analysis
- SEO Messages: Get warnings and good points related to SEO.
- Checks for Internal and Outbound Links
- Checks for Duplicate Links
- Checks for Keyword Placement within a given question
- SEO Score Analysis


## Usage

First, require the library at the top of your file like so:

```javascript
import {SeoCheck} from "SEOrd";
```

Next, you will need to set up the ContentJson and domain name before performing an SEO analysis. Here's an example:

```javascript
import {readFile} from 'fs';
import {SeoCheck} from "SEOrd";

readFile('test.html', 'utf8' , (err, htmlContent) => {
    if (err) {
        console.error(err)
        return
    }

    // Initialize SeoCheck with html content, main keyword and sub keywords
    const seoCheck = new SeoCheck(
        {
            question: 'What\'s the best insurance cover to get?',
            htmlText: htmlContent,
            keyword: 'best insurance cover',
            subKeywords: ['types of insurance', 'insurance coverage', 'insurance options'],
            metaDescription: 'Discover the best insurance cover to protect yourself and your loved ones. Explore different types of insurance and find the right coverage for your needs.',
            languageCode: 'en',
            countryCode: 'us'
        },
        'liveinabroad.com'
    );


    // Perform analysis
    const result = seoCheck.analyzeSeo();
    // Print the result
    console.log("Warnings: " + result.messages.warnings.length);
    result.messages.warnings.forEach((warning) => {
        console.log('  - ' + warning);
    });

    console.log("\nGood Points: " + result.messages.goodPoints.length);
    result.messages.goodPoints.forEach((error) => {
        console.log('  - ' + error);
    });

    console.log("\nSEO Score: " + result.seoScore);
    console.log("Keyword SEO Score: " + result.keywordSeoScore);
})
```

Result will be:
```text
Warnings: 3
  - The density of sub keyword "insurance options" is too low, i.e. 0.08%.
  - Not enough internal links. You only have 0 unique internal links, try increasing it.
  - Not enough outbound links. You only have 0, try increasing it.

Good Points: 9
  - Your main keyword is "best insurance cover".
  - Your sub keywords are "types of insurance", "insurance coverage", "insurance options".
  - Keyword density is 0.62%.
  - The density of sub keyword "types of insurance" is 0.47%.
  - The density of sub keyword "insurance coverage" is 0.62%.
  - You have your main keyword in question.
  - You have 3 sub keywords in question.
  - No duplicate internal links.
  - No duplicate outbound links.

SEO Score: 75
Keyword SEO Score: 100
```

Data returned: 
```typescript
interface DataReturned {
    seoScore: number,
    keywordSeoScore: number,
    messages: { warnings: string[], goodPoints: string[] },
    keywordDensity: number,
    subKeywordDensity: KeywordDensity[],
    totalLinks: number,
    internalLinks: LinksGroup,
    outboundLinks: LinksGroup,
    questionSEO: {}
}
```
> You do not need TypeScript to use this library. I'm just making the format of data to be returned in this format.

When you run the above example SEOrd will analyze the HTML content, providing you with an SEO score and detailed information about various aspects of the content's SEO.

## Issue Reporting

If you have [found a bug](https://github.com/Bishwas-py/seord/issues) or if you have a feature request, please report them at this repository issues section.

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.

## License

This project is licensed under the MIT license. Please see the [LICENSE](LICENSE) file for more information.