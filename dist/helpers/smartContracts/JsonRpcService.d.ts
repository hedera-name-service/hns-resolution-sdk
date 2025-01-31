import { ethers } from "ethers";
export declare class JsonRpcService {
    contractAddr: string;
    abi: any;
    providerString: string;
    provider: ethers.JsonRpcProvider;
    contract: ethers.Contract;
    constructor(contractAddr: string, abi: any, providerString: string);
}
