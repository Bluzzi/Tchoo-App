const ERROR_NODES = {
    "field.empty": "One of the fields is empty.",
    "account.exists": "Account already exists.",
    "account.token_invalid": "The token you're using is invalid.",
    "account.no_wallet_linked": "No wallet is linked with your account.",
    "account.invalid_login": "Incorrect username or password.",
    "wallet.used": "Wallet is already used on another account.",
    "pet.action_cooldown:": "You need to wait {time} before using this action again.",
    "location.invalid": "Your location is invalid.",
    "feed.time_invalid": "You can't feed it at this points in time.",
    "sleep.time_invalid": "You can't put it to sleep or wake it up at this points in time.",
    "lottery.not_enough_points": "You don't have enough points to buy a lottery ticket.",
}

export function getErrorTextFromNode(errorNode) {
    return ERROR_NODES[errorNode]
}