interface Link { text: string, href: string }
interface LinksGroup { all: Link[], duplicate: Link[], unique: Link[] }
interface KeywordDensity { keyword: string, density: number }
interface ContentJson {
    question: string,
    keyword: string,
    sub_keywords: string[],
    html_text: string,
    meta_description: string,
    language_code: string,
    country_code: string
}

export {
    Link,
    LinksGroup,
    KeywordDensity,
    ContentJson
}