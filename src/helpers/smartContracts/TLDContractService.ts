import { HNSContractService } from "./HNSContractService";

export class TLDContractService extends HNSContractService {
    async getNodes() {
        const nodes = await this.contract.getNodes();
        return nodes;
    }
    async getNumNodes() {
        const nodeNumber = await this.contract.getNumNodes();
        return Number(nodeNumber);
    }
    async getSLDNode(sldHash: string, start: unknown, stop: unknown) {
        const node = await this.contract.getSerial(sldHash, start, stop);
        return node;
    }
}
