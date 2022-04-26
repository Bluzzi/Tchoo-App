import { Adapter } from "../adapter/Adapter";
import { NftObject } from "./NftObject";

export class GetPetRequest {
    constructor(nonce) {
        this.nonce = nonce;
    }

    serialize() {
        return {
            "nonce": this.nonce,
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.get, this.serialize());
        return new NftObject(response)
    }

    /**
     * Simple Wrapper
     * @param {Float64} petNonce 
     * @returns {Promise<NftObject>}
     */
    static async createAndSend(petNonce) {
        return (new GetPetRequest(petNonce)).send();
    }
}