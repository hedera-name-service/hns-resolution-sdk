import Web3 from "web3";

export class JsonRpcService {
    contractAddr: string;
    abi: any;
    providerString: string;
    provider: any; // to-do ethers provider type
    contract: any; // to-do ethers type
    constructor(contractAddr: string, abi: any, providerString: string) {
        this.contractAddr = contractAddr;
        this.providerString = providerString;
        this.provider = new Web3(new Web3.providers.HttpProvider(this.providerString));
        this.abi = abi;
        this.contract = new this.provider.eth.Contract(abi, contractAddr);
    }
}
