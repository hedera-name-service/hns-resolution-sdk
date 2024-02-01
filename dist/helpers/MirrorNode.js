"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirrorNode = void 0;
const domains_1 = require("../environmentsVariable/domains");
const topicIds_1 = require("../environmentsVariable/topicIds");
const axiosCall_1 = require("../util/axiosCall");
const getMirrorNodeUrl_1 = require("../util/getMirrorNodeUrl");
class MirrorNode {
    constructor(networkType, configs) {
        this.baseUrl = (0, getMirrorNodeUrl_1.getMirrorNodeUrl)(networkType, configs === null || configs === void 0 ? void 0 : configs.arkhiaUrl);
        this.header = { "x-api-key": (configs === null || configs === void 0 ? void 0 : configs.arkhiaApiValue) || `` };
        this.topicId =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? topicIds_1.TEST_TLD_TOPIC_ID
                : topicIds_1.MAIN_TLD_TOPIC_ID;
        this.tldNames =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? domains_1.DOMAINS_TEST
                : domains_1.DOMAINS_MAIN;
    }
    async getTxInfo(txId) {
        const urlTopicManger = `${this.baseUrl}/api/v1/transactions/${txId}`;
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(urlTopicManger, this.header);
        const domainName = JSON.parse(Buffer.from(res.data.transactions[0].memo_base64, `base64`).toString());
        return domainName;
    }
    async getNFT(tokenId, serial) {
        const url = `${this.baseUrl}/api/v1/tokens/${tokenId}/nfts/${serial}`;
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(url, this.header);
        return res.data;
    }
    async getContractEvmAddress(contractId) {
        const url = `${this.baseUrl}/api/v1/contracts/${contractId}`;
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(url, this.header);
        return res.data.evm_address;
    }
    async getTopicMessage(nameHash) {
        const urlTopicManger = `${this.baseUrl}/api/v1/topics/${this.topicId}/messages`;
        const res = await (0, axiosCall_1.sendAxiosGetRequest)(urlTopicManger, this.header);
        const topicMessages = res.data.messages.map((data) => {
            const decoded = Buffer.from(data.message, `base64`).toString();
            return JSON.parse(decoded);
        });
        if (nameHash) {
            const found = topicMessages.find((message) => message.nameHash.tldHash === (nameHash === null || nameHash === void 0 ? void 0 : nameHash.tldHash.toString(`hex`)));
            return found;
        }
        return topicMessages.filter((data) => this.tldNames.find((name) => name === data.nameHash.domain));
    }
    async getAllUserHNSNfts(topicMessages, accountId) {
        const nftList = [];
        for (let index = 0; index < topicMessages.length; index += 1) {
            const nftEndpoint = `${this.baseUrl}/api/v1/tokens/${topicMessages[index].tokenId}/nfts?account.id=${accountId}`;
            const nftData = await (0, axiosCall_1.sendAxiosGetRequest)(nftEndpoint, this.header);
            nftList.push(...nftData.data.nfts);
            if (nftData.data.links.next !== null) {
                const nextCall = await this.nextApiCall(nftData.data.links.next);
                nftList.push(...nextCall.nfts);
            }
        }
        return nftList;
    }
    async getNftTopicMessages(topicMessages, userNftLists) {
        const nftDataMessages = [];
        for (let index = 0; index < topicMessages.length; index += 1) {
            const urlTopicManger = `${this.baseUrl}/api/v1/topics/${topicMessages[index].topicId}/messages`;
            const mainTopicMessages = await (0, axiosCall_1.sendAxiosGetRequest)(urlTopicManger, this.header);
            const filteredData = mainTopicMessages.data.messages.filter((data) => {
                const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
                return userNftLists.some((userData) => currMsgInfo.nftId === `${userData.token_id}:${userData.serial_number}`);
            });
            nftDataMessages.push(...filteredData);
            if (mainTopicMessages.data.links.next) {
                const nextCall = await this.nextApiCallTopics(mainTopicMessages.data.links.next);
                const nextData = nextCall.filter((data) => {
                    const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
                    return userNftLists.some((userData) => currMsgInfo.nftId === `${userData.token_id}:${userData.serial_number}`);
                });
                nftDataMessages.push(...nextData);
            }
            if (nftDataMessages.length === userNftLists.length)
                break;
        }
        return nftDataMessages;
    }
    async getNftInfoTopicMessage(topicMessages, nftInfo) {
        const nftDataMessage = [];
        const urlTopicManger = `${this.baseUrl}/api/v1/topics/${topicMessages}/messages`;
        const mainTopicMessages = await (0, axiosCall_1.sendAxiosGetRequest)(urlTopicManger, this.header);
        const filteredData = mainTopicMessages.data.messages.filter((data) => {
            const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
            return currMsgInfo.nftId === `${nftInfo.token_id}:${nftInfo.serial_number}`;
        });
        nftDataMessage.push(...filteredData);
        if (mainTopicMessages.data.links.next) {
            const nextCall = await this.nextApiCallTopics(mainTopicMessages.data.links.next);
            const nextData = nextCall.filter((data) => {
                const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
                return currMsgInfo.nftId === `${nftInfo.token_id}:${nftInfo.serial_number}`;
            });
            nftDataMessage.push(...nextData);
        }
        return nftDataMessage;
    }
    async nextApiCall(url) {
        const nextUrl = `${this.baseUrl}${url}`;
        const nextData = await (0, axiosCall_1.sendAxiosGetRequest)(nextUrl, this.header);
        if (nextData.data.links.next !== null) {
            return nextData.data.concat(await this.nextApiCall(nextData.data.links.next));
        }
        return nextData.data;
    }
    async nextApiCallTopics(url) {
        const nextUrl = `${this.baseUrl}${url}`;
        const nextData = await (0, axiosCall_1.sendAxiosGetRequest)(nextUrl, this.header);
        if (nextData.data.links.next !== null) {
            return nextData.data.messages.concat(await this.nextApiCallTopics(nextData.data.links.next));
        }
        return nextData.data.messages;
    }
}
exports.MirrorNode = MirrorNode;
