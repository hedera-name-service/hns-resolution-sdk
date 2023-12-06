import { HASHIO_MAINNET, HASHIO_TESTNET } from "./environmentsVariable/environmentsVariable";
import { FallBackResolver } from "./helpers/FallbackLogic/FallBackResolver";
import { Indexer } from "./helpers/IndexerAPI";
import { MirrorNode } from "./helpers/MirrorNode";
import { NameHash } from "./types/NameHash";
import { NetworkType } from "./types/NetworkType";
import { ResolverConfigs } from "./types/ResolverConfigs";
import { checkDomainOrNameHashOrTxld } from "./util/checkDomainOrNameHashOrTxld";

export class Resolver {
    networkType: string;
    arkhiaUrl: string | undefined;
    jRpc: string;
    arkhiaApiValue: string | undefined;
    mirrorNode: MirrorNode;
    indexerApi: Indexer;
    network: string;
    fallBackResolver: FallBackResolver;
    constructor(networkType: NetworkType, configs?: ResolverConfigs) {
        this.networkType = networkType;
        this.network = //This is temporary until testnet is set up on the indexer
            networkType === `arkhia_test` || networkType === `hedera_test` ? `testnet` : `mainnet`;
        this.arkhiaUrl = configs?.arkhiaUrl;
        this.jRpc =
            configs?.jRpc ||
            (networkType === `arkhia_test` || networkType === `hedera_test`
                ? HASHIO_TESTNET
                : HASHIO_MAINNET);
        this.arkhiaApiValue = configs?.arkhiaApiValue;
        this.mirrorNode = new MirrorNode(networkType, configs);
        this.indexerApi = new Indexer(networkType);
        this.fallBackResolver = new FallBackResolver(networkType, configs);
    }

    public async resolveSLD(domain: string) {
        const checkIndexer = await this.indexerApi.getIndexerStatus();
        if (this.network === `testnet` || !checkIndexer) {
            return await this.fallBackResolver.fallBackResolveSLD(domain);
        }
        if (checkIndexer) {
            try {
                const res = await this.indexerApi.getDomainInfo(domain);
                const d = new Date(0);
                d.setUTCSeconds(res.data.expiration);
                return await Promise.resolve(new Date() < d ? res.data.account_id : ``);
            } catch (error) {
                throw new Error(`${domain} has no existing user`);
            }
        }
    }
    public async getDomainInfo(domainOrNameHashOrTxId: string | NameHash) {
        const nameHash = await checkDomainOrNameHashOrTxld(domainOrNameHashOrTxId, this.mirrorNode);
        const checkIndexer = await this.indexerApi.getIndexerStatus();
        if (this.network === `testnet` || !checkIndexer) {
            return await this.fallBackResolver.fallBackGetDomainInfo(nameHash);
        }
        if (checkIndexer) {
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
                    expiration: new Date() < d ? res.data.expiration * 1000 : null,
                    provider: res.data.provider,
                    providerData: {
                        contractId: res.data.contract_id,
                    },
                    accountId: new Date() < d ? res.data.account_id : ``,
                };

                return metadata;
            } catch (error) {
                throw new Error(`${nameHash.domain} has no existing user`);
            }
        }
    }
    public async getAllDomainsForAccount(accountId: string) {
        // const checkIndexer = await this.indexerApi.getIndexerStatus();
        // if (this.network === `testnet` || !checkIndexer) {
        return await this.fallBackResolver.fallBackGetAllDomainsForAccount(accountId);
        // }
    }
}
