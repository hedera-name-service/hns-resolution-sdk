import { DefaultName } from "./types/DefaultName";
import { DomainInfo } from "./types/DomainInfo";
import { IndexerDomainInfo } from "./types/IndexerTypes";
import { MetadataType } from "./types/Metadata";
import { NameHash } from "./types/NameHash";
import { NetworkType } from "./types/NetworkType";
import { ResolverConfigs } from "./types/ResolverConfigs";
export declare class Resolver {
    private mirrorNode;
    private indexerApi;
    private fallBackResolver;
    networkType: string;
    network: string;
    arkhiaUrl?: string;
    jRpc?: string;
    arkhiaApiValue: string | undefined;
    constructor(networkType: NetworkType, configs?: ResolverConfigs);
    resolveSLD(domain: string): Promise<string | undefined>;
    getDomainInfo(domainOrNameHashOrTxId: NameHash | string): Promise<DomainInfo | undefined>;
    getAllDomainsForAccount(accountId: string): Promise<IndexerDomainInfo[] | Record<string, string>[]>;
    getDomainMetaData(domain: string): Promise<MetadataType>;
    getBlackList(): Promise<DomainInfo[]>;
    getDefaultName(accountId: string): Promise<DefaultName | undefined>;
}
