import React, { Component } from "react";
import { View, Text, ScrollView, RefreshControl, FlatList, Image, TouchableOpacity } from "react-native";
import { Colours } from "../../../layout/colors/Colours";
import { AppDimensions } from "../../../layout/dimensions/Dimensions";
import { GetOwnedRequest } from "../../../network/pets/GetOwned";
import { Cache } from "../../../cache_storage/Cache";
import { StackActions } from "@react-navigation/native";
import { Nodes } from "../../../Navigation";

class SelectPet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownedPets: [],
      loaded: false,
      refreshing: true,
      errorCode: -1,
    };

    this.fetchOwnedPets();
  }

  fetchOwnedPets() {
    GetOwnedRequest.createAndSend().then(async function (getOwnedResponse) {
      if (getOwnedResponse.isSuccess()) {
        if (getOwnedResponse.getOwnedNftsNonces().length > 0) {
          this.setState({ ownedPets: (await getOwnedResponse.getNftData()), errorCode: -1 })
        } else {
          this.setState({ errorCode: 1 })
        }
      } else {
        this.setState({ errorCode: 0 })
      }

      this.setState({ loaded: true, refreshing: false })
    }.bind(this))
  }
  
  render() {
    return (
      <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, backgroundColor: Colours.BACKGROUND }}>
        <View style={{ width: "100%", height: "30%", backgroundColor: Colours.SECONDARY_BACKGROUND, justifyContent: "center", alignItems: "center", paddingTop: "10%" }}>
          <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(45), fontFamily: "ReemKufi-Bold", color: Colours.TEXT_IMPORTANT }}>SELECT A PET</Text>
          <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(20), fontFamily: "ReemKufi-Bold", color: Colours.TEXT_IMPORTANT_SUB }}>YOU OWN {this.state.ownedPets.length} PET{this.state.ownedPets.length > 1 ? "S" : ""}</Text>
        
        </View>
        <ScrollView 
          style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight * 0.7, backgroundColor: Colours.SECONDARY_BACKGROUND }}
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.fetchOwnedPets.bind(this)}
            tintColor={"white"}
          />}
          decelerationRate={0}
        >
          <View 
            style={{ 
              width: AppDimensions.ContentWidth, minHeight: AppDimensions.ContentHeight * 0.7, 
              backgroundColor: Colours.BACKGROUND,
              justifyContent: this.state.errorCode == -1 ? "flex-start" : "center",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}
          >
            {
              this.state.errorCode == -1 ?
                (
                  <FlatList
                    style={{ width: AppDimensions.ContentWidth, borderTopRightRadius: 15,
                      borderTopLeftRadius: 15, }}
                    contentContainerStyle={{ alignItems: "center", borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,  }}
                    data={this.state.ownedPets}
                    decelerationRate={0}
                    
                    renderItem={(item) => {
                      // Cache the picture:
                      Cache.getCachedFileFromUri(item.item.getNonce() + "_picture.png", "", item.item.getTwoDPicture())
                      return (
                        <TouchableOpacity 
                          style={{
                            marginTop: "10%", borderRadius: 10,
                            overflow: "hidden",
                            width: AppDimensions.ContentWidth * 0.8,
                            shadowColor: "#fff",
                            shadowOffset: {
                              width: 2,
                              height: 7,
                            },
                            shadowOpacity: 0.41,
                            shadowRadius: 9.11,
                            elevation: 14,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.props.navigation.dispatch(StackActions.push(Nodes.Pets.HOME_PET, { nftNonce: item.item.getNonce() }))
                          }}
                        >
                          <Image style={{ width: AppDimensions.ContentWidth * 0.8, height: AppDimensions.ContentWidth * 0.8 }} source={{ uri: item.item.getTwoDPicture() }}/>
                          
                          <View style={{ width: "100%", height: AppDimensions.ContentWidth * 0.14, backgroundColor: Colours.CONTAINER, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                            <Text style={{ fontFamily: "RedHatDisplay-Light", fontSize: AppDimensions.fontToScaleFontSize(20), color: "white" }}>{item.item.getName()}</Text>
                            <Text style={{ fontFamily: "RedHatDisplay-Regular", fontSize: AppDimensions.fontToScaleFontSize(20), color: "white" }}>
                              <Text style={{ fontFamily: "RedHatDisplay-Regular", fontSize: AppDimensions.fontToScaleFontSize(20), color: "white" }}>
                                PRESTIGE
                              </Text>
                              <Text style={{ fontFamily: "RedHatDisplay-Light", fontSize: AppDimensions.fontToScaleFontSize(20), color: "white" }}>{" " + item.item.getPrestigeBalance()}</Text>
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                  />
                )
                :
                (
                  this.state.errorCode == 1 ?
                    (
                      <View style={{ width: AppDimensions.ContentWidth, justifyContent: "center", alignItems: "center" }}>
                        <Image
                          style={{ width: AppDimensions.ContentWidth * 0.25, height: AppDimensions.ContentWidth * 0.25, marginBottom: "5%" }}
                          source={require("../../../../assets/images/error_no_nfts.png")}
                        />

                        <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(19), fontFamily: "RedHatDisplay-Regular", paddingHorizontal: "10%", textAlign: "center" }}>
                          <Text style={{ color: "white" }}>You don’t have a NFT, buy one </Text>
                          <Text style={{ color: "#F9A4B5" }} onPress={() => { }}>here</Text>
                          <Text style={{ color: "white" }}> and come back to the application</Text>
                        </Text>
                      </View>
                    )
                    :
                    (
                      <View style={{ width: AppDimensions.ContentWidth, justifyContent: "center", alignItems: "center" }}>
                        <Image
                          style={{ width: AppDimensions.ContentWidth * 0.25, height: AppDimensions.ContentWidth * 0.25, marginBottom: "5%" }}
                          source={require("../../../../assets/images/error_no_wallet.png")}
                        />

                        <Text style={{ fontSize: AppDimensions.fontToScaleFontSize(19), fontFamily: "RedHatDisplay-Regular", paddingHorizontal: "10%", textAlign: "center" }}>
                          <Text style={{ color: "white" }}>Link your wallet with your account </Text>
                          <Text style={{ color: "#F9A4B5" }} onPress={() => { }}>here</Text>
                          <Text style={{ color: "white" }}> and come back to the application</Text>
                        </Text>
                      </View>
                    )
                )
            }
          </View>
          <View style={{ width: "100%", height: AppDimensions.ContentHeight * 0.2, backgroundColor: Colours.BACKGROUND }}></View>
        </ScrollView>
      </View>
    );
  }
}

export default SelectPet;
