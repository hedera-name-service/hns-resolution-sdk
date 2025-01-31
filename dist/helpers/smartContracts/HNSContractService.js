"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HNSContractService = void 0;
const JsonRpcService_1 = require("./JsonRpcService");
class HNSContractService extends JsonRpcService_1.JsonRpcService {
    async getMaxRecords() {
        const nodes = await this.contract.getNodes();
        return Number(nodes);
    }
}
exports.HNSContractService = HNSContractService;
