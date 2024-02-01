"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashDomain = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
const hash = (sld) => sld.reduce((prev, curr) => (0, keccak256_1.default)(prev + curr), Buffer.from(``));
const hashDomain = (domain) => {
    const domains = domain.split(`.`).reverse();
    if (domains.length > 2)
        throw new Error(`Invalid domain input`);
    const sldHash = hash(domains.slice(0, 2));
    const tldHash = hash(domains.slice(0, 1));
    return { domain, tldHash, sldHash };
};
exports.hashDomain = hashDomain;
