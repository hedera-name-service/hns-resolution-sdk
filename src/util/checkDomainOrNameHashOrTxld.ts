import { MirrorNode } from "../helpers/MirrorNode";
import { NameHash } from "../types/NameHash";
import { formatHederaTxId } from "./formatHederaTxId";
import { generateNameHash } from "./generateNameHash";
import { isNameHash } from "./isNameHash";
import { validateDomain } from "./validateDomain";

export const checkDomainOrNameHashOrTxld = async (
    domainOrNameHashOrTxId: string | NameHash,
    mirrorNode: MirrorNode,
) => {
    if (
        typeof domainOrNameHashOrTxId === `string` &&
        domainOrNameHashOrTxId.match(/[0-9].[0-9].[0-9]{1,7}@[0-9]{1,10}.[0-9]{1,9}/)
    ) {
        const parseTxId = formatHederaTxId(domainOrNameHashOrTxId);
        const domainName = await mirrorNode.getTxInfo(parseTxId);
        return generateNameHash(
            domainName.newDomain || domainName.extendedDomain || domainName.expiredDomain,
        );
    } else if (
        typeof domainOrNameHashOrTxId === `string` &&
        domainOrNameHashOrTxId.match(/\.[thbar]|\.[hbar]|\.[boo]|\.[cream]/)
    ) {
        const checkDomain = validateDomain(domainOrNameHashOrTxId);
        if (!checkDomain) throw new Error(`Invalid Input`);
        return generateNameHash(domainOrNameHashOrTxId);
    } else if (typeof domainOrNameHashOrTxId === `object` && isNameHash(domainOrNameHashOrTxId)) {
        return domainOrNameHashOrTxId;
    } else {
        throw new Error(`Invalid Input`);
    }
};
