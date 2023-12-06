import SLDabi from "../../abi/SLDNode.json";
import TLDabi from "../../abi/TLDNode.json";
import { SLDContractService } from "./SLDContractService";
import { TLDContractService } from "./TLDContractService";

export const getSldSmartContract = (evmContract: string, rpcString: string) =>
    new SLDContractService(evmContract, SLDabi, rpcString);
export const getTldSmartContract = (evmContract: string, rpcString: string) =>
    new TLDContractService(evmContract, TLDabi, rpcString);
