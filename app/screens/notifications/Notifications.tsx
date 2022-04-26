import React, { Component } from "react";
import { View, Text, Animated, Image } from "react-native";
import { AppDimensions } from "../../layout/dimensions/Dimensions";

class Notifications extends Component {
    static Instance;

    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };

        Notifications.Instance = this;
        this.notificationQueue = [];
        this.animationPlaying = false;
        this.notificationValue = new Animated.Value(-AppDimensions.ContentHeight * 0.1);
    }

    static pushNotification(message) {
        Notifications.Instance.notificationQueue.push(
            {
                message: message
            }
        )
    }

    componentDidMount() {
        this.notificationShowRoutine = setInterval(() => {
            if (this.notificationQueue.length > 0)  {
                if (!this.animationPlaying) {
                    this.playAnimation(this.notificationQueue[0])
                    this.notificationQueue.shift();
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.notificationShowRoutine)
    }

    playAnimation(notification) {
        this.animationPlaying = true;
        this.setState({ text: notification["message"] })
        Animated.timing(
            this.notificationValue,
            {
                duration: 500,
                toValue: AppDimensions.ContentHeight * 0.04,
                useNativeDriver: true,
            }
        ).start(() => {
            setTimeout(() => {
                Animated.timing(
                    this.notificationValue,
                    {
                        duration: 500,
                        toValue: -AppDimensions.ContentHeight * 0.1,
                        useNativeDriver: true,
                    }
                ).start(() => {
                    this.animationPlaying = false;
                })
            }, 1500)
        })
    }

    render() {
        return (
            <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight * 0.1, justifyContent: "center", alignItems: "center", position: "absolute"}}>
                <Animated.View
                    style={{
                        width: AppDimensions.ContentWidth * 0.9, height: AppDimensions.ContentHeight * 0.08,
                        flexDirection: "row", borderRadius: 5,
                        backgroundColor: "#110f12",
                        transform: [
                            {
                                translateY: this.notificationValue
                            }
                        ],
                        shadowColor: "white",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }}
                >
                    <View style={{ width: AppDimensions.ContentWidth * 0.15, height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Image style={{ width: AppDimensions.ContentWidth * 0.075, height: AppDimensions.ContentWidth * 0.075 }} source={require("../../../assets/images/notification_information.png")}/>
                    </View>
                    <View style={{ width: AppDimensions.ContentWidth * 0.75, height: "100%", justifyContent: "center", paddingVertical: "2%" }}>
                        <Text style={{ color: "white", fontFamily: "RedHatDisplay-Regular", fontSize: AppDimensions.fontToScaleFontSize(16) }}>
                            {this.state.text}
                        </Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

export default Notifications;
