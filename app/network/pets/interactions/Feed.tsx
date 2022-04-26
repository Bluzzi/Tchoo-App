import { getLocalizationAsync } from "expo-localization";
import { Adapter } from "../../adapter/Adapter";
import { getErrorTextFromNode } from "../../errors/Errors";

export class FeedInteractionRequest {
    constructor(petNonce) { 
        this.petNonce = petNonce;
    }

    async serialize() {
        return {
            pet_nonce: this.petNonce,
            time_frame: (await getLocalizationAsync()).timezone
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.interactions.feed, await this.serialize(), true);
        return new FeedInteractionResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {Promise<FeedInteractionResponse>}
     */
    static async createAndSend(petNonce) {
        return (new FeedInteractionRequest(petNonce)).send();
    }
}

class FeedInteractionResponse {
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