interface Link { text: string, href: string }
interface LinksGroup { all: Link[], duplicate: Link[], unique: Link[] }
interface KeywordDensity { keyword: string, density: number }
interface ContentJson {
    question: string,
    keyword: string,
    subKeywords: string[],
    htmlText: string,
    metaDescription: string,
    languageCode: string,
    countryCode: string
}

export {
    Link,
    LinksGroup,
    KeywordDensity,
    ContentJson
}