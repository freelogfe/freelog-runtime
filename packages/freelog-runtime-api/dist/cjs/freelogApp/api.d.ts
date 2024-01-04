export declare function getExhibitListById(query: any): Promise<any>;
export declare function getExhibitListByPaging(query: any): Promise<any>;
export declare function getSignStatistics(query: any): Promise<any>;
export declare function getExhibitInfo(exhibitId: string, query: any): Promise<any>;
export declare function getExhibitDepInfo(exhibitId: string, articleNids: string): Promise<any>;
export declare function getExhibitSignCount(exhibitId: string): Promise<any>;
export declare function getExhibitAvailalbe(exhibitIds: string): Promise<any>;
export declare function getExhibitAuthStatus(exhibitIds: string): Promise<any>;
export declare function getExhibitFileStream(exhibitId: string | number, options: {
    returnUrl?: boolean;
    config?: any;
    subFilePath?: string;
}, config?: any): Promise<any>;
export declare function getExhibitResultByAuth(exhibitId: string | number): Promise<any>;
export declare function getExhibitInfoByAuth(exhibitId: string | number): Promise<any>;
export declare function getExhibitDepTree(exhibitId: string | number, options: {
    version?: string;
    nid?: string;
    maxDeep?: number;
    isContainRootNode?: string;
}): Promise<any>;
export declare function getExhibitDepFileStream(exhibitId: string | number, parentNid: string, subArticleId: string, returnUrl?: boolean, config?: any): Promise<any>;
export declare function pushMessage4Task(query: any): Promise<any>;
