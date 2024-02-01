"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallBackResolver = void 0;
const hashDomain_1 = require("../../util/hashDomain");
const MirrorNode_1 = require("../MirrorNode");
const getSmartContract_1 = require("../smartContracts/getSmartContract");
class FallBackResolver {
    constructor(networkType, configs) {
        this.networkType = networkType;
        this.arkhiaUrl = configs === null || configs === void 0 ? void 0 : configs.arkhiaUrl;
        this.jRpc =
            (configs === null || configs === void 0 ? void 0 : configs.jRpc) ||
                (networkType === `arkhia_test` || networkType === `hedera_test`
                    ? `https://testnet.hashio.io/api`
                    : `https://mainnet.hashio.io/api`);
        this.arkhiaApiValue = configs === null || configs === void 0 ? void 0 : configs.arkhiaApiValue;
        this.mirrorNode = new MirrorNode_1.MirrorNode(networkType, configs);
    }
    async fallBackResolveSLD(domain) {
        const nameHash = (0, hashDomain_1.hashDomain)(domain);
        const domainTopicMessage = await this.mirrorNode.getTopicMessage(nameHash);
        const contractEVM = await this.mirrorNode.getContractEvmAddress(domainTopicMessage.contractId);
        const tldContractService = await (0, getSmartContract_1.getTldSmartContract)(contractEVM, this.jRpc);
        const contractList = await tldContractService.getNodes();
        if (contractList.length === 0)
            throw Error(`No Contract Address`);
        const { foundData, nftInfo } = await this.getAccountInfo(contractList, nameHash, domainTopicMessage.tokenId);
        return Promise.resolve(foundData && new Date() < foundData.date ? nftInfo.account_id : ``);
    }
    async fallBackGetDomainInfo(nameHash) {
        const domainTopicMessage = await this.mirrorNode.getTopicMessage(nameHash);
        const contractEVM = await this.mirrorNode.getContractEvmAddress(domainTopicMessage.contractId);
        const tldContractService = await (0, getSmartContract_1.getTldSmartContract)(contractEVM, this.jRpc);
        const contractList = await tldContractService.getNodes();
        if (contractList.length === 0)
            throw Error(`No Contract Address`);
        const { foundData, nftInfo } = await this.getAccountInfo(contractList, nameHash, domainTopicMessage.tokenId);
        const nftDataTopicMessage = await this.mirrorNode.getNftInfoTopicMessage(domainTopicMessage.topicId, nftInfo);
        if (nftDataTopicMessage.length === 0)
            throw new Error(`Unable to Find MetaData`);
        const final = JSON.parse(Buffer.from(nftDataTopicMessage[0].message, `base64`).toString());
        final.accountId = !foundData || new Date() < foundData.date ? nftInfo.account_id : ``;
        final.expiration =
            !foundData || new Date() < foundData.date ? foundData === null || foundData === void 0 ? void 0 : foundData.date.getTime() : null;
        return final;
    }
    async fallBackGetAllDomainsForAccount(accountId) {
        if (!accountId.startsWith(`0.0.`))
            return [];
        const topicMessages = await this.mirrorNode.getTopicMessage();
        const userNftLists = await this.mirrorNode.getAllUserHNSNfts(topicMessages, accountId);
        const nftDataTopicMessages = await this.mirrorNode.getNftTopicMessages(topicMessages, userNftLists);
        const final = [];
        for (let index = 0; index < nftDataTopicMessages.length; index += 1) {
            const currMsgInfo = JSON.parse(Buffer.from(nftDataTopicMessages[index].message, `base64`).toString());
            const checkAccountId = await this.fallBackResolveSLD(currMsgInfo.nameHash.domain);
            if (checkAccountId === accountId && Boolean(checkAccountId)) {
                final.push(currMsgInfo.nameHash.domain);
            }
        }
        return final;
    }
    async getAccountInfo(contractList, nameHash, tokenId) {
        let foundData;
        if (contractList.length === 0)
            throw Error(`Evm Contract Issues`);
        for (let index = 0; index < contractList.length; index += 1) {
            const SLDcontracts = (0, getSmartContract_1.getSldSmartContract)(contractList[index], this.jRpc);
            const serial = await SLDcontracts.getSerial(`0x${Buffer.from(nameHash.sldHash).toString(`hex`)}`);
            const dateExp = await SLDcontracts.getExpiry(`0x${Buffer.from(nameHash.sldHash).toString(`hex`)}`);
            if (dateExp !== 0) {
                const d = new Date(0);
                d.setUTCSeconds(dateExp);
                foundData = { serial, date: d };
                break;
            }
        }
        if (!foundData)
            throw Error(`No Serial`);
        const nftInfo = await this.mirrorNode.getNFT(tokenId, `${foundData === null || foundData === void 0 ? void 0 : foundData.serial}`);
        return { foundData, nftInfo };
    }
}
exports.FallBackResolver = FallBackResolver;
