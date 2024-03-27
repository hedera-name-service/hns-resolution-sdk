export interface DomainInfo {
    transactionId: string;
    nameHash: {
        domain: string;
        tldHash: string;
        sldHash: string;
    };
    nftId: string;
    expiration: number | null;
    provider: string;
    providerData: {
        contractId: string;
    };
    accountId: string;
}
