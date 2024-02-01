"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAxiosGetRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const sendAxiosGetRequest = async (url, header) => {
    return await axios_1.default.get(url, { headers: { ...header } });
};
exports.sendAxiosGetRequest = sendAxiosGetRequest;
