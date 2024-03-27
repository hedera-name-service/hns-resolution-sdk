import { AxiosResponse } from "axios";
import { IndexerBlackList, IndexerDomainInfo, IndexerMetaData } from "../types/IndexerTypes";
import { NetworkType } from "../types/NetworkType";
export declare class Indexer {
    url: string;
    network: string;
    constructor(networkType: NetworkType);
    getIndexerHealth(): Promise<AxiosResponse<{
        health: boolean;
    }>>;
    getDomainInfo(sld: string): Promise<AxiosResponse<IndexerDomainInfo>>;
    getProfileMetaData(domain: string): Promise<AxiosResponse<IndexerMetaData>>;
    getBlacklistDomains(): Promise<AxiosResponse<IndexerBlackList[]>>;
    getAllDomainsAccount(accountId: string): Promise<AxiosResponse<IndexerDomainInfo[] | []>>;
}
