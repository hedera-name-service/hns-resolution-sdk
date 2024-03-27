"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDomainOrNameHashOrTxld = void 0;
const formatHederaTxId_1 = require("./formatHederaTxId");
const generateNameHash_1 = require("./generateNameHash");
const isNameHash_1 = require("./isNameHash");
const validateDomain_1 = require("./validateDomain");
const checkDomainOrNameHashOrTxld = async (domainOrNameHashOrTxId, mirrorNode) => {
    if (typeof domainOrNameHashOrTxId === `string` &&
        domainOrNameHashOrTxId.match(/[0-9].[0-9].[0-9]{1,7}@[0-9]{1,10}.[0-9]{1,9}/)) {
        const parseTxId = (0, formatHederaTxId_1.formatHederaTxId)(domainOrNameHashOrTxId);
        const domainName = await mirrorNode.getTxInfo(parseTxId);
        return (0, generateNameHash_1.generateNameHash)(domainName.newDomain || domainName.extendedDomain || domainName.expiredDomain);
    }
    else if (typeof domainOrNameHashOrTxId === `string` &&
        domainOrNameHashOrTxId.match(/\.[thbar]|\.[hbar]|\.[boo]|\.[cream]/)) {
        const checkDomain = (0, validateDomain_1.validateDomain)(domainOrNameHashOrTxId);
        if (!checkDomain)
            throw new Error(`Invalid Input`);
        return (0, generateNameHash_1.generateNameHash)(domainOrNameHashOrTxId);
    }
    else if (typeof domainOrNameHashOrTxId === `object` && (0, isNameHash_1.isNameHash)(domainOrNameHashOrTxId)) {
        return domainOrNameHashOrTxId;
    }
    else {
        throw new Error(`Invalid Input`);
    }
};
exports.checkDomainOrNameHashOrTxld = checkDomainOrNameHashOrTxld;
