"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMirrorNodeUrl = void 0;
var NetworkBaseURL;
(function (NetworkBaseURL) {
    NetworkBaseURL["hedera_test"] = "https://testnet.mirrornode.hedera.com";
    NetworkBaseURL["hedera_main"] = "https://mainnet-public.mirrornode.hedera.com";
})(NetworkBaseURL || (NetworkBaseURL = {}));
const getMirrorNodeUrl = (networkType, arkhiaUrl) => {
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
exports.getMirrorNodeUrl = getMirrorNodeUrl;
