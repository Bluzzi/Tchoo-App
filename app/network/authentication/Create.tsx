import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";

export class CreateRequest {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    serialize() {
        return {
            "username": this.username,
            "password": this.password
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.account.create, this.serialize());
        return new CreateResponse(response)
    }

    /**
     * Simple Wrapper
     * @param {String} username 
     * @param {String} password 
     * @returns {Promise<CreateResponse>}
     */
    static async createAndSend(username, password) {
        return (new CreateRequest(username, password)).send();
    }
}

class CreateResponse {
    constructor(object) {
        this.success = object.success;

        // If success === true -> returns a login token from account creation
        this.loginToken = object.token;

        // If success == false -> returns an error node
        this.errorNode = object.error;
    }

    isSuccess() {
        return this.success
    }

    getLoginToken() {
        return this.loginToken
    }

    getErrorNode() {
        return this.errorNode
    }

    getErrorText() {
        return getErrorTextFromNode(this.getErrorNode())
    }
}