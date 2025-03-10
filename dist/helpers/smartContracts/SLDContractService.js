"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLDContractService = void 0;
const HNSContractService_1 = require("./HNSContractService");
class SLDContractService extends HNSContractService_1.HNSContractService {
    async getExpiry(sldHash) {
        const expiration = Number(await this.contract.getExpiry(sldHash));
        return expiration;
    }
    async getSerial(sldHash) {
        const expiration = await this.contract.getSerial(sldHash);
        return Number(expiration);
    }
}
exports.SLDContractService = SLDContractService;
