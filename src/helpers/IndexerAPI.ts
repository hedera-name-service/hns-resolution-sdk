import { AxiosResponse } from "axios";
import { DOMAIN_EP_MAIN, DOMAIN_EP_TEST } from "../environmentsVariable/environmentsVariable";
import { DomainInfo } from "../types/DomainInfo";
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
    async getDomainInfo(sld: string): Promise<AxiosResponse<DomainInfo>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/domains?domain=${sld}`);
        return res;
    }
    async getProfileMetaData(domain: string): Promise<AxiosResponse> {
        const res = await sendAxiosGetRequest(`${this.url}/metadata/info?domain=${domain}`);
        return res;
    }
    async getBlacklistDomains(): Promise<AxiosResponse> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/blacklist/all`);
        return res;
    }
    async getAllDomainsAccount(
        accountId: string,
        page?: number,
        limit?: number,
    ): Promise<AxiosResponse<DomainInfo>> {
        const res = await sendAxiosGetRequest(`${this.url}/slds/account/${accountId}`);
        return res;
    }
}
