// /**
//  * 展品信息
//  */
// export interface ExhibitInfo {
//     exhibitId: string;
//     exhibitName: string;
//     exhibitTitle: string;
//     exhibitSubjectType: SubjectTypeEnum; // 展品或展品组合
//     tags: string[];
//     coverImages: string[];
//     version: string; // 默认使用的资源版本号
//     status: number; // 备用
//     onlineStatus: number;
//     nodeId: number;
//     userId: number;
//     policies: BasePolicyInfo[];
//     // createDate: Date;
//     // updateDate: Date;
//     articleInfo: MountArticleInfo; // article(作品)指广义上的资源(单品资源,组合资源,节点组合资源)+存储对象
//     versionInfo?: ExhibitVersionInfo;
//     createDate?: Date;
//     updateDate?: Date;
//     contracts?: ContractInfo[];
// }


// /**
//  * 展品挂载的作品信息
//  */
// export interface MountArticleInfo {
//     articleId: string;
//     articleName: string;
//     articleType: ArticleTypeEnum; // 1:独立资源 2:组合资源 3:节点组合资源 4:存储对象
//     articleOwnerId: number;
//     articleOwnerName: string;
//     resourceType: string[];
//     otherInfo?: {
//         [key: string]: any;
//     };
// }

// /**
//  * 展品版本信息
//  */
// export interface ExhibitVersionInfo {
//     exhibitId: string;
//     version: string;
//     articleId: string;
//     articleSystemProperty?: {
//         [key: string]: number | string | boolean | null | object;
//     };
//     articleCustomPropertyDescriptors?: any[];
//     exhibitRewriteProperty?: any[];
//     exhibitProperty?: {
//         [key: string]: number | string | boolean | null | object;
//     };
//     authTree: ExhibitAuthNodeInfo[];
//     dependencyTree: ExhibitDependencyNodeInfo[];
//     // createDate: Date;
//     // updateDate: Date;
// }

// export interface ExhibitAuthNodeInfo {
//     nid: string; // 树节点ID
//     articleId: string;
//     articleName: string;
//     articleType: ArticleTypeEnum;
//     resourceType: string[];
//     version: string;
//     versionId: string;
//     parentNid: string;
//     deep: number;
// }

// export interface ExhibitDependencyNodeInfo {
//     nid: string; // 树节点ID
//     articleId: string;
//     articleName: string;
//     articleType: ArticleTypeEnum;
//     version: string;
//     versionRange: string;
//     resourceType: string[];
//     versionId: string;
//     deep: number;
//     parentNid: string;
// }

// //树节点ID
// export interface ExhibitDependencyTree {
//     nid: string;
//     articleId: string;
//     articleName: string;
//     articleType: ArticleTypeEnum;
//     version: string;
//     versionRange: string;
//     resourceType: string[];
//     versionId: string;
//     deep: number;
//     parentNid: string;
//     dependencies: ExhibitDependencyTree[];
//     // fileSha1: string;
// }