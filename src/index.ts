import { HASHIO_MAINNET, HASHIO_TESTNET } from "./environmentsVariable/environmentsVariable";
import { FallBackResolver } from "./helpers/FallbackLogic/FallBackResolver";
import { Indexer } from "./helpers/IndexerAPI";
import { MirrorNode } from "./helpers/MirrorNode";
import { DefaultName } from "./types/DefaultName";
import { DomainInfo } from "./types/DomainInfo";
import { IndexerDomainInfo } from "./types/IndexerTypes";
import { MetadataType } from "./types/Metadata";
import { NameHash } from "./types/NameHash";
import { NetworkType } from "./types/NetworkType";
import { ResolverConfigs } from "./types/ResolverConfigs";
import { checkDomainOrNameHashOrTxld } from "./util/checkDomainOrNameHashOrTxld";
import { validateDomain } from "./util/validateDomain";

export class Resolver {
    private mirrorNode: MirrorNode;
    private indexerApi: Indexer;
    private fallBackResolver: FallBackResolver;
    networkType: string;
    network: string;
    arkhiaUrl?: string;
    jRpc?: string;
    arkhiaApiValue: string | undefined;
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

    public async resolveSLD(domain: string): Promise<string | undefined> {
        const checkDomain = validateDomain(domain);
        const health = await this.indexerApi.getIndexerHealth();

        if (!checkDomain) {
            throw new Error(`Not a valid domain`);
        }

        if (health) {
            try {
                const res = await this.indexerApi.getDomainInfo(domain);
                const d = new Date(0);
                d.setUTCSeconds(res.data.expiration);
                return await Promise.resolve(new Date() < d ? res.data.account_id : undefined);
            } catch (error) {
                return undefined;
            }
        } else {
            try {
                const fallback = await this.fallBackResolver.fallBackResolveSLD(domain);
                if (fallback) return fallback;
            } catch (error) {
                return undefined;
            }
        }

        throw new Error(`Unable to query`);
    }
    public async getDomainInfo(
        domainOrNameHashOrTxId: NameHash | string,
    ): Promise<DomainInfo | undefined> {
        const nameHash = await checkDomainOrNameHashOrTxld(domainOrNameHashOrTxId, this.mirrorNode);
        const health = await this.indexerApi.getIndexerHealth();
        if (health) {
            try {
                const res = await this.indexerApi.getDomainInfo(nameHash.domain);
                const d = new Date(0);
                d.setUTCSeconds(res.data.expiration);
                const metadata: DomainInfo = {
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
            } catch (error) {
                throw new Error(`Not Found`);
            }
        } else {
            try {
                const fallback: DomainInfo =
                    await this.fallBackResolver.fallBackGetDomainInfo(nameHash);
                if (fallback) return fallback;
            } catch (error) {
                throw new Error(`Not Found`);
            }
        }

        throw new Error(`Unable to query`);
    }
    public async getAllDomainsForAccount(
        accountId: string,
    ): Promise<IndexerDomainInfo[] | Record<string, string>[]> {
        const health = await this.indexerApi.getIndexerHealth();

        try {
            if (health) {
                const domains = await this.indexerApi.getAllDomainsAccount(accountId);
                return domains.data;
            } else {
                const fallback =
                    await this.fallBackResolver.fallBackGetAllDomainsForAccount(accountId);
                if (fallback) return fallback;
            }
        } catch (error) {
            return [];
        }

        throw new Error(`Unable to query`);
    }
    public async getDomainMetaData(domain: string): Promise<MetadataType> {
        try {
            const { data: metadata } = await this.indexerApi.getProfileMetaData(domain);

            const results: MetadataType = {
                domain,
                ...metadata.addresses,
                ...metadata.textRecord,
            };

            return results;
        } catch (error) {
            throw new Error(`Unable to find domain's profile metadata`);
        }
    }
    public async getBlackList(): Promise<DomainInfo[]> {
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
        } catch (error) {
            throw new Error(`Unable to fetch blacklist`);
        }
    }
    public async getDefaultName(accountId: string): Promise<DefaultName | undefined> {
        try {
            const defaultName = await this.indexerApi.getDefaultName(accountId);
            return defaultName.data;
        } catch (error) {
            return undefined;
        }
    }
}
