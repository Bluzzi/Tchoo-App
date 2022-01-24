import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";

export class LoginRequest {
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
        let response = await Adapter.sendRequest(Adapter.END_POINTS.account.login, this.serialize());
        return new LoginResponse(response)
    }

    /**
     * Simple Wrapper
     * @param {String} username 
     * @param {String} password 
     * @returns {LoginResponse}
     */
    static async createAndSend(username, password) {
        return (new LoginRequest(username, password)).send();
    }
}

class LoginResponse {
    constructor(object) {
        this.success = object.success;

        // If success === true -> returns a login token
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