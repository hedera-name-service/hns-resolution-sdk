"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNameHash = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
const generateNameHash = (domain) => {
    if (!domain) {
        return {
            domain,
            tldHash: Buffer.from([0x0]),
            sldHash: Buffer.from([0x0]),
        };
    }
    const domainsList = domain.split(`.`).reverse();
    const tld = domainsList[0];
    let sld;
    if (domainsList.length > 1) {
        sld = domainsList.slice(0, 2);
    }
    let tldHash = Buffer.from([0x0]);
    let sldHash = Buffer.from([0x0]);
    if (tld) {
        tldHash = (0, keccak256_1.default)(tld);
    }
    if (sld) {
        sldHash = sld.reduce((prev, curr) => (0, keccak256_1.default)(prev + curr), Buffer.from(``));
    }
    return { domain, tldHash, sldHash };
};
exports.generateNameHash = generateNameHash;
