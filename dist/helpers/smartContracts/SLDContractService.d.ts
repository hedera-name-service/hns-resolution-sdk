import { HNSContractService } from "./HNSContractService";
export declare class SLDContractService extends HNSContractService {
    getExpiry(sldHash: any): Promise<number>;
    getSerial(sldHash: any): Promise<number>;
}
