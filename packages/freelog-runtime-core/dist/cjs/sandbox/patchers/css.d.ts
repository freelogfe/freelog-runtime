/**
 * @author Saviio
 * @since 2020-4-19
 */
export declare class ScopedCSS {
    private static ModifiedTag;
    private sheet;
    private swapNode;
    private appName;
    constructor(data: any);
    process(styleNode: HTMLStyleElement, prefix?: string): void;
    private rewrite;
    private ruleStyle;
    private ruleMedia;
    private ruleSupport;
}
export declare const FreelogCSSRewriteAttr = "data-freelog";
export declare const process: (appWrapper: HTMLElement, stylesheetElement: HTMLStyleElement | HTMLLinkElement, appName: string) => void;
