import { NameHash } from "../types/NameHash";
import { NetworkType } from "../types/NetworkType";
import { ResolverConfigs } from "../types/ResolverConfigs";
export declare class MirrorNode {
    baseUrl: string | undefined;
    header: Record<string, string>;
    topicId: string;
    tldNames: string[];
    constructor(networkType: NetworkType, configs?: ResolverConfigs);
    getTxInfo(txId: string): Promise<any>;
    getNFT(tokenId: string, serial: string): Promise<any>;
    getContractEvmAddress(contractId: string): Promise<any>;
    getTopicMessage(nameHash?: NameHash): Promise<any>;
    getAllUserHNSNfts(topicMessages: any, accountId: string): Promise<any[]>;
    getNftTopicMessages(topicMessages: Record<string, string>[], userNftLists: Record<string, string>[]): Promise<Record<string, string>[]>;
    getNftInfoTopicMessage(topicMessages: string, nftInfo: Record<string, string>): Promise<Record<string, string>[]>;
    private nextApiCall;
    private nextApiCallTopics;
}
