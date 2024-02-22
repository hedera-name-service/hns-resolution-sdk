import { AxiosResponse } from "axios";
import { DomainInfo } from "../types/DomainInfo";
import { NetworkType } from "../types/NetworkType";
export declare class Indexer {
    url: string;
    network: string;
    constructor(networkType: NetworkType);
    getDomainInfo(sld: string): Promise<AxiosResponse<DomainInfo>>;
    getBlacklistDomains(): Promise<AxiosResponse>;
    getAllDomainsAccount(accountId: string, page?: number, limit?: number): Promise<AxiosResponse<DomainInfo>>;
}
