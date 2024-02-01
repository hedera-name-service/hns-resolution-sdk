"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTldSmartContract = exports.getSldSmartContract = void 0;
const SLDNode_json_1 = __importDefault(require("../../abi/SLDNode.json"));
const TLDNode_json_1 = __importDefault(require("../../abi/TLDNode.json"));
const SLDContractService_1 = require("./SLDContractService");
const TLDContractService_1 = require("./TLDContractService");
const getSldSmartContract = (evmContract, rpcString) => new SLDContractService_1.SLDContractService(evmContract, SLDNode_json_1.default, rpcString);
exports.getSldSmartContract = getSldSmartContract;
const getTldSmartContract = (evmContract, rpcString) => new TLDContractService_1.TLDContractService(evmContract, TLDNode_json_1.default, rpcString);
exports.getTldSmartContract = getTldSmartContract;
