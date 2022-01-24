import { Adapter } from "../adapter/Adapter";
import { getErrorTextFromNode } from "../errors/Errors";

export class GetLotteryRequest {
    constructor() {}

    serialize() {
        return {};
    }

    async send() {
        let response = await Adapter.sendRequest(Adapter.END_POINTS.lottery.get, this.serialize());
        return new GetLotteryResponse(response);
    }

    /**
     * Simple Wrapper
     * @returns {GetLotteryResponse}
     */
    static async createAndSend() {
        return (new GetLotteryRequest()).send();
    }
}

class GetLotteryResponse {
    constructor(object) {
        this.prizes = [];
        // object is an array
        object.prizes.forEach(element => {
            this.prizes.push(new LotteryPrize(element))
        });
        this.pricePerTicket = object.price_a_ticket;
    }

    /**
     * Get the current available lottery prizes
     * @returns {[]LotteryPrize}
     */
    getPrizes() {
        return this.prizes;
    }

    getPricePerTicket() {
        return this.pricePerTicket;
    }
}

class LotteryPrize {
    constructor(object) {
        this.prize = object.prize;
        this.picture = object.picture;
        this.percent = object.percent;
    }

    getPrize() {
        return this.prize
    }

    getPicture() {
        return this.picture
    }

    getPercent() {
        return this.percent
    }
}