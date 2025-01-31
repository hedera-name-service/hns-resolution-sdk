import { HNSContractService } from "./HNSContractService";

export class SLDContractService extends HNSContractService {
    async getExpiry(sldHash: any) {
        const expiration = Number(await this.contract.getExpiry(sldHash));
        return expiration;
    }
    async getSerial(sldHash: any) {
        const expiration = await this.contract.getSerial(sldHash);
        return Number(expiration);
    }
}
