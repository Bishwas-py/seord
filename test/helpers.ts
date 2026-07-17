import { AnalysisContext } from "../src/context";
import type { ContentInput } from "../src/types";

export function makeContext(overrides: Partial<ContentInput> = {}, siteDomainName: string | null = null) {
    return new AnalysisContext(
        {
            title: "does progressive raise your rates after 6 months?",
            htmlText:
                "<h1>Progressive rates</h1><h2>More</h2><h3>Deep</h3><p>progressive rates and more words here to dilute density a bit</p>",
            keyword: "progressive",
            subKeywords: ["rates"],
            metaDescription:
                "find out if progressive raises your rates after six months and what factors can impact your insurance premiums overall",
            ...overrides,
        },
        siteDomainName,
    );
}
