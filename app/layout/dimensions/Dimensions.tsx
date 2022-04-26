import { Dimensions } from "react-native";

export class AppDimensions {
    static ContentHeight = Dimensions.get("window").height
    static ContentWidth = Dimensions.get("window").width

    // Use fixed values * fontScale
    static ContentFontSize = Dimensions.get("window").fontScale
    static fontToScaleFontSize = (fontSize) => { return fontSize * this.ContentFontSize }
}