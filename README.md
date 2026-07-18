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

- Rule-based engine: 22 focused SEO checks, each individually disableable
- Weighted SEO score with a per-rule breakdown, so the number is explainable
- Keyword density, frequency, and placement analysis
- Sub keyword density analysis in content, title, and meta description
- Title and meta description length checks
- Headings structure analysis (single h1, h2/h3 presence, keywords in headings)
- Internal and outbound link analysis, including duplicates
- SEO messages: warnings, minor warnings, and good points
- Fully typed (TypeScript), synchronous, and dependency-light (only cheerio)

## Quick start

```javascript
import { analyzeSeo } from "seord";

const content = {
    title: 'Does Progressive raise your rates after 6 months?',
    htmlText: `
        <h1>Does Progressive Raise Your Rates After 6 Months?</h1>
        <h2>How Are Car Insurance Rates Determined?</h2>
        <p>When it comes to car insurance, finding the right provider matters.
        Progressive is one of the largest insurers and progressive rates depend on
        many factors like driving history, location and coverage level.</p>
        <h3>How to Save Money on Car Insurance</h3>
        <p>You can save money by comparing rates and premiums across providers.
        Visit <a href="/guides/insurance">our insurance guide</a> or
        <a href="https://www.iii.org">the Insurance Information Institute</a>.</p>
    `,
    keyword: 'progressive',
    subKeywords: ['car insurance', 'rates'],
    metaDescription: 'Find out if Progressive raises your rates after 6 months and what factors can impact your insurance premiums. Learn how to save money on car insurance.',
};

const result = analyzeSeo(content, { siteDomainName: 'example.com' });

console.log(`SEO Score: ${result.seoScore}`);
console.log(`Keyword SEO Score: ${result.keywordSeoScore}`);
console.log(`Keyword Density: ${result.keyword.density.toFixed(2)}%`);
console.log(`Keyword Frequency: ${result.keyword.frequency}`);
console.log(`Word Count: ${result.words.total}`);
console.log(`Total Links: ${result.links.total}`);

console.log(`\nWarnings: ${result.messages.warnings.length}`);
result.messages.warnings.forEach((warning) => console.log(`  - ${warning}`));

console.log(`\nGood Points: ${result.messages.goodPoints.length}`);
result.messages.goodPoints.forEach((point) => console.log(`  - ${point}`));

console.log(`\nMinor Warnings: ${result.messages.minorWarnings.length}`);
result.messages.minorWarnings.forEach((minor) => console.log(`  - ${minor}`));
```

Output:

```yaml
SEO Score: 84.18
Keyword SEO Score: 100
Keyword Density: 4.11%
Keyword Frequency: 3
Word Count: 73
Total Links: 2

Warnings: 3
  - Keyword density is too high. It is 4.11%, try decreasing it.
  - The density of sub keyword "car insurance" is too high in the content, i.e. 4.11%.
  - The density of sub keyword "rates" is too high in the content, i.e. 5.48%.

Good Points: 23
  - Good, your content has a keyword "progressive".
  - No keyword overstuffing.
  - Good, your content has sub keywords "car insurance, rates".
  - Title tag is 49 characters long.
  - Keyword density in title is 12.50%, which is good.
  - You have 1 sub keywords in title.
  - Meta description is 151 characters long.
  - Keyword density of meta description is 3.85%, which is good.
  - The density of sub keyword "car insurance" in meta description is 3.85%.
  - The density of sub keyword "rates" in meta description is 3.85%.
  - You have 3 headings.
  - Nice. You have h1 tag, which is essential.
  - Nice. You have h2 tag, which is essential.
  - You have h3 tag, which is good.
  - Keyword "progressive" found in H1 tag "Does Progressive Raise Your Rates After 6 Months?".
  - Sub keyword "rates" found in H1 tag "Does Progressive Raise Your Rates After 6 Months?", which is good.
  - Sub keyword "car insurance" found in H2 tag "How Are Car Insurance Rates Determined?", which is good.
  - Sub keyword "rates" found in H2 tag "How Are Car Insurance Rates Determined?", which is good.
  - Sub keyword "car insurance" found in H3 tag "How to Save Money on Car Insurance", which is good.
  - You have 1 internal links.
  - You have 1 outbound links.
  - No duplicate internal links.
  - No duplicate outbound links.

Minor Warnings: 5
  - Meta description does not start with keyword. It starts with "find out if progress", try starting with keyword. Not starting with keyword is not a big issue, but it is recommended to start with keyword.
  - Keyword "progressive" not found in H2 tag "How Are Car Insurance Rates Determined?".
  - Keyword "progressive" not found in H3 tag "How to Save Money on Car Insurance".
  - Sub keyword "car insurance" not found in H1 tag "Does Progressive Raise Your Rates After 6 Months?".
  - Sub keyword "rates" not found in H3 tag "How to Save Money on Car Insurance".
```

## API

### `analyzeSeo(content, options?)`

Synchronous. Returns a `SeoAnalysisResult`.

#### `content` (required)

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | The page title (the `<title>` tag text) |
| `htmlText` | `string` | The HTML content to analyze |
| `keyword` | `string` | The main keyword to check for |
| `subKeywords` | `string[]` | Secondary keywords (pass `[]` for none) |
| `metaDescription` | `string` | The meta description text |

The input object is never mutated. Matching is case-insensitive.

#### `options` (optional)

