"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLDContractService = void 0;
const HNSContractService_1 = require("./HNSContractService");
class TLDContractService extends HNSContractService_1.HNSContractService {
    async getNodes() {
        const nodes = await this.contract.methods.getNodes().call();
        return nodes;
    }
    async getNumNodes() {
        const nodeNumber = await this.contract.methods.getNumNodes().call();
        return Number(nodeNumber);
    }
    async getSLDNode(sldHash, start, stop) {
        const node = await this.contract.methods.getSerial(sldHash, start, stop).call();
        return node;
    }
}
exports.TLDContractService = TLDContractService;
