import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Cache } from './app/cache_storage/Cache';
import { AppDimensions } from './app/layout/dimensions/Dimensions';
import { THREE } from 'expo-three';


global.THREE = global.THREE || THREE;
import { Navigation } from './app/Navigation';
import * as Font from 'expo-font';
import Notifications from './app/screens/notifications/Notifications';
console.log = () => {}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }

    Promise.all([
      Cache.setupCacheWorkspace(),
      Font.loadAsync({
        'ReemKufi-Bold': require('./assets/fonts/ReemKufi-Bold.ttf'),
        'ReemKufi-Medium': require('./assets/fonts/ReemKufi-Medium.ttf'),
        'ReemKufi-Regular': require('./assets/fonts/ReemKufi-Regular.ttf'),
        'ReemKufi-SemiBold': require('./assets/fonts/ReemKufi-SemiBold.ttf'),

        'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),

        'RedHatDisplay-Black': require('./assets/fonts/RedHatDisplay-Black.ttf'),
        'RedHatDisplay-Bold': require('./assets/fonts/RedHatDisplay-Bold.ttf'),
        'RedHatDisplay-ExtraBold': require('./assets/fonts/RedHatDisplay-ExtraBold.ttf'),
        'RedHatDisplay-Light': require('./assets/fonts/RedHatDisplay-Light.ttf'),
        'RedHatDisplay-Regular': require('./assets/fonts/RedHatDisplay-Regular.ttf'),
        'RedHatDisplay-SemiBold': require('./assets/fonts/RedHatDisplay-SemiBold.ttf'),
      })
    ]).then(() => {
      this.setState({ loaded: true })
    })
  }

  render() {
    return this.state.loaded ? (
      <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight}}>
        <Navigation />
        <Notifications/>
      </View>
    ) : (<View style={{ backgroundColor: 'blue' }} />)
  }
}
export default App;