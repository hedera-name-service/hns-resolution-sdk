import { JsonRpcService } from "./JsonRpcService";

export class HNSContractService extends JsonRpcService {
    async getMaxRecords() {
        const nodes = await this.contract.getNodes();
        return Number(nodes);
    }
}
