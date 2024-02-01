import { JsonRpcService } from "./JsonRpcService";
export declare class HNSContractService extends JsonRpcService {
    getMaxRecords(): Promise<number>;
}
