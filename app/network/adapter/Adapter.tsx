import { Cache } from "../../cache_storage/Cache";

export class Adapter {
    static END_POINTS = {
        account: {
            login: "account/login",
            logout: "account/logout",
            create: "account/create",
        },

        pets: {
            interactions: {
                feed: "pets/interactions/feed",
                wash: "pets/interactions/wash",
                pet: "pets/interactions/pet",
                sleep: "pets/interactions/sleep",
            },
            get_owned: "pets/get_owned",
            get: "pets/get",
            get_top: "pets/get_top",
        },

        lottery: {
            get: "lottery/get",
            buy_ticket: "lottery/buy_ticket",
        }
    }

    /**
     * Send a request to the backend 🚀👨‍🚀
     * @param {String} endPoint 
     * @param {Object} data 
     * @param {Boolean} includeToken
     * @returns {object}
     */
    static async sendRequest(endPoint, data, includeToken = false) {
        if (includeToken) {
            data["token"] = await Cache.getCachedValue(Cache.CACHE_LOGIN_TOKEN)
        }

        return fetch('http://45.145.164.115:8080/api/' + endPoint, {
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.error(error);
            return {}
        });
    }
}