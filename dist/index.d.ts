import { FallBackResolver } from "./helpers/FallbackLogic/FallBackResolver";
import { Indexer } from "./helpers/IndexerAPI";
import { MirrorNode } from "./helpers/MirrorNode";
import { NameHash } from "./types/NameHash";
import { NetworkType } from "./types/NetworkType";
import { ResolverConfigs } from "./types/ResolverConfigs";
export declare class Resolver {
    networkType: string;
    arkhiaUrl: string | undefined;
    jRpc: string;
    arkhiaApiValue: string | undefined;
    mirrorNode: MirrorNode;
    indexerApi: Indexer;
    network: string;
    fallBackResolver: FallBackResolver;
    constructor(networkType: NetworkType, configs?: ResolverConfigs);
    resolveSLD(domain: string): Promise<any>;
    getDomainInfo(domainOrNameHashOrTxId: string | NameHash): Promise<any>;
    getAllDomainsForAccount(accountId: string): Promise<Record<string, string>[] | import("./types/DomainInfo").DomainInfo>;
    getBlackList(): Promise<any>;
}
