import { StackActions } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cache } from '../../../cache_storage/Cache';
import { Colours } from '../../../layout/colors/Colours';
import { AppDimensions } from '../../../layout/dimensions/Dimensions';
import { Nodes } from '../../../Navigation';
import { GetLotteryRequest } from '../../../network/lottery/Get';
import { GetPetRequest } from '../../../network/pets/Get';
import { FeedInteractionRequest } from '../../../network/pets/interactions/Feed';
import { SleepInteractionRequest } from '../../../network/pets/interactions/Sleep';
import { WashInteractionRequest } from '../../../network/pets/interactions/Wash';
import { NftObject } from '../../../network/pets/NftObject';
import Notifications from '../../notifications/Notifications';
import GlView from './gl/GlView';

class HomePet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            nftObject: {},
            rotationSwitch: false,
            rotation: new Animated.Value(0)
        };
        this.updateNftData();
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.updateNftData();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    updateNftData() {
        let nftNonce = this.props.route.params.nftNonce;
        Promise.all([
            GetPetRequest.createAndSend(nftNonce),
            GetLotteryRequest.createAndSend(),
        ]).then(promisesResponses => {
            this.setState({ loaded: true, nftObject: promisesResponses[0], lotterySpecs: promisesResponses[1] });
        });
    }
    render() {
        let AnimatedImage = Animated.createAnimatedComponent(Image);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colours.BACKGROUND, zIndex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', zIndex: 1 }}>
                    <View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.1, paddingHorizontal: '5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15%' }}>
                        <TouchableOpacity 
                            style={{ width: AppDimensions.ContentWidth * 0.1, height: AppDimensions.ContentWidth * 0.1 }}
                            onPress={() => {
                                this.props.navigation.navigate(Nodes.Pets.SELECT_PET)
                            }}
                        >
                            <Image style={{ width: '100%', height: '100%' }} source={require('../../../../assets/images/back.png')} />
                        </TouchableOpacity>

                        <Text style={{ color: 'white', fontFamily: 'RedHatDisplay-Regular', fontSize: AppDimensions.fontToScaleFontSize(30) }}> {this.state.loaded ? this.state.nftObject.getName() : '...'} </Text>
                    
                        <TouchableOpacity 
                            style={{ width: AppDimensions.ContentWidth * 0.1, height: AppDimensions.ContentWidth * 0.1 }}
                            onPress={() => {
                                this.props.navigation.navigate(Nodes.Pets.LOTTERY_VIEW)
                            }}
                        >
                            <Image style={{ width: '100%', height: '100%' }} source={require('../../../../assets/images/lottery.png')} />
                        </TouchableOpacity>
                    </View>

                    {
                        this.state.loaded ?
                            (<View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.5 }}>
                                <GlView
                                    nftData={this.state.nftObject}
                                />
                            </View>)
                            :
                            (<View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="white" />
                            </View>)
                    }

                    <Animated.View
                        style={{
                            width: '100%',
                            paddingHorizontal: '5%', backgroundColor: Colours.CONTAINER_SUB,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: this.state.rotation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-AppDimensions.ContentHeight * 0.2, AppDimensions.ContentHeight * 0.07]
                            }),
                            borderTopLeftRadius: 5, borderTopRightRadius: 5,
                            shadowColor: Colours.TEXT_IMPORTANT,
                            shadowOffset: {
                                width: 0,
                                height: -8,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 6.27,

                            elevation: 10,
                        }}
                    >
                        {
                            this.state.loaded ?
                                [
                                    (
                                        <View style={{
                                            height: AppDimensions.ContentHeight * 0.25, 
                                            flexDirection: 'row', width: AppDimensions.ContentWidth,
                                            zIndex: 0, alignItems: 'center'
                                        }}>
                                            <View
                                                style={{
                                                    position: 'absolute', top: AppDimensions.ContentWidth * 0.025, right: AppDimensions.ContentWidth * 0.025, zIndex: 1,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        width: AppDimensions.ContentWidth * 0.075, height: AppDimensions.ContentWidth * 0.075,
                                                        borderRadius: AppDimensions.ContentWidth * 0.03525,
                                                        backgroundColor: '#29272B',
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 0,
                                                        },
                                                        shadowOpacity: 0.32,
                                                        shadowRadius: 5.46,

                                                        elevation: 9,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}

                                                    onPress={() => {
                                                        if (this.state.rotation._value != 0) {
                                                            this.setState({ rotationSwitch: false })
                                                        } else {
                                                            this.setState({ rotationSwitch: true })
                                                        }

                                                        Animated.timing(
                                                            this.state.rotation,
                                                            {
                                                                toValue: this.state.rotation._value == 0 ? 0.5 : 0,
                                                                duration: 250,
                                                                useNativeDriver: false,
                                                                easing: Easing.linear
                                                            }
                                                        ).start(() => {})
                                                    }}
                                                >
                                                    <AnimatedImage
                                                        style={{
                                                            width: '60%', height: '60%',
                                                            transform: [
                                                                {
                                                                    rotateZ: this.state.rotation.interpolate({
                                                                        inputRange: [0, 1],
                                                                        outputRange: ["0deg", "360deg"]
                                                                    })
                                                                }
                                                            ]
                                                        }}
                                                        source={this.state.rotationSwitch ? require("../../../../assets/images/arrow_down.png") : require("../../../../assets/images/arrow_up.png")}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '100%', zIndex: 0, overflow: 'visible', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: AppDimensions.ContentWidth }}>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                    }}
                                                    onPress={() => {
                                                        FeedInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then((response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                                Notifications.pushNotification('Fed your pet!')
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/feed.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_FEED] > Date.now() / 1000}
                                                    text="FEED"
                                                />

                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                    }}
                                                    onPress={() => {
                                                        WashInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then((response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                                Notifications.pushNotification('Your pet is now clean!')
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/wash.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_WASH] > Date.now() / 1000}
                                                    text="WASH"
                                                />

                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                    }}
                                                    onPress={() => {
                                                        SleepInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then(async (response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                                Cache.setCachedValue(Cache.CACHE_PET_SLEEPING, JSON.stringify(!((await Cache.getCachedValue(Cache.CACHE_PET_SLEEPING)) == 'true')))
                                                                Notifications.pushNotification(!((await Cache.getCachedValue(Cache.CACHE_PET_SLEEPING)) == 'true') ? 'Your pet is now sleeping' : 'Your pet is now awake')
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/wake.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_SLEEP] > Date.now() / 1000}
                                                    text="WAKE"
                                                />

                                                <TouchableOpacity
                                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        this.props.navigation.dispatch(StackActions.push(Nodes.Pets.LOTTERY, { nftNonce: this.props.route.params.nftNonce }));
                                                        this.updateNftData();
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: AppDimensions.ContentWidth * 0.16,
                                                            height: AppDimensions.ContentWidth * 0.16,
                                                            borderRadius: AppDimensions.ContentWidth * 0.03,
                                                            backgroundColor: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? '#D5E8EE' : '#D3D3D3',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                            shadowColor: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? "#fff" : "#00000000",
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 0,
                                                            },
                                                            marginBottom: AppDimensions.ContentWidth * 0.02,
                                                            shadowOpacity: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? 0.25 : 0,
                                                            shadowRadius: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? 10.84 : 0,
                                                        }}
                                                        disabled={this.state.nftObject.getPointsBalance() < this.state.lotterySpecs.getPricePerTicket()}
                                                    >
                                                        <Image
                                                            style={{ width: '55%', height: '55%', opacity: this.props.disabled ? 0.5 : 1 }}
                                                            source={require("../../../../assets/images/lottery-ticket.png")}
                                                        />
                                                    </View>
                                                    <Text style={{ color: '#699BF7', fontSize: AppDimensions.fontToScaleFontSize(13), fontFamily: 'RedHatDisplay-Regular' }}>BUY LOTTERY TICKET</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ width: 0, height: '100%', overflow: 'visible', }}>
                                                {/*  */}


                                            </View>
                                        </View>
                                    ),
                                    (
                                        <View
                                            style={{
                                                width: AppDimensions.ContentWidth,
                                                backgroundColor: '#222122',
                                                alignItems: 'flex-start',
                                                paddingHorizontal: '6%'
                                            }}
                                        >
                                            <View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.01}}/>
                                            <View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.05, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular' }}>
                                                    <Text style={{ color: 'white' }}>LP PER FIVE MINUTES - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPointsPerFiveMinutesReal()}</Text>
                                                </Text>

                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular' }}>
                                                    <Text style={{ color: 'white' }}>LOTTERY POINTS - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPointsBalance()}</Text>
                                                </Text>
                                            </View>

                                            <View style={{ width: '50%', height: AppDimensions.ContentHeight * 0.05, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular' }}>
                                                    <Text style={{ color: 'white' }}>PRESTIGE POINTS - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPrestigeBalance()}</Text>
                                                </Text>
                                            </View>
                                            <View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.05}}/>
                                        </View>
                                    )
                                ]
                                :
                                (<ActivityIndicator size="small" color="white" />)
                        }
                    </Animated.View>
                </View>
                <View
                    style={{
                        width: '100%', height: AppDimensions.ContentHeight * 0.1,
                        position: 'absolute', bottom: -10, backgroundColor: Colours.CONTAINER_SUB, zIndex: 0
                    }}
                />

            </SafeAreaView>
        );
    }
}

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={{
                        width: AppDimensions.ContentWidth * 0.152, height: AppDimensions.ContentWidth * 0.152, borderRadius: AppDimensions.ContentWidth * 0.075,
                        justifyContent: 'center', alignItems: 'center',
                        shadowColor: this.props.disabled ? "#00000000" : "#fff",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: this.props.disabled ? 0.25 : 0,
                        shadowRadius: this.props.disabled ? 5.84 : 0,

                        elevation: this.props.disabled ? 6 : 0,
                        ...this.props.style,
                        backgroundColor: this.props.disabled ? '#D3D3D3' : this.props.style.backgroundColor,
                        marginBottom: AppDimensions.ContentWidth * 0.02
                    }}
                    onPress={this.props.onPress}
                    activeOpacity={0.8}
                    disabled={this.props.disabled}
                >
                    <Image
                        style={{ width: '50%', height: '50%', opacity: this.props.disabled ? 0.5 : 1 }}
                        source={this.props.source}
                    />
                </TouchableOpacity>
                <Text style={{ color: Colours.TEXT_IMPORTANT, fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular' }}>{this.props.text}</Text>
            </View>
        )
    }
}
export default HomePet;
