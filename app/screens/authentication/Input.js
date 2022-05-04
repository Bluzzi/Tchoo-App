import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AppDimensions } from '../../layout/dimensions/Dimensions';

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorText: ""
        }
    }

    render() {
        return (
            <View style={{ width: AppDimensions.ContentWidth * 0.9 }}>
                <TextInput
                    style={{ 
                        width: '100%', height: AppDimensions.ContentHeight * 0.057, borderRadius: 6,
                        paddingLeft: '5%',
                        color: 'black',
                        marginBottom: '2.5%', backgroundColor: '#F3EFF6',
                        fontFamily: 'Roboto-Regular', fontSize: AppDimensions.fontToScaleFontSize(15),
                        borderWidth: this.state.errorText != "" ? 1 : 0,
                        borderColor: '#E33D3D'
                    }}
                    placeholderTextColor='#737373'
                    placeholder={this.props.placeholder}
                    onChangeText={(text) => {
                        this.props.onChangeText(text);
                        if (this.state.errorText != "") this.setState({ errorText: "" })
                    }}
                    {...this.props.textInputProps}
                />
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: AppDimensions.fontToScaleFontSize(15), color: 'white' }}>{this.props.label}</Text>
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: AppDimensions.fontToScaleFontSize(13), color: '#E33D3D' }}>{this.state.errorText}</Text>
                </View>
            </View>
        );
    }

    showError(text) {
        this.setState({ errorText: text })
    }
}

export default Input;
