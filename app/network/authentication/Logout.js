import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";

export class LogoutRequest {
    constructor() {
    }

    serialize() {
        return {}
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.account.logout, this.serialize(), true);
        return new LogoutResponse(response)
    }

    /**
     * Simple Wrapper
     * @returns {LogoutResponse}
     */
    static async createAndSend() {
        return (new LogoutRequest()).send();
    }
}

class LogoutResponse {
    constructor(object) {
        this.success = object.success;

        // If success === true -> returns nothing


        // If success == false -> returns an error node
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
}