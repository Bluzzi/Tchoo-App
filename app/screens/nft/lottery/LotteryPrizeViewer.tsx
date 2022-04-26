import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colours } from "../../../layout/colors/Colours";
import { AppDimensions } from "../../../layout/dimensions/Dimensions";
import { GetLotteryRequest } from "../../../network/lottery/Get";

class LotteryPrizeViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prizes: [],
            pricePerTicket: 0,
        };

        GetLotteryRequest.createAndSend().then((resp) => {
            this.setState({
                prizes: resp.getPrizes(),
                pricePerTicket: resp.getPricePerTicket()
            })
        })
    }

    render() {
        let t = (
            <SafeAreaView style={{ flex: 1, zIndex: 1 }}>
                <View>
                    <View style={{ flex: 1, justifyContent: "flex-end", zIndex: 1 }}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                            style={{ flexGrow: 1 }}
                        ><View style={{ flexGrow: 1 }}/></TouchableWithoutFeedback>

                        
                    </View>
                    
                </View>
            </SafeAreaView>
        );

        return (

            <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: "flex-end", alignItems: "center", backgroundColor: "#00000080" }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                >
                    <View
                        style={{ width: "100%", height: AppDimensions.ContentHeight * 0.65 }}
                    >

                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={{
                        width: "100%", height: AppDimensions.ContentHeight * 0.3,
                        paddingHorizontal: "5%", backgroundColor: Colours.CONTAINER_SUB,
                        justifyContent: "center",
                        alignItems: "flex-start",
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
                    <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(18), color: "white", marginBottom: "5%" }}>TICKET PRICE - {this.state.pricePerTicket} POINTS</Text>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <FlatList
                            data={this.state.prizes}
                            extraData={this.state.prizes}
                            horizontal={true}
                            keyExtractor={(item) => {
                                return item.id
                            }}
                            contentContainerStyle={{ width: AppDimensions.ContentWidth, justifyContent: "center" }}
                            showsHorizontalScrollIndicator={false}
                            renderItem={(item) => {
                                return (
                                    <LotteryPrizeComponent
                                        prize={item.item}
                                    />
                                )
                            }}
                        />
                    </View>
                </View>
                <View
                    style={{
                        width: "100%", height: AppDimensions.ContentHeight * 0.05,
                        backgroundColor: Colours.CONTAINER_SUB, zIndex: 0
                    }}
                />
            </View>
        )
    }
}

export default LotteryPrizeViewer;

class LotteryPrizeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPercent: false,
            contentWidth: AppDimensions.ContentWidth * 0.3
        }
        /**
         * @type {LotteryPrize}
         */
        this.prizeData = props.prize;
    }

    render() {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={{ height: AppDimensions.ContentWidth * 0.35, alignItems: "center", justifyContent: "space-around", zIndex: 0 }}
                    onPress={() => {
                        this.setState({ showPercent: !this.state.showPercent })
                    }}
                    activeOpacity={0.7}
                >
                    {
                        this.state.showPercent ?
                            (<View style={{ borderRadius: 10, justifyContent: "center", alignItems: "center", position: "absolute", backgroundColor: "#00000080", flexGrow: 1, width: this.state.contentWidth, height: AppDimensions.ContentWidth * 0.35, zIndex: 1 }}>
                                <Text
                                    style={{ fontFamily: "Roboto-Bold", fontSize: AppDimensions.fontToScaleFontSize(15), color: "white" }}
                                >{this.prizeData.getPercent()}%</Text>
                            </View>)
                            :
                            (null)
                    }
                    <Image style={{ width: AppDimensions.ContentWidth * 0.25, height: AppDimensions.ContentWidth * 0.25 }} source={{ uri: this.prizeData.getPicture() }} />
                    <Text 
                        style={{ fontFamily: "Roboto-Light", fontSize: AppDimensions.fontToScaleFontSize(15), color: "white" }}
                        onLayout={(e) => {
                            if (e.nativeEvent.layout.width + (e.nativeEvent.layout.width * 0.15) > AppDimensions.ContentWidth * 0.3) {
                                this.setState({ contentWidth: e.nativeEvent.layout.width + (e.nativeEvent.layout.width * 0.15) })
                            }
                        }}
                    >{this.prizeData.getPrize()}</Text>
                </TouchableOpacity>
                <View style={{ width: AppDimensions.ContentWidth * 0.1 }} />
            </View>
        )
    }
}
