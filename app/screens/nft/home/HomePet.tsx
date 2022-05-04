import { StackActions } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
            nftObject: {}
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
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colours.BACKGROUND, zIndex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'space-between', zIndex: 1 }}>
                    <View style={{ width: '100%', height: AppDimensions.ContentHeight * 0.1, paddingHorizontal: '5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                <ActivityIndicator size="large" color="white"/>
                            </View>)
                    }

                    <View 
                        style={{ 
                            width: '100%', height: AppDimensions.ContentHeight * 0.25,
                            paddingHorizontal: '5%', backgroundColor: Colours.CONTAINER_SUB,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
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
                                (
                                    <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                                        <View style={{ width: '40%', height: '100%', overflow: 'visible' }}>
                                            <View style={{ width: '100%', height: '50%', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                    }}
                                                    onPress={() => {
                                                        FeedInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then((response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/feed.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_FEED] > Date.now() / 1000}
                                                />
                                            </View>
                                            <View style={{ width: '100%', height: '50%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', overflow: 'visible', }}>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                    }}
                                                    onPress={() => {
                                                        WashInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then((response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/wash.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_WASH] > Date.now() / 1000}
                                                />

                                                <Button
                                                    style={{
                                                        backgroundColor: '#EED5DA',
                                                        marginLeft: '5%'
                                                    }}
                                                    onPress={() => {
                                                        SleepInteractionRequest.createAndSend(this.state.nftObject.getNonce()).then((response) => {
                                                            if (response.isSuccess()) {
                                                                this.updateNftData();
                                                            } else {
                                                                Notifications.pushNotification(response.getErrorText())
                                                            }
                                                        })
                                                    }}
                                                    source={require('../../../../assets/images/wake.png')}
                                                    disabled={this.state.nftObject.getActionsUsed()[NftObject.ACTION_SLEEP] > Date.now() / 1000}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ width: '60%', height: '100%', overflow: 'visible', }}>
                                            <View style={{ width: '100%', height: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular', marginTop: '12%' }}>
                                                    <Text style={{ color: 'white' }}>LP PER FIVE MINUTES - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPointsPerFiveMinutesReal()}</Text>
                                                </Text>

                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular', marginTop: '2%' }}>
                                                    <Text style={{ color: 'white' }}>LOTTERY POINTS - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPointsBalance()}</Text>
                                                </Text>

                                                <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular', marginTop: '2%' }}>
                                                    <Text style={{ color: 'white' }}>PRESTIGE POINTS - </Text>
                                                    <Text style={{ color: Colours.TEXT_IMPORTANT }}>{this.state.nftObject.getPrestigeBalance()}</Text>
                                                </Text>
                                            </View>

                                            <View style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    style={{
                                                        width: '80%', height: '70%',
                                                        borderRadius: 5, backgroundColor: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? '#D5E8EE' : '#D3D3D3',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        shadowColor: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? "#fff" : "#00000000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 0,
                                                        },
                                                        shadowOpacity: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? 0.25 : 0,
                                                        shadowRadius: this.state.nftObject.getPointsBalance() > this.state.lotterySpecs.getPricePerTicket() ? 10.84 : 0,
                                                    }}
                                                    disabled={this.state.nftObject.getPointsBalance() < this.state.lotterySpecs.getPricePerTicket()}
                                                    onPress={() => {
                                                        this.props.navigation.dispatch(StackActions.push(Nodes.Pets.LOTTERY, { nftNonce: this.props.route.params.nftNonce }));
                                                        this.updateNftData();
                                                    }}
                                                >
                                                    <Text style={{ color: '#699BF7', fontSize: AppDimensions.fontToScaleFontSize(15), fontFamily: 'RedHatDisplay-Regular' }}>BUY LOTTERY TICKET</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                                :
                                (<ActivityIndicator size="small" color="white"/>)
                        }
                    </View>
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
            <TouchableOpacity 
                style={{ 
                    width: AppDimensions.ContentWidth * 0.16, height: AppDimensions.ContentWidth * 0.16, borderRadius: AppDimensions.ContentWidth * 0.08,
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: this.props.disabled ? "#00000000": "#fff",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: this.props.disabled ? 0.25 : 0,
                    shadowRadius: this.props.disabled ? 5.84 : 0,

                    elevation: this.props.disabled ? 6 : 0,
                    ...this.props.style,
                    backgroundColor: this.props.disabled ? '#D3D3D3' : this.props.style.backgroundColor
                }}
                onPress={this.props.onPress}
                activeOpacity={0.8}
                disabled={this.props.disabled}
            >
                <Image
                    style={{ width: '55%', height: '55%', opacity: this.props.disabled ? 0.5 : 1 }}
                    source={this.props.source}
                />
            </TouchableOpacity>
        )
    }
}
export default HomePet;
