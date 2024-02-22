"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const environmentsVariable_1 = require("./environmentsVariable/environmentsVariable");
const FallBackResolver_1 = require("./helpers/FallbackLogic/FallBackResolver");
const IndexerAPI_1 = require("./helpers/IndexerAPI");
const MirrorNode_1 = require("./helpers/MirrorNode");
const checkDomainOrNameHashOrTxld_1 = require("./util/checkDomainOrNameHashOrTxld");
class Resolver {
    constructor(networkType, configs) {
        this.networkType = networkType;
        this.network = //This is temporary until testnet is set up on the indexer
            networkType === `arkhia_test` || networkType === `hedera_test` ? `testnet` : `mainnet`;
        this.arkhiaUrl = configs === null || configs === void 0 ? void 0 : configs.arkhiaUrl;
        this.jRpc =
            (configs === null || configs === void 0 ? void 0 : configs.jRpc) ||
                (networkType === `arkhia_test` || networkType === `hedera_test`
                    ? environmentsVariable_1.HASHIO_TESTNET
                    : environmentsVariable_1.HASHIO_MAINNET);
        this.arkhiaApiValue = configs === null || configs === void 0 ? void 0 : configs.arkhiaApiValue;
        this.mirrorNode = new MirrorNode_1.MirrorNode(networkType, configs);
        this.indexerApi = new IndexerAPI_1.Indexer(networkType);
        this.fallBackResolver = new FallBackResolver_1.FallBackResolver(networkType, configs);
    }
    async resolveSLD(domain) {
        try {
            const res = await this.indexerApi.getDomainInfo(domain);
            const d = new Date(0);
            d.setUTCSeconds(res.data.expiration);
            return await Promise.resolve(new Date() < d ? res.data.account_id : ``);
        }
        catch (error) {
            const fallback = await this.fallBackResolver.fallBackResolveSLD(domain);
            if (fallback)
                return fallback;
            throw new Error(`${domain} has no existing user`);
        }
    }
    async getDomainInfo(domainOrNameHashOrTxId) {
        const nameHash = await (0, checkDomainOrNameHashOrTxld_1.checkDomainOrNameHashOrTxld)(domainOrNameHashOrTxId, this.mirrorNode);
        try {
            const res = await this.indexerApi.getDomainInfo(nameHash.domain);
            const d = new Date(0);
            d.setUTCSeconds(res.data.expiration);
            const metadata = {
                transactionId: res.data.paymenttransaction_id.split(`@`)[1],
                nameHash: {
                    domain: res.data.domain,
                    tldHash: res.data.tld_hash,
                    sldHash: res.data.sld_hash,
                },
                nftId: `${res.data.token_id}:${res.data.nft_id}`,
                expiration: new Date() < d ? res.data.expiration : null,
                provider: res.data.provider,
                providerData: {
                    contractId: res.data.contract_id,
                },
                accountId: new Date() < d ? res.data.account_id : ``,
            };
            return metadata;
        }
        catch (error) {
            console.log(error);
            const fallback = await this.fallBackResolver.fallBackGetDomainInfo(nameHash);
            if (fallback)
                return fallback;
            throw new Error(`${nameHash.domain} has no existing user`);
        }
    }
    async getAllDomainsForAccount(accountId) {
        try {
            const domains = await this.indexerApi.getAllDomainsAccount(accountId);
            return domains.data;
        }
        catch (error) {
            const fallback = await this.fallBackResolver.fallBackGetAllDomainsForAccount(accountId);
            if (fallback)
                return fallback;
            throw new Error(`User doesn't have domains`);
        }
    }
    async getBlackList() {
        try {
            const domains = await this.indexerApi.getBlacklistDomains();
            const payload = domains.data.map((i) => {
                return {
                    transactionId: i.paymentTransactionId.split(`@`)[1],
                    nameHash: {
                        domain: i.sld,
                        tldHash: i.tldHash,
                        sldHash: i.sldHash,
                    },
                    nftId: i.sldNftId,
                    expiration: new Date(i.nft.expiration).getTime(),
                    provider: i.provider,
                    providerData: {
                        contractId: i.contractId,
                    },
                    accountId: i.nft.ownerAccountId,
                };
            });
            return payload;
        }
        catch (error) {
            console.log(error);
            throw new Error(`Unable to fetch blacklist`);
        }
    }
}
exports.Resolver = Resolver;
