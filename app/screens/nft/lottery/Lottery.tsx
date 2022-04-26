import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Image, Easing, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Colours } from "../../../layout/colors/Colours";
import { AppDimensions } from "../../../layout/dimensions/Dimensions";
import { BuyTicketRequest } from "../../../network/lottery/BuyTicket";
import { GetLotteryRequest, LotteryPrize } from "../../../network/lottery/Get";

const BoxSize = AppDimensions.ContentWidth * 0.275
const Separator = AppDimensions.ContentWidth * 0.1 / 3
class Lottery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zIndexes: [
                0,
                0,
                0,
                0,
            ],

            opacities: [
                1,
                1,
                1,
                1,
            ],

            flipCard: [
                new Animated.Value(0),
                new Animated.Value(0),
                new Animated.Value(0),
                new Animated.Value(0),
            ],
            
            size: [
                new Animated.Value(1),
                new Animated.Value(1),
                new Animated.Value(1),
                new Animated.Value(1),
            ],


            moveAnims: [

                // topLeft
                {
                    x: new Animated.Value(0),
                    y: new Animated.Value(0),
                },

                // topRight
                {
                    x: new Animated.Value(0),
                    y: new Animated.Value(0),
                },

                // bottomLeft
                {
                    x: new Animated.Value(0),
                    y: new Animated.Value(0),
                },

                //bottomRight
                {
                    x: new Animated.Value(0),
                    y: new Animated.Value(0),
                },

            ],

            prize: {},
            allPrizes: [],

            loaded: false,
            hide: false,
            showImage: true,
            revealPrize: false,
            clickable: false,
            indicationText: ""
        };

        let nftNonce = this.props.route.params.nftNonce;
        Promise.all(
            [
                BuyTicketRequest.createAndSend(nftNonce),
                GetLotteryRequest.createAndSend()
            ]
        ).then((responses) => {
            let bTResponse = responses[0];
            let gLResponse = responses[1];

            let winnablePrizes = gLResponse.getPrizes();
            
            let wPrizeIndexes = []
            let wPrize = []
            let nPrize = Math.max(Math.floor(Math.random() * Math.min(winnablePrizes.length, 3)), 1)

            for (let index = 0; index < nPrize; index++) {
                var randomIndex = Math.floor(Math.random() * winnablePrizes.length)

                while (wPrizeIndexes.includes(randomIndex)) {
                    randomIndex = Math.floor(Math.random() * winnablePrizes)
                }             

                wPrizeIndexes.push(randomIndex)
                wPrize.push(winnablePrizes[randomIndex])
            }

            for (let index = 0; index <= 3 - wPrize.length; index++) {
                wPrize.push(new LotteryPrize({ prize: "air", picture: "", percent: 100}))
            }

            this.setState({ prize: bTResponse, prizes: wPrize, loaded: true, allPrizes: [ bTResponse, ...wPrize ].sort( () => Math.random() - 0.5) });
            this.turnCards();
        })
    }

    turnCards() {
        if (this.end) {
            return
        }

        setTimeout(() => {
            this.state.flipCard.forEach((value) => {
                Animated.timing(
                    value,
                    {
                        toValue: 1.5,
                        duration: 250,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }
                ).start(() => {
                    this.end = true;
                    this.setState({ hide: true })
                    Animated.timing(
                        value,
                        {
                            toValue: 3,
                            duration: 250,
                            useNativeDriver: true,
                            easing: Easing.linear,
                        }
                    ).start(this.groupToMiddle.bind(this))
                })
            })
        }, 3000);
    }

    animateValue(value, to, timing = 1000) {
        Animated.timing(
            value,
            {
                toValue: to,
                duration: timing,
                useNativeDriver: true,
            }
        ).start()
    }

    groupToMiddle() {
        let sizeX = AppDimensions.ContentWidth * 0.2;
        sizeX += (AppDimensions.ContentWidth * 0.4) * 0.065

        let sizeY = AppDimensions.ContentWidth * 0.3;
        sizeY += (AppDimensions.ContentWidth * 0.6) * 0.04


        this.state.moveAnims.forEach((value, index) => {
            switch (index) {
                case 0:
                    this.animateValue(value["x"], -sizeX)
                    this.animateValue(value["y"], sizeY)
                    break;
            
                case 1:
                    this.animateValue(value["x"], sizeX)
                    this.animateValue(value["y"], sizeY)
                    break;

                case 2:
                    this.animateValue(value["x"], -sizeX)
                    this.animateValue(value["y"], -sizeY)
                    break;

                case 3:
                    this.animateValue(value["x"], sizeX)
                    this.animateValue(value["y"], -sizeY)
                    break;
            }
        })

        setTimeout(() => {
            this.state.moveAnims.forEach((value, index) => {
                this.animateValue(value["x"], 0)
                this.animateValue(value["y"], 0)
            })

            setTimeout(() => {
                this.setState({ clickable: true, indicationText: "PICK A CARD" })
            }, 1000);
        }, 2500);
    }

    pickCard(index) {
        this.setState({ showImage: false, clickable: false, indicationText: "" })
        let toSize = 2;
        let sizeX = AppDimensions.ContentWidth * 0.2;
        sizeX += (AppDimensions.ContentWidth * 0.4) * 0.065

        let sizeY = AppDimensions.ContentWidth * 0.3;
        sizeY += (AppDimensions.ContentWidth * 0.6) * 0.04

        switch (index) {
            case 0:
                this.animateValue(this.state.moveAnims[0]["x"], -sizeX, 500)
                this.animateValue(this.state.moveAnims[0]["y"], sizeY, 500)
                break;
        
            case 1:
                this.animateValue(this.state.moveAnims[1]["x"], sizeX, 500)
                this.animateValue(this.state.moveAnims[1]["y"], sizeY, 500)
                break;

            case 2:
                this.animateValue(this.state.moveAnims[2]["x"], -sizeX, 500)
                this.animateValue(this.state.moveAnims[2]["y"], -sizeY, 500)
                break;

            case 3:
                this.animateValue(this.state.moveAnims[3]["x"], sizeX, 500)
                this.animateValue(this.state.moveAnims[3]["y"], -sizeY, 500)
                break;
        }

        this.animateValue(this.state.size[index], toSize, 200);

        setTimeout(() => {
            let counter = 0;
            let loopTimeout = () => {
                this.setState({ hide: true })
                Animated.timing(
                    this.state.flipCard[index],
                    {
                        toValue: 4.7,
                        duration: 150 - counter,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }
                ).start(() => {
                    this.setState({ hide: false })

                    Animated.timing(
                        this.state.flipCard[index],
                        {
                            toValue: 3,
                            duration: 150 - counter,
                            useNativeDriver: true,
                            easing: Easing.linear,
                        }
                    ).start(() => {
                        if (counter < 100) {
                            counter += 10;
                            loopTimeout();
                        } else {
                            this.setState({ revealPrize: true, showImage: true, indicationText: this.state.prize.prize == "air" ? "You didn"t win anything... Better luck next time!" : "Congratulations you won " + this.state.prize.prize })
                        }
                    })
                })
            }

            loopTimeout();
        }, 500);
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    if (this.state.revealPrize) {
                        this.props.navigation.goBack();
                    }
                }}
            >
                <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
                <View style={{ 
                    width: "100%", height: AppDimensions.ContentHeight,
                    
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {
                        this.state.loaded ?
                            (
                                [
                                    (
                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", zIndex: Math.max(this.state.zIndexes[0], this.state.zIndexes[1]) }}>
                                            <PrizeCard
                                                prize={this.state.allPrizes[0]} 
                                                style={{
                                                    transform: [
                                                        {
                                                            rotateY: this.state.flipCard[0]
                                                        },
                                                        {
                                                            translateX: this.state.moveAnims[0]["x"]
                                                        },
                                                        {
                                                            translateY: this.state.moveAnims[0]["y"]
                                                        },
                                                        {
                                                            scaleX: this.state.size[0]
                                                        },
                                                        {
                                                            scaleY: this.state.size[0]
                                                        },
                                                    ],
                                                    zIndex: this.state.zIndexes[0],
                                                    opacity: this.state.opacities[0]
                                                }}
                                                hide={this.state.hide}
                                                clickable={this.state.clickable}
                                                showImage={this.state.showImage}
                                                revealPrize={this.state.revealPrize}
                                                wonPrize={this.state.prize}

                                                onReveal={() => {
                                                    this.setState({ 
                                                        zIndexes: [1, 0, 0, 0],
                                                        opacities: [1, 0, 0, 0],
                                                    })
                                                    this.pickCard(0);
                                                }}
                                                key={"1"}
                                            />

                                            <PrizeCard 
                                                prize={this.state.allPrizes[1]}
                                                style={{
                                                    transform: [
                                                        {
                                                            rotateY: this.state.flipCard[1]
                                                        },
                                                        {
                                                            translateX: this.state.moveAnims[1]["x"]
                                                        },
                                                        {
                                                            translateY: this.state.moveAnims[1]["y"]
                                                        },
                                                        {
                                                            scaleX: this.state.size[1]
                                                        },
                                                        {
                                                            scaleY: this.state.size[1]
                                                        },
                                                    ],
                                                    zIndex: this.state.zIndexes[1],
                                                    opacity: this.state.opacities[1]

                                                }}
                                                hide={this.state.hide}
                                                clickable={this.state.clickable}
                                                showImage={this.state.showImage}
                                                revealPrize={this.state.revealPrize}
                                                wonPrize={this.state.prize}

                                                onReveal={() => {
                                                    this.setState({ 
                                                        zIndexes: [0, 1, 0, 0],
                                                        opacities: [0, 1, 0, 0],
                                                    })
                                                    this.pickCard(1);
                                                }}
                                                key={"2"}

                                            />
                                        </View>
                                    ),
                                    (
                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", zIndex: Math.max(this.state.zIndexes[2], this.state.zIndexes[3]) }}>
                                            <PrizeCard 
                                                prize={this.state.allPrizes[2]} 
                                                style={{
                                                    transform: [
                                                        {
                                                            rotateY: this.state.flipCard[2]
                                                        },
                                                        {
                                                            translateX: this.state.moveAnims[2]["x"]
                                                        },
                                                        {
                                                            translateY: this.state.moveAnims[2]["y"]
                                                        },
                                                        {
                                                            scaleX: this.state.size[2]
                                                        },
                                                        {
                                                            scaleY: this.state.size[2]
                                                        },
                                                    ],
                                                    zIndex: this.state.zIndexes[2],
                                                    opacity: this.state.opacities[2]

                                                }}
                                                hide={this.state.hide}
                                                clickable={this.state.clickable}
                                                showImage={this.state.showImage}
                                                revealPrize={this.state.revealPrize}
                                                wonPrize={this.state.prize}
                                                onReveal={() => {
                                                    this.setState({ 
                                                        zIndexes: [0, 0, 1, 0],
                                                        opacities: [0, 0, 1, 0],
                                                    })
                                                    this.pickCard(2);
                                                }}

                                                key={"3"}

                                            />

                                            <PrizeCard
                                                prize={this.state.allPrizes[3]}
                                                style={{
                                                    transform: [
                                                        {
                                                            rotateY: this.state.flipCard[3]
                                                        },
                                                        {
                                                            translateX: this.state.moveAnims[3]["x"]
                                                        },
                                                        {
                                                            translateY: this.state.moveAnims[3]["y"]
                                                        },
                                                        {
                                                            scaleX: this.state.size[3]
                                                        },
                                                        {
                                                            scaleY: this.state.size[3]
                                                        },
                                                    ],
                                                    zIndex: this.state.zIndexes[3],
                                                    opacity: this.state.opacities[3]

                                                }}
                                                hide={this.state.hide}
                                                clickable={this.state.clickable}
                                                showImage={this.state.showImage}
                                                revealPrize={this.state.revealPrize}
                                                wonPrize={this.state.prize}
                                                onReveal={() => {
                                                    this.setState({ 
                                                        zIndexes: [0, 0, 0, 1],
                                                        opacities: [0, 0, 0, 1],
                                                    })
                                                    this.pickCard(3);
                                                }}

                                                key={"4"}

                                            />
                                        </View>
                                    )
                                ]
                            )
                            :
                            (<View key="vide"/>)
                    }
                    <Text key="text" style={{ fontSize: AppDimensions.fontToScaleFontSize(20), color: "white", fontFamily: "RedHatDisplay-SemiBold", textAlign: "center" }}>{this.state.indicationText}</Text>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

class PrizeCard extends Component {
    constructor(props) {
        super(props);
    }

    getPicture(key, picture) {
        return key == "air" ? require("../../../../assets/images/empty.png") : { uri: picture }
    }
    render() {
        return (
            <Animated.View style={{
                width: AppDimensions.ContentWidth * 0.4, height: AppDimensions.ContentWidth * 0.6,
                justifyContent: "space-around",
                alignItems: "center",
                shadowColor: "#fff",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.15,
                shadowRadius: 2.84,
                elevation: 5,
                margin: "2.5%",
                ...this.props.style
            }}>

                <TouchableOpacity
                    style={{
                        width: AppDimensions.ContentWidth * 0.4, height: AppDimensions.ContentWidth * 0.6,
                        justifyContent: "space-around",
                        alignItems: "center",
                        backgroundColor: this.props.hide ? Colours.SECONDARY_BACKGROUND : Colours.CONTAINER, borderRadius: 10,
                    }}
                    onPress={this.props.onReveal}
                    activeOpacity={0.7}
                    disabled={!this.props.clickable}
                >
                    {
                        this.props.hide || !this.props.showImage ?
                            (<View />)
                            :
                            (<Image
                                style={{
                                    width: AppDimensions.ContentWidth * (this.props.prize.prize == "air" ? 0.15 : this.props.wonPrize.prize == "air" && this.props.revealPrize ? 0.15 : 0.35) * (this.props.revealPrize ? 0.8 : 1),
                                    height: AppDimensions.ContentWidth * (this.props.prize.prize == "air" ? 0.15 : this.props.wonPrize.prize == "air" && this.props.revealPrize ? 0.15 : 0.35) * (this.props.revealPrize ? 0.8 : 1),
                                    borderRadius: 10,
                                    opacity: this.props.prize.prize == "air" ? 0.5 : 0.7
                                }}
                                source={this.props.revealPrize ? this.getPicture(this.props.wonPrize.prize, this.props.wonPrize.getPicture()) : this.getPicture(this.props.prize.prize, this.props.prize.getPicture())}
                            />)
                    }
                </TouchableOpacity>

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 25,
        borderRightWidth: 25,
        borderBottomWidth: 50,
        borderRadius: 25,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: Colours.TEXT_IMPORTANT,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,

        elevation: 3,
    },
});

export default Lottery;
