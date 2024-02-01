import { SLDContractService } from "./SLDContractService";
import { TLDContractService } from "./TLDContractService";
export declare const getSldSmartContract: (evmContract: string, rpcString: string) => SLDContractService;
export declare const getTldSmartContract: (evmContract: string, rpcString: string) => TLDContractService;
