const ERROR_NODES_TO_TEXT = {
    "field.empty": "One of the fields is empty.",
    "account.exists": "Account already exists.",
    "account.token_invalid": "The token you're using is invalid.",
    "account.no_wallet_linked": "No wallet is linked with your account.",
    "account.invalid_login": "Incorrect username or password.",
    "wallet.used": "Wallet is already used on another account.",
    "pet.action_cooldown:": "You need to wait {time} before using this action again.",
    "location.invalid": "Your location is invalid.",
    "feed.time_invalid": "You can't feed it at this point in time.",
    "sleep.time_invalid": "You can't put it to sleep or wake it up at this point in time.",
    "lottery.not_enough_points": "You don't have enough points to buy a lottery ticket.",
}

export const ERROR_NODES = {
    EMPTY_FIELD: "field.empty",
    ACCOUNT_EXISTS: "account.exists",
    ACCOUNT_TOKEN_INVALID: "account.token_invalid",
    ACCOUNT_NO_WALLET_LINKED: "account.no_wallet_linked",
    INVALID_LOGIN: "account.invalid_login",
    WALLET_USED: "wallet.used",
    LOCATION_INVALID: "location.invalid",
    FEED_TIME_INVALID: "feed.time_invalid",
    SLEEP_TIME_INVALID: "sleep.time_invalid",
    LOTTERY_NOT_ENOUGH_POINTS: "lottery.not_enough_points",
}
export function getErrorTextFromNode(errorNode) {
    if (errorNode.includes('pet.action_cooldown:')) {
        let text = ERROR_NODES_TO_TEXT['pet.action_cooldown:'];
        let duration = parseInt(errorNode.split(':')[1], 10);
        let hours = Math.floor(duration / 3600)
        let minutes = Math.floor((duration % 3600) / 60)
        let seconds = Math.floor(((duration % 3600) % 60))
        let time = (hours > 0 ? hours + ' hours ' : '') + (minutes > 0 ? minutes + ' minutes ' : '') + (seconds > 0 ? seconds + ' seconds' : '')
        return text.replace('{time}', time)
    }
    return ERROR_NODES_TO_TEXT[errorNode]
}