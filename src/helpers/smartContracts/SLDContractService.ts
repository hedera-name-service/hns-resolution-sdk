import { HNSContractService } from "./HNSContractService";

export class SLDContractService extends HNSContractService {
    async getExpiry(sldHash: any) {
        const expiration = Number(await this.contract.methods.getExpiry(sldHash).call());
        return expiration;
    }
    async getSerial(sldHash: any) {
        const expiration = await this.contract.methods.getSerial(sldHash).call();
        return Number(expiration);
    }
}
