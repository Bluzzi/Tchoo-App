import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cache } from "../../../cache_storage/Cache";
import { Colours } from "../../../layout/colors/Colours";
import { AppDimensions } from "../../../layout/dimensions/Dimensions";
import { Nodes } from "../../../Navigation";
import { LoginRequest } from "../../../network/authentication/Login";
import { ERROR_NODES, getErrorTextFromNode } from "../../../network/errors/Errors";
import Input from "../Input";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameInputRef: null,
            usernameText: "",
            
            passwordInputRef: null,
            passwordText: "",

            querying: false
        };
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={{ flex: 1, backgroundColor: Colours.BACKGROUND }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ width: "100%", height: "30%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(45), fontFamily: "ReemKufi-Bold", color: Colours.TEXT_IMPORTANT, padding: "0.5%", }}>TCHOO</Text>
                            <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(25), fontFamily: "ReemKufi-Bold", color: Colours.TEXT_IMPORTANT_SUB }}>LOGIN</Text>
                        </View>

                        <View style={{ width: "100%", height: "40%", justifyContent: "space-around", alignItems: "center" }}>
                            <Input
                                label="USERNAME"
                                placeholder="Enter your username.."
                                
                                ref={(r) => {
                                    if(!this.state.usernameInputRef) this.setState({ usernameInputRef: r })
                                }}
                                onChangeText={(text) => {
                                    this.setState({ usernameText: text })
                                }}
                            />

                            <Input
                                label="PASSWORD"
                                placeholder="Enter your password.."
                                textInputProps={{
                                    secureTextEntry: true
                                }}

                                ref={(r) => {
                                    if(!this.state.passwordInputRef) this.setState({ passwordInputRef: r })
                                }}
                                onChangeText={(text) => {
                                    this.setState({ passwordText: text })
                                }}
                            />
                        </View>

                        <View style={{ width: "100%", height: "30%", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity 
                                style={{ 
                                    width: "65%", height: AppDimensions.ContentHeight * 0.07,
                                    backgroundColor: Colours.TEXT_IMPORTANT, borderRadius: 4,
                                    justifyContent: "center", alignItems: "center", marginBottom: "4%"
                                }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (this.state.usernameText == "") {
                                        this.state.usernameInputRef.showError(getErrorTextFromNode(ERROR_NODES.EMPTY_FIELD));
                                        return;
                                    }

                                    if (this.state.passwordText == "") {
                                        this.state.passwordInputRef.showError(getErrorTextFromNode(ERROR_NODES.EMPTY_FIELD));
                                        return;
                                    }

                                    this.setState({ querying: true })

                                    LoginRequest.createAndSend(this.state.usernameText, this.state.passwordText).then((loginResponse) => {
                                        if (loginResponse.isSuccess()) {
                                            Cache.setCachedValue(Cache.CACHE_LOGIN_TOKEN, loginResponse.getLoginToken()).then(() => {
                                                this.props.navigation.navigate(Nodes.Pets.SELECT_PET)
                                            });
                                        } else {
                                            this.state.usernameInputRef.showError(loginResponse.getErrorText());
                                        }

                                        this.setState({ querying: false });
                                    })
                                }}

                                disabled={this.state.querying}
                            >
                                {
                                    this.state.querying ?
                                    (<ActivityIndicator size="small" color="white" />)
                                    :
                                    (<Text style={{ fontSize: AppDimensions.fontToScaleFontSize(20), fontFamily: "Roboto-Bold", color: "white" }}>LOGIN</Text>)
                                }
                            </TouchableOpacity>

                            <Text style={{ fontFamily: "Roboto-Light", fontSize: AppDimensions.fontToScaleFontSize(15) }}>
                                <Text style={{ color: "white" }}>No account yet? </Text> 
                                <Text style={{ color: Colours.TEXT_IMPORTANT, fontFamily: "Roboto-Bold" }} onPress={() => {
                                    this.props.navigation.navigate(Nodes.Authentication.REGISTER)
                                }}>Register</Text>
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
}

export default Login;
