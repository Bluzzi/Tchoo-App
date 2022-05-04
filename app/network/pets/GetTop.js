import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";
import { GetPetRequest } from "./Get";
import { NftObject } from "./NftObject";

export class GetTopRequest {
    constructor(startIndex, stopIndex) { 
        this.startIndex = startIndex;
        this.stopIndex = stopIndex;
    }

    serialize() {
        return {
            start_index: this.startIndex,
            stop_index: this.stopIndex
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.get_top, this.serialize());
        return new GetTopResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {GetTopResponse}
     */
    static async createAndSend(startIndex, stopIndex) {
        return (new GetTopRequest(startIndex, stopIndex)).send();
    }
}

class GetTopResponse {
    constructor(object) {
        this.success = object.success;
        this.topNfts = object.top_nfts;
    }

    isSuccess() {
        return this.success
    }

    getTopNfts() {
        return this.topNfts
    }

    getTopNftsData() {
        let nftsData = [];
        this.topNfts.forEach(element => {
            nftsData.push(NftObject(element))
        });

        return nftsData
    }

}