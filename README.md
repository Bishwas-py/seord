# SEO Analyzer - SEOrd

SEOrd `(pronounced "sword")` is an advanced SEO Analyzer library that allows you to perform an SEO analysis
on HTML content. SEOrd helps check the SEO friendliness of a website by looking at different factors such
as keyword density, meta description, and link analysis `(internal and external link)`.

I created this library because I had a hard time finding a good SEO analyzer library that can be used
in `Node.js`. I hope this library will help you as well.

## Install

```
npm i seord
```

## Features

- Keyword Density Analysis
- Sub Keywords Density Analysis
- SEO Messages: Get warnings and good points related to SEO.
- Checks for Internal and Outbound Links
- Checks for Duplicate Links and Unique Links; both Internal and Outbound
- Checks for Keyword Placement within a given question
- SEO Score Analysis
- Key SEO Score Analysis

## Usage

First, require the library at the top of your file like so:

```javascript
import {SeoCheck} from "seord";
```

Next, you will need to set up the ContentJson and domain name before performing an 
SEO analysis. Here's an example:

```javascript
import {SeoCheck} from "seord";
import {readFile} from 'fs'; // Only for this example

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

I am using the `readFile` function from the `fs` module to read the HTML content from a file.
You can use any method to get the HTML content, or you can just pass the HTML content directly
as `string`.

The result of the above example will be:
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

The data returned by the `analyzeSeo` function is in the following format:

```typescript
import type {KeywordDensity, LinksGroup} from "seord";

interface SeoData {
    seoScore: number,
    keywordSeoScore: number,
    messages: { warnings: string[], goodPoints: string[] },
    keywordDensity: number,
    subKeywordDensity: KeywordDensity[],
    totalLinks: number,
    internalLinks: LinksGroup,
    outboundLinks: LinksGroup,
    questionSEO: {
        subKeywordsWithQuestion: KeywordDensity[],
        keywordWithQuestion: KeywordDensity
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