| Option | Type | Description |
| --- | --- | --- |
| `siteDomainName` | `string` | Your domain, e.g. `"example.com"`. Absolute links containing it count as internal; without it, only relative links (`/`, `./`, `../`, `#`) count as internal. |
| `rules` | `Record<string, "off">` | Disable individual rules by id, e.g. `{ "heading-h3-presence": "off" }`. Disabled rules produce no messages and are excluded from the score entirely. |

### Rules reference

Every check is a rule with an id and a weight. Failing severity is what the rule reports when the check fails.

| Rule id | Checks | Weight | Failing severity |
| --- | --- | --- | --- |
| `keyword-presence` | A main keyword is provided | 10 | warning |
| `keyword-overstuffing` | Keyword density is not above 5% | 8 | warning |
| `keyword-density` | Keyword density between 0.46% and 1.1% | 10 | warning |
| `sub-keywords-presence` | Sub keywords are provided | 4 | minor |
| `sub-keyword-density` | Each sub keyword density between 0.12% and 0.9% | 6 | warning / minor |
| `title-length` | Title between 40 and 70 characters | 8 | warning |
| `title-keyword` | Main keyword appears in the title | 8 | warning |
| `title-sub-keywords` | At least one sub keyword appears in the title | 4 | minor |
| `meta-description-length` | Meta description between 100 and 160 characters | 8 | warning |
| `meta-description-keyword-density` | Keyword density in meta description between 2% and 5% | 6 | warning |
| `meta-description-starts-with-keyword` | Meta description starts with the keyword | 2 | minor |
| `meta-description-sub-keywords` | Each sub keyword density in meta description between 2% and 5% | 4 | warning / minor |
| `headings-presence` | At least one heading tag exists | 6 | warning |
| `heading-single-h1` | Exactly one h1 tag | 8 | warning |
| `heading-h2-presence` | At least one h2 tag | 4 | warning |
| `heading-h3-presence` | At least one h3 tag | 2 | minor |
| `headings-keyword` | Keyword appears in each heading | 4 | minor |
| `headings-sub-keywords` | Sub keywords appear in each heading | 2 | minor |
| `links-internal-count` | At least one unique internal link per 300 words | 6 | warning |
| `links-outbound-count` | At least one unique outbound link per 400 words | 4 | warning |
| `links-internal-duplicates` | Not more than one duplicate internal link | 2 | minor |
| `links-outbound-duplicates` | Not more than one duplicate outbound link | 2 | minor |

Rules that do not apply are skipped without penalty. For example, sub keyword rules are skipped
when `subKeywords` is empty, and keyword rules are skipped when `keyword` is empty.

### Scoring

`seoScore` is a weighted ratio: each rule that passes earns its full weight, a minor warning earns half,
and a warning earns nothing. The score is earned weight divided by the total weight of all applicable
rules, times 100. Disabled and skipped rules leave the denominator, so turning a rule off never
penalizes (or inflates) your score. Rules that produce several results (one per sub keyword or per
heading) are averaged so their influence never grows with input size.

`keywordSeoScore` is a separate density-based figure (keyword density in content and title, plus sub
keyword presence), capped at 100.

### Result shape

```typescript
interface SeoAnalysisResult {
    seoScore: number;
    keywordSeoScore: number;
    messages: { warnings: string[]; minorWarnings: string[]; goodPoints: string[] };
    rules: Array<{ id: string; status: "good" | "warning" | "minor"; weight: number; message: string }>;
    keyword: { density: number; frequency: number; inTitle: KeywordDensity };
    subKeywords: { density: KeywordDensity[]; inTitle: KeywordDensity[] };
    links: { total: number; internal: LinksGroup; outbound: LinksGroup };
    words: { total: number; title: number };
}

interface KeywordDensity { keyword: string; density: number; position?: number }
interface LinksGroup { all: Link[]; duplicate: Link[]; unique: Link[] }
interface Link { text: string; href: string }
```

> You do not need TypeScript to use this library. The above is just to show the data structure.

## Migrating from 0.0.x

Version 1.0.0 is a clean break from the `SeoCheck` class API:

- `new SeoCheck(contentJson, domain)` + `await seoCheck.analyzeSeo()` becomes
  `analyzeSeo(content, { siteDomainName: domain })`. The call is synchronous; drop the `await`.
- `strictMode` is gone. The old non-strict default treated your `<title>` as an extra `<h1>`, which
  produced a false "more than one h1 tag" warning on pages with exactly one real h1 (issue #4).
  The title is now never counted as a heading; title checks are their own rules.
- `languageCode` and `countryCode` are no longer accepted; they were never used.
- `titleSEO.keywordWithTitle` is now `keyword.inTitle`, `titleSEO.subKeywordsWithTitle` is
  `subKeywords.inTitle`, `titleSEO.wordCount` is `words.title`, `wordCount` is `words.total`,
  `keywordDensity` is `keyword.density`, `keywordFrequency` is `keyword.frequency`,
  `subKeywordDensity` is `subKeywords.density`, and `totalLinks`/`internalLinks`/`outboundLinks`
  live under `links`.
- `seoScore` is now weighted (see Scoring above), so the number will differ from 0.0.x for the
  same content. `messages` keeps the same three-bucket shape.

## Issue Reporting

If you have [found a bug](https://github.com/Bishwas-py/seord/issues) or if you have a feature request, please report them at this repository issues section.

## Contributing

Contributions are welcome, and they are greatly appreciated! Every little bit helps, and credit will always be given.

## License

This project is licensed under the MIT license. Please see the [LICENSE](LICENSE) file for more information.

Please note that this library is not affiliated with Google or any other search engine.
> It does not guarantee the SEO score calculated by this library will be the same as the SEO score
> calculated by Google or any other search engine.
