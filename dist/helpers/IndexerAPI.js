"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexer = void 0;
const environmentsVariable_1 = require("../environmentsVariable/environmentsVariable");
const axiosCall_1 = require("../util/axiosCall");
class Indexer {
    constructor(networkType) {
        this.url =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? environmentsVariable_1.DOMAIN_EP_TEST
                : environmentsVariable_1.DOMAIN_EP_MAIN;
        this.network =
            networkType === `arkhia_test` || networkType === `hedera_test` ? `testnet` : `mainnet`;
    }
    async getIndexerHealth() {
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(`${this.url}`);
        return res.data;
    }
    async getDomainInfo(sld) {
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(`${this.url}/slds/domains?domain=${sld}`);
        return res;
    }
    async getProfileMetaData(domain) {
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(`${this.url}/metadata/info?domain=${domain}`);
        return res;
    }
    async getBlacklistDomains() {
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(`${this.url}/slds/blacklist/all`);
        return res;
    }
    async getAllDomainsAccount(accountId) {
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(`${this.url}/slds/account/${accountId}`);
        return res;
    }
}
exports.Indexer = Indexer;
