"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcService = void 0;
const web3_1 = __importDefault(require("web3"));
class JsonRpcService {
    constructor(contractAddr, abi, providerString) {
        this.contractAddr = contractAddr;
        this.providerString = providerString;
        this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(this.providerString));
        this.abi = abi;
        this.contract = new this.provider.eth.Contract(abi, contractAddr);
    }
}
exports.JsonRpcService = JsonRpcService;
