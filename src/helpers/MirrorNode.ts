import { DOMAINS_MAIN, DOMAINS_TEST } from "../environmentsVariable/domains";
import { MAIN_TLD_TOPIC_ID, TEST_TLD_TOPIC_ID } from "../environmentsVariable/topicIds";
import { NameHash } from "../types/NameHash";
import { NetworkType } from "../types/NetworkType";
import { ResolverConfigs } from "../types/ResolverConfigs";
import { sendAxiosGetRequest } from "../util/axiosCall";
import { getMirrorNodeUrl } from "../util/getMirrorNodeUrl";

export class MirrorNode {
    baseUrl: string | undefined;
    header: Record<string, string>;
    topicId: string;
    tldNames: string[];
    constructor(networkType: NetworkType, configs?: ResolverConfigs) {
        this.baseUrl = getMirrorNodeUrl(networkType, configs?.arkhiaUrl);
        this.header = { "x-api-key": configs?.arkhiaApiValue || `` };
        this.topicId =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? TEST_TLD_TOPIC_ID
                : MAIN_TLD_TOPIC_ID;
        this.tldNames =
            networkType === `arkhia_test` || networkType === `hedera_test`
                ? DOMAINS_TEST
                : DOMAINS_MAIN;
    }
    async getTxInfo(txId: string) {
        const urlTopicManger = `${this.baseUrl}/api/v1/transactions/${txId}`;
        const res = await sendAxiosGetRequest(urlTopicManger, this.header);
        const domainName = JSON.parse(
            Buffer.from(res.data.transactions[0].memo_base64, `base64`).toString(),
        );
        return domainName;
    }
    async getNFT(tokenId: string, serial: string) {
        const url = `${this.baseUrl}/api/v1/tokens/${tokenId}/nfts/${serial}`;
        const res = await sendAxiosGetRequest(url, this.header);
        return res.data;
    }
    async getContractEvmAddress(contractId: string) {
        const url = `${this.baseUrl}/api/v1/contracts/${contractId}`;
        const res = await sendAxiosGetRequest(url, this.header);
        return res.data.evm_address;
    }
    async getTopicMessage(nameHash?: NameHash) {
        const urlTopicManger = `${this.baseUrl}/api/v1/topics/${this.topicId}/messages`;
        const res = await sendAxiosGetRequest(urlTopicManger, this.header);
        const topicMessages = res.data.messages.map((data) => {
            const decoded = Buffer.from(data.message, `base64`).toString();
            return JSON.parse(decoded);
        });
        if (nameHash) {
            const found = topicMessages.find(
                (message) => message.nameHash.tldHash === nameHash?.tldHash.toString(`hex`),
            );
            return found;
        }
        return topicMessages.filter((data) =>
            this.tldNames.find((name) => name === data.nameHash.domain),
        );
    }

    async getAllUserHNSNfts(topicMessages, accountId: string) {
        const nftList = [];
        for (let index = 0; index < topicMessages.length; index += 1) {
            const nftEndpoint = `${this.baseUrl}/api/v1/tokens/${topicMessages[index].tokenId}/nfts?account.id=${accountId}`;
            const nftData = await sendAxiosGetRequest(nftEndpoint, this.header);
            nftList.push(...nftData.data.nfts);

            if (nftData.data.links.next !== null) {
                const nextCall = await this.nextApiCall(nftData.data.links.next);

                nftList.push(...nextCall.nfts);
            }
        }

        return nftList;
    }
    async getNftTopicMessages(
        topicMessages: Record<string, string>[],
        userNftLists: Record<string, string>[],
    ) {
        const nftDataMessages: Record<string, string>[] = [];
        for (let index = 0; index < topicMessages.length; index += 1) {
            const urlTopicManger = `${this.baseUrl}/api/v1/topics/${topicMessages[index].topicId}/messages`;
            const mainTopicMessages = await sendAxiosGetRequest(urlTopicManger, this.header);
            const filteredData = mainTopicMessages.data.messages.filter((data) => {
                const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
                return userNftLists.some(
                    (userData) =>
                        currMsgInfo.nftId === `${userData.token_id}:${userData.serial_number}`,
                );
            });
            nftDataMessages.push(...filteredData);

            if (mainTopicMessages.data.links.next) {
                const nextCall = await this.nextApiCallTopics(mainTopicMessages.data.links.next);

                const nextData = nextCall.filter((data) => {
                    const currMsgInfo = JSON.parse(Buffer.from(data.message, `base64`).toString());
                    return userNftLists.some(
                        (userData) =>
                            currMsgInfo.nftId === `${userData.token_id}:${userData.serial_number}`,
                    );
                });
                nftDataMessages.push(...nextData);
            }
            if (nftDataMessages.length === userNftLists.length) break;
        }
        return nftDataMessages;
    }
    async getNftInfoTopicMessage(topicMessages: string, nftInfo: Record<string, string>) {
        const nftDataMessage: Record<string, string>[] = [];
        const urlTopicManger = `${this.baseUrl}/api/v1/topics/${topicMessages}/messages`;
        const mainTopicMessages = await sendAxiosGetRequest(urlTopicManger, this.header);
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

    private async nextApiCall(url: string) {
        const nextUrl = `${this.baseUrl}${url}`;
        const nextData = await sendAxiosGetRequest(nextUrl, this.header);

        if (nextData.data.links.next !== null) {
            return nextData.data.concat(await this.nextApiCall(nextData.data.links.next));
        }
        return nextData.data;
    }

    private async nextApiCallTopics(url: string) {
        const nextUrl = `${this.baseUrl}${url}`;
        const nextData = await sendAxiosGetRequest(nextUrl, this.header);

        if (nextData.data.links.next !== null) {
            return nextData.data.messages.concat(
                await this.nextApiCallTopics(nextData.data.links.next),
            );
        }
        return nextData.data.messages;
    }
}
