import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";

export class BuyTicketRequest {
    constructor(petNonce) {
        this.petNonce = petNonce;
    }

    serialize() {
        return {
            "pet_nonce": this.petNonce
        }
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.lottery.buy_ticket, this.serialize(), true);
        return new BuyTicketResponse(response)
    }

    /**
     * Simple Wrapper
     * @param {Int} petNonce
     * @returns {Promise<BuyTicketResponse>}
     */
    static async createAndSend(petNonce) {
        return (new BuyTicketRequest(petNonce)).send();
    }
}

class BuyTicketResponse {
    constructor(object) {
        this.success = object.success;

        // If success === true -> returns a login token
        this.wonPrize = object.won_prize; // Did he win anything?
        this.prize = object.prize;
        this.prizePicture = object.picture;

        // If success == false -> returns an error node
        this.errorNode = object.error;
    }

    isSuccess() {
        return this.success
    }

    isPrizeWon() {
        return this.wonPrize
    }

    getPrize() {
        return this.prize
    }

    getPicture() {
        return this.prizePicture
    }

    getErrorNode() {
        return this.errorNode
    }

    getErrorText() {
        return getErrorTextFromNode(this.getErrorNode())
    }
}