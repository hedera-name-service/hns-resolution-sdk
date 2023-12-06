import { HNSContractService } from "./HNSContractService";

export class TLDContractService extends HNSContractService {
    async getNodes() {
        const nodes = await this.contract.methods.getNodes().call();
        return nodes;
    }
    async getNumNodes() {
        const nodeNumber = await this.contract.methods.getNumNodes().call();
        return Number(nodeNumber);
    }
    async getSLDNode(sldHash: string, start: unknown, stop: unknown) {
        const node = await this.contract.methods.getSerial(sldHash, start, stop).call();
        return node;
    }
}
