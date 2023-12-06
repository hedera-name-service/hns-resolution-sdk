import { NetworkType } from "../types/NetworkType";

enum NetworkBaseURL {
    hedera_test = `https://testnet.mirrornode.hedera.com`,
    hedera_main = `https://mainnet-public.mirrornode.hedera.com`,
}
export const getMirrorNodeUrl = (networkType: NetworkType, arkhiaUrl?: string) => {
    if ((networkType === `arkhia_test` || networkType === `arkhia_main`) && !arkhiaUrl) {
        throw new Error(`Input arkhia url ${networkType}`);
    }
    switch (networkType) {
        case `hedera_test`:
            return NetworkBaseURL.hedera_test;
        case `hedera_main`:
            return NetworkBaseURL.hedera_main;
        case `arkhia_test`:
            return arkhiaUrl;
        case `arkhia_main`:
            return arkhiaUrl;
        default:
            throw new Error(`No base URL available for NetworkType`);
    }
};
