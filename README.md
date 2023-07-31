## README.md

# SEO Analyzer - Seord

Seord (pronounced "sword") is an advanced SEO Analyzer library that allows you to perform an SEO analysis on HTML content. Seord helps check the SEO friendliness of a website by looking at different factors such as keyword density, meta tags, and link analysis.

## Install

```
npm i seord
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
const SeoCheck = require('seord'); // Import SEOrd
```

Next, you will need to set up the ContentJson and domain name before performing an SEO analysis. Here's an example:

```javascript
const SeoCheck = require('seord');
const fs = require('fs');

fs.readFile('test.html', 'utf8' , (err, htmlContent) => {
    if (err) {
        console.error(err)
        return
    }

    // Initialize SeoCheck with html content, main keyword and sub keywords
    const seoCheck = new SeoCheck(
        {
            question: 'Are dark or light cigars better?',
            html_text: htmlContent,
            keyword: 'cigars',
            sub_keywords: ['turning 25', 'light cigars'],
            meta_description: 'A comprehensive guide on choosing between dark and light cigars, highlighting the differences and helping readers make an informed decision.',
            meta_title: 'Dark vs Light Cigars: A Comprehensive Guide',
            language_code: 'en',
            country_code: 'us'
        },
        'cigarsniper.com'
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
})
```

When you run the above example Seord will analyze the HTML content, providing you with an SEO score and detailed information about various aspects of the content's SEO.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section.

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.

## License

This project is licensed under the MIT license. Please see the [LICENSE](LICENSE) file for more information.