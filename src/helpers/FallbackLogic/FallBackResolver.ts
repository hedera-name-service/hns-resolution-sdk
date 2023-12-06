import { NameHash } from "../../types/NameHash";
import { NetworkType } from "../../types/NetworkType";
import { ResolverConfigs } from "../../types/ResolverConfigs";
import { hashDomain } from "../../util/hashDomain";
import { MirrorNode } from "../MirrorNode";
import { getSldSmartContract, getTldSmartContract } from "../smartContracts/getSmartContract";

export class FallBackResolver {
    networkType: string;
    arkhiaUrl: string | undefined;
    jRpc: string;
    arkhiaApiValue: string | undefined;
    mirrorNode: MirrorNode;
    constructor(networkType: NetworkType, configs?: ResolverConfigs) {
        this.networkType = networkType;
        this.arkhiaUrl = configs?.arkhiaUrl;
        this.jRpc =
            configs?.jRpc ||
            (networkType === `arkhia_test` || networkType === `hedera_test`
                ? `https://testnet.hashio.io/api`
                : `https://mainnet.hashio.io/api`);
        this.arkhiaApiValue = configs?.arkhiaApiValue;
        this.mirrorNode = new MirrorNode(networkType, configs);
    }

    async fallBackResolveSLD(domain: string) {
        const nameHash = hashDomain(domain);
        const domainTopicMessage = await this.mirrorNode.getTopicMessage(nameHash);
        const contractEVM = await this.mirrorNode.getContractEvmAddress(
            domainTopicMessage.contractId,
        );
        const tldContractService = await getTldSmartContract(contractEVM, this.jRpc);
        const contractList = await tldContractService.getNodes();
        if (contractList.length === 0) throw Error(`No Contract Address`);
        const { foundData, nftInfo } = await this.getAccountInfo(
            contractList,
            nameHash,
            domainTopicMessage.tokenId,
        );

        return Promise.resolve(foundData && new Date() < foundData.date ? nftInfo.account_id : ``);
    }
    async fallBackGetDomainInfo(nameHash: NameHash) {
        const domainTopicMessage = await this.mirrorNode.getTopicMessage(nameHash);
        const contractEVM = await this.mirrorNode.getContractEvmAddress(
            domainTopicMessage.contractId,
        );
        const tldContractService = await getTldSmartContract(contractEVM, this.jRpc);
        const contractList = await tldContractService.getNodes();
        if (contractList.length === 0) throw Error(`No Contract Address`);
        const { foundData, nftInfo } = await this.getAccountInfo(
            contractList,
            nameHash,
            domainTopicMessage.tokenId,
        );

        const nftDataTopicMessage = await this.mirrorNode.getNftInfoTopicMessage(
            domainTopicMessage.topicId,
            nftInfo,
        );
        if (nftDataTopicMessage.length === 0) throw new Error(`Unable to Find MetaData`);
        const final = JSON.parse(Buffer.from(nftDataTopicMessage[0].message, `base64`).toString());

        final.accountId = !foundData || new Date() < foundData.date ? nftInfo.account_id : ``;
        final.expiration =
            !foundData || new Date() < foundData.date ? foundData?.date.getTime() : null;
        return final;
    }
    async fallBackGetAllDomainsForAccount(accountId: string) {
        if (!accountId.startsWith(`0.0.`)) return [];
        const topicMessages = await this.mirrorNode.getTopicMessage();
        const userNftLists = await this.mirrorNode.getAllUserHNSNfts(topicMessages, accountId);
        const nftDataTopicMessages = await this.mirrorNode.getNftTopicMessages(
            topicMessages,
            userNftLists,
        );
        const final: Record<string, string>[] = [];
        for (let index = 0; index < nftDataTopicMessages.length; index += 1) {
            const currMsgInfo = JSON.parse(
                Buffer.from(nftDataTopicMessages[index].message, `base64`).toString(),
            );
            const checkAccountId = await this.fallBackResolveSLD(currMsgInfo.nameHash.domain);
            if (checkAccountId === accountId && Boolean(checkAccountId)) {
                final.push(currMsgInfo.nameHash.domain);
            }
        }

        return final;
    }

    private async getAccountInfo(contractList: string[], nameHash: NameHash, tokenId: string) {
        let foundData;
        if (contractList.length === 0) throw Error(`Evm Contract Issues`);

        for (let index = 0; index < contractList.length; index += 1) {
            const SLDcontracts = getSldSmartContract(contractList[index], this.jRpc);
            const serial = await SLDcontracts.getSerial(
                `0x${Buffer.from(nameHash.sldHash).toString(`hex`)}`,
            );
            const dateExp = await SLDcontracts.getExpiry(
                `0x${Buffer.from(nameHash.sldHash).toString(`hex`)}`,
            );
            if (dateExp !== 0) {
                const d = new Date(0);
                d.setUTCSeconds(dateExp);
                foundData = { serial, date: d };
                break;
            }
        }
        if (!foundData) throw Error(`No Serial`);

        const nftInfo = await this.mirrorNode.getNFT(tokenId, `${foundData?.serial}`);

        return { foundData, nftInfo };
    }
}
