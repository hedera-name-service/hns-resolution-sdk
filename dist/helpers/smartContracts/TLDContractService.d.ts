import { HNSContractService } from "./HNSContractService";
export declare class TLDContractService extends HNSContractService {
    getNodes(): Promise<any>;
    getNumNodes(): Promise<number>;
    getSLDNode(sldHash: string, start: unknown, stop: unknown): Promise<any>;
}
