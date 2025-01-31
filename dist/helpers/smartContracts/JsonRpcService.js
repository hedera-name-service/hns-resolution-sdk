"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcService = void 0;
const ethers_1 = require("ethers");
class JsonRpcService {
    constructor(contractAddr, abi, providerString) {
        this.contractAddr = contractAddr;
        this.abi = abi;
        this.providerString = providerString;
        this.provider = new ethers_1.ethers.JsonRpcProvider(this.providerString);
        this.contract = new ethers_1.ethers.Contract(this.contractAddr, this.abi, this.provider);
    }
}
exports.JsonRpcService = JsonRpcService;
