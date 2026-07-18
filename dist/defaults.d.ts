export declare const THRESHOLDS: {
    readonly keyword: {
        readonly minDensity: 0.46;
        readonly maxDensity: 1.1;
        readonly overstuffingDensity: 5;
    };
    readonly subKeyword: {
        readonly minDensity: 0.12;
        readonly maxDensity: 0.9;
        readonly extremeLowDensity: 0.09;
    };
    readonly title: {
        readonly minLength: 40;
        readonly maxLength: 70;
    };
    readonly metaDescription: {
        readonly minLength: 100;
        readonly maxLength: 160;
        readonly minKeywordDensity: 2;
        readonly maxKeywordDensity: 5;
        readonly subKeywordMinDensity: 2;
        readonly subKeywordMaxDensity: 5;
        readonly subKeywordExtremeLowDensity: 0.2;
    };
    readonly links: {
        readonly wordsPerInternalLink: 300;
        readonly wordsPerOutboundLink: 400;
    };
};
