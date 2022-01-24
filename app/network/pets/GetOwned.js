import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";
import { GetPetRequest } from "./Get";
import { NftObject } from "./NftObject";

export class GetOwnedRequest {
    constructor() { }

    serialize() {
        return {}
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.get_owned, this.serialize(), true);
        return new GetOwnedResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {GetOwnedResponse}
     */
    static async createAndSend() {
        return (new GetOwnedRequest()).send();
    }
}

class GetOwnedResponse {
    constructor(object) {
        this.success = object.success;

        // If success === true -> returns a login token
        this.ownedNftsNonces = object.owned_nfts_nonces;
        this.ownedNftsData = null;

        // If success == false -> returns an error node
        this.errorNode = object.error;
    }

    isSuccess() {
        return this.success
    }

    getOwnedNftsNonces() {
        return this.ownedNftsNonces
    }

    /**
     * Get the nft data as objects
     * @returns {NftObject[]}
     */
    async getNftData() {
        if(this.ownedNftsData != null) {
            return this.ownedNftsData
        }

        let nftsData = []
        this.ownedNftsNonces.forEach(element => {
            let nftData = GetPetRequest.createAndSend(element);
            nftsData.push(nftData);
        });

        this.ownedNftsData = nftsData;
        return nftsData
    }

    getErrorNode() {
        return this.errorNode
    }

    getErrorText() {
        return getErrorTextFromNode(this.getErrorNode())
    }
}