import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Cache } from "./cache_storage/Cache";
import { ERROR_NODES } from "./network/errors/Errors";
import { GetOwnedRequest } from "./network/pets/GetOwned";
import Login from "./screens/authentication/login/Login";
import Register from "./screens/authentication/register/Register";
import HomePet from "./screens/nft/home/HomePet";
import Lottery from "./screens/nft/lottery/Lottery";
import LotteryPrizeViewer from "./screens/nft/lottery/LotteryPrizeViewer";
import SelectPet from "./screens/nft/select/SelectPet";

const Stack = createNativeStackNavigator();

export const Nodes = {
    Authentication: {
        LOGIN: "@authentication/login",
        REGISTER: "@authentication/register"
    },
    
    Pets: {
        SELECT_PET: "@pets/select",
        LOTTERY: "@pets/lottery",
        LOTTERY_VIEW: "@pets/lottery_view",
        HOME_PET: "@pets/home"
    }
}

export class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            initialRoute: ""
        };

        this.getInitialRoute().then((route) => {
            this.setState({ loading: false, initialRoute: route })
        })
    }

    async getInitialRoute() {
        // Is User Logged in?
        let isCachedValue = await Cache.isCachedValue(Cache.CACHE_LOGIN_TOKEN);
        if (isCachedValue) {
            // User has a token set but is the token valid?: Make a sample request to ask
            let response = await GetOwnedRequest.createAndSend();
            if (response.getErrorNode() == ERROR_NODES.ACCOUNT_TOKEN_INVALID) {
                return Nodes.Authentication.LOGIN;
            } else {
                // We know he"s logged-in, but does he have a nft that he wants to view
                let isSecondCachedValue = await Cache.isCachedValue(Cache.CACHE_PET_NONCE);
                if(isSecondCachedValue) {
                    // Alright he has a pet he wants to see but does he still own it?
                    let petNonce = await Cache.getCachedValue(Cache.CACHE_PET_NONCE);
                    if (response.isSuccess() && response.getOwnedNftsNonces().includes(petNonce)) {
                        return Nodes.Pets.HOME_PET;
                    } else {
                        return Nodes.Pets.SELECT_PET;
                    }
                } else {
                    return Nodes.Pets.SELECT_PET;
                }
            }
        } else {
            return Nodes.Authentication.LOGIN;
        }
    }

    render() {
        return this.state.loading ? (null) : (
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}
                        initialRouteName={this.state.initialRoute}
                    >
                        <Stack.Screen name={Nodes.Authentication.REGISTER} component={Register} />
                        <Stack.Screen name={Nodes.Authentication.LOGIN} component={Login} />

                        <Stack.Screen name={Nodes.Pets.SELECT_PET} component={SelectPet} />
                        <Stack.Screen name={Nodes.Pets.HOME_PET} component={HomePet} />
                        <Stack.Screen name={Nodes.Pets.LOTTERY}
                            component={Lottery}
                            options={{
                                presentation: "transparentModal"
                            }}
                        />
                        <Stack.Screen name={Nodes.Pets.LOTTERY_VIEW}
                            component={LotteryPrizeViewer}
                            options={{
                                presentation: "transparentModal"
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        );
        /**
         * <Stack.Screen name={Nodes.Authentication.REGISTER} />

                    <Stack.Screen name={Nodes.Pets.LOTTERY} />
         */
    }
}