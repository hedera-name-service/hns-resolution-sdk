import { NameHash } from "../../types/NameHash";
import { NetworkType } from "../../types/NetworkType";
import { ResolverConfigs } from "../../types/ResolverConfigs";
import { MirrorNode } from "../MirrorNode";
export declare class FallBackResolver {
    networkType: string;
    arkhiaUrl: string | undefined;
    jRpc: string;
    arkhiaApiValue: string | undefined;
    mirrorNode: MirrorNode;
    constructor(networkType: NetworkType, configs?: ResolverConfigs);
    fallBackResolveSLD(domain: string): Promise<string>;
    fallBackGetDomainInfo(nameHash: NameHash): Promise<any>;
    fallBackGetAllDomainsForAccount(accountId: string): Promise<Record<string, string>[]>;
    private getAccountInfo;
}
