import { ethers } from "ethers";

export class JsonRpcService {
    contractAddr: string;
    abi: any;
    providerString: string;
    provider: ethers.JsonRpcProvider;
    contract: ethers.Contract;

    constructor(contractAddr: string, abi: any, providerString: string) {
        this.contractAddr = contractAddr;
        this.abi = abi;
        this.providerString = providerString;
        this.provider = new ethers.JsonRpcProvider(this.providerString);
        this.contract = new ethers.Contract(this.contractAddr, this.abi, this.provider);
    }
}
