const SeoCheck = require('./seo-check');
const fs = require('fs');

fs.readFile('test.html', 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    // Initialize SeoCheck with html content, main keyword and sub keywords
    const seoCheck = new SeoCheck(
        `${data}`,
        'Progressive Insurance',
        ['auto insurance', 'turning 25', 'insurance discounts']
    );
    seoCheck.siteDomainName = 'liveinabroad.com';

    // Perform analysis
    const result = seoCheck.analyzeSeo();

    // Print the result
    console.log(result);
})