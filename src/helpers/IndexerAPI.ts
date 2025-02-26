import axios, { AxiosResponse } from "axios";
import { DOMAIN_EP_MAIN, DOMAIN_EP_TEST } from "../environmentsVariable/environmentsVariable";
import { DefaultName } from "../types/DefaultName";
import { IndexerBlackList, IndexerDomainInfo, IndexerMetaData } from "../types/IndexerTypes";
import { NetworkType } from "../types/NetworkType";
import { sendAxiosGetRequest } from "../util/axiosCall";

export class Indexer {
    url: string;
    network: string;
    constructor(networkType: NetworkType) {
        this.url =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? DOMAIN_EP_TEST
                : DOMAIN_EP_MAIN;
        this.network =
            networkType === `arkhia_test` || networkType === `hedera_test` ? `testnet` : `mainnet`;
    }
    async getIndexerHealth(): Promise<AxiosResponse<{ health: boolean }>> {
        const res = await sendAxiosGetRequest(`${this.url}`);
        return res.data;
    }
    async getDomainInfo(sld: string): Promise<AxiosResponse<IndexerDomainInfo>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/domains?domain=${sld}`);
        return res;
    }
    async getProfileMetaData(domain: string): Promise<AxiosResponse<IndexerMetaData>> {
        const res = await sendAxiosGetRequest(`${this.url}/metadata/info?domain=${domain}`);
        return res;
    }
    async getBlacklistDomains(): Promise<AxiosResponse<IndexerBlackList[]>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/blacklist/all`);
        return res;
    }
    async getAllDomainsAccount(
        accountId: string,
    ): Promise<AxiosResponse<IndexerDomainInfo[] | []>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/account/${accountId}`);
        return res;
    }
    async getDefaultName(accountId: string): Promise<AxiosResponse<DefaultName>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/default-name/${accountId}`);
        return res;
    }
}
