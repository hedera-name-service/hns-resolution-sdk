"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLDContractService = void 0;
const HNSContractService_1 = require("./HNSContractService");
class TLDContractService extends HNSContractService_1.HNSContractService {
    async getNodes() {
        const nodes = await this.contract.getNodes();
        return nodes;
    }
    async getNumNodes() {
        const nodeNumber = await this.contract.getNumNodes();
        return Number(nodeNumber);
    }
    async getSLDNode(sldHash, start, stop) {
        const node = await this.contract.getSerial(sldHash, start, stop);
        return node;
    }
}
exports.TLDContractService = TLDContractService;
