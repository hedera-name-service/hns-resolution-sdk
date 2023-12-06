import { AxiosResponse } from "axios";
import { DOMAIN_EP_MAIN } from "../environmentsVariable/environmentsVariable";
import { DomainInfo } from "../types/DomainInfo";
import { NetworkType } from "../types/NetworkType";
import { sendAxiosGetRequest } from "../util/axiosCall";

export class Indexer {
    url: string;
    network: string;
    constructor(networkType: NetworkType) {
        this.url = DOMAIN_EP_MAIN;
        this.network =
            networkType === `arkhia_test` || networkType === `hedera_test` ? `testnet` : `mainnet`;
    }
    async getIndexerStatus() {
        const res = await sendAxiosGetRequest(`${this.url}`);
        return res.data === `OK`;
    }
    async getDomainInfo(sld: string): Promise<AxiosResponse<DomainInfo>> {
        const res = await sendAxiosGetRequest(`${this.url}/${this.network}/domains?domain=${sld}`);
        return res;
    }
}
