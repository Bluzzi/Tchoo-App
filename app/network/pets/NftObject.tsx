export class NftObject {
    static ACTION_FEED = "feed"
    static ACTION_SLEEP = "sleep"
    static ACTION_WASH = "wash"
    
    constructor(object) {
        this.nonce = object.nonce;
        this.threeDModel = object.three_d_model;
        this.mtlModel = object.mtl_model;
        this.textureModel = object.texture_model;
        this.twoDPicture = object.two_d_picture;
        this.name = object.name;
        this.holderUsername = object.holder_username;
        this.pointsBalance = object.points_balance;
        this.prestigeBalance = object.prestige_balance;
        this.pointsPerFiveMinutesBase = object.points_per_five_minutes_base;
        this.pointsPerFiveMinutesReal = object.points_per_five_minutes_real;
        this.actionsUsed = object.actions_used;
    }

    getNonce() {
        return this.nonce
    }

    get3dModel() {
        return this.threeDModel
    }

    getModelMtl() {
        return this.mtlModel
    }

    getModelTexture() {
        return this.textureModel
    }

    getTwoDPicture() {
        return this.twoDPicture
    }

    getName() {
        return this.name
    }

    getHolderName() {
        return this.holderUsername
    }

    getPointsBalance() {
        return this.pointsBalance
    }

    getPrestigeBalance() {
        return this.prestigeBalance
    }

    getPointsPerFiveMinutesBase() {
        return this.pointsPerFiveMinutesBase
    }

    getPointsPerFiveMinutesReal() {
        return this.pointsPerFiveMinutesReal
    }

    getActionsUsed() {
        return this.actionsUsed
    }
}