import keccak256 from "keccak256";
import { NameHash } from "../types/NameHash";

export const generateNameHash = (domain: string): NameHash => {
    if (!domain) {
        return {
            domain,
            tldHash: Buffer.from([0x0]),
            sldHash: Buffer.from([0x0]),
        };
    }
    const domainsList = domain.split(`.`).reverse();
    const tld = domainsList[0];
    let sld;
    if (domainsList.length > 1) {
        sld = domainsList.slice(0, 2);
    }

    let tldHash = Buffer.from([0x0]);
    let sldHash = Buffer.from([0x0]);

    if (tld) {
        tldHash = keccak256(tld);
    }
    if (sld) {
        sldHash = sld.reduce((prev, curr) => keccak256(prev + curr), Buffer.from(``));
    }

    return { domain, tldHash, sldHash };
};
