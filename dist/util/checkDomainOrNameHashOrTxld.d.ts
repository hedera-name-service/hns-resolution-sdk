import { MirrorNode } from "../helpers/MirrorNode";
import { NameHash } from "../types/NameHash";
export declare const checkDomainOrNameHashOrTxld: (domainOrNameHashOrTxId: string | NameHash, mirrorNode: MirrorNode) => Promise<NameHash>;
