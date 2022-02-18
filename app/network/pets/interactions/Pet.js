import { getLocalizationAsync } from "expo-localization";
import { Adapter } from "../../adapter/Adapter";
import { getErrorTextFromNode } from "../../errors/Errors";
import { NftObject } from "../NftObject";

export class PetInteractionRequest {
    constructor(petNonce) { 
        this.petNonce = petNonce;
    }

    serialize() {
        return {
            pet_nonce: this.petNonce,
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.interactions.pet, this.serialize(), true);
        return new PetInteractionResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {Promise<PetInteractionResponse>}
     */
    static async createAndSend(petNonce) {
        return (new PetInteractionRequest(petNonce)).send();
    }
}

class PetInteractionResponse {
    constructor(object) {
        this.success = object.success;

        // If error is false -> get error code
        this.errorNode = object.error;
    }

    isSuccess() {
        return this.success
    }

    getErrorNode() {
        return this.errorNode
    }

    getErrorText() {
        return getErrorTextFromNode(this.getErrorNode())
    }

    getTimeLeft() {
        return this.getErrorNode().split(":")[1]
    }
}