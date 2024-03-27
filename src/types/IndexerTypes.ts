export interface IndexerDomainInfo {
    topic_id: string;
    paymenttransaction_id: string;
    topictransaction_id: string;
    domain: string;
    tld_hash: string;
    sld_hash: string;
    provider: string;
    contract_id: string;
    expiration: number;
    nft_id: number;
    tld: string;
    payer_account_id: string;
    running_hash: string;
    running_hash_version: number;
    sequence_number: number;
    token_id: string;
    network: string;
    nftId: string;
    idx: string;
    account_id: string;
    created_timestamp: string;
    serial_number: number;
    delegating_spender: string;
    deleted: string;
    metadata: string;
    modified_timestamp: string;
}

export interface IndexerBlackList {
    id: string;
    topicId: string;
    consensusTimestamp: string;
    paymentTransactionId: string;
    topicTransactionId: string;
    sld: string;
    tldHash: string;
    sldHash: string;
    provider: string;
    contractId: string;
    expiration: string;
    payerAccountId: string;
    runningHash: string;
    sequenceNumber: string;
    network: string;
    sldNftId: string;
    nft: {
        id: string;
        tokenId: string;
        serialNumber: string;
        ownerAccountId: string;
        createdTimestamp: string;
        delegatingSpender: string;
        deleted: string;
        metadata: string;
        modifiedTimestamp: string;
        network: string;
        expiration: string;
        isPermanentlyExpired: string;
        tldRegistrationTopicId: string;
        contractReadInfo: string;
    };
}

export interface IndexerMetaData {
    serial: string;
    expiry: string;
    subdomainNode: string;
    index: string;
    addresses: {
        eth: string;
        btc: string;
        sol: string;
    };
    textRecord: {
        avatar: string;
        twitter: string;
        email: string;
        url: string;
        description: string;
        keywords: string;
        discord: string;
        github: string;
        reddit: string;
        telegram: string;
        extras: string;
    };
}
