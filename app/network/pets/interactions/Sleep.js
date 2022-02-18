import { getLocalizationAsync } from "expo-localization";
import { Adapter } from "../../adapter/Adapter";
import { getErrorTextFromNode } from "../../errors/Errors";

export class SleepInteractionRequest {
    constructor(petNonce, isMorning) { 
        this.petNonce = petNonce;
        this.isMorning = isMorning;
    }

    async serialize() {
        return {
            pet_nonce: this.petNonce,
            is_morning: this.isMorning,
            time_frame: (await getLocalizationAsync()).timezone
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.pets.interactions.sleep, await this.serialize(), true);
        return new SleepInteractionResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {SleepInteractionResponse}
     */
    static async createAndSend(petNonce, isMorning) {
        return (new SleepInteractionRequest(petNonce, isMorning)).send();
    }
}

class SleepInteractionResponse {
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