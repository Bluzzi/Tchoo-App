import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Cache } from './app/cache_storage/Cache';
import { AppDimensions } from './app/layout/dimensions/Dimensions';
import { GLView } from 'expo-gl';
import ExpoTHREE, { Renderer, THREE } from 'expo-three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GetPetRequest } from './app/network/pets/Get';
import * as FileSystem from 'expo-file-system';

global.THREE = global.THREE || THREE;
import {
  AmbientLight,
  AnimationMixer,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';
import { loadFbxAsync } from './app/three_d/models/Loader';
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
    /**
     * return !this.state.loaded ? (<View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: 'center', alignItems: 'center' }}/>) : (
      <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: 'center', alignItems: 'center' }}>
        <GLView
          style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight }}
          onContextCreate={this._glViewContextCreate}
        />
      </View>
    );
     */
  }

  _glViewContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    this.renderer = new Renderer({ gl });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(sceneColor);

    this.camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    this.camera.position.set(2, 5, 5);

    this.scene = new Scene();
    this.scene.fog = new Fog(sceneColor, 1, 10000);
    this.scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    this.scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    this.scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(this.scene.position);
    this.scene.add(spotLight);

    let nftCacheInfos = Cache.nftCacheInfos(12);
    let nftResponse = await GetPetRequest.createAndSend(12);
    this.nftResponse = nftResponse;
    this.nftCacheInfos = nftCacheInfos;

    console.log((JSON.stringify(nftResponse)))
    this.mesh = await loadFbxAsync({ uri: (await Cache.getCachedFileFromUri(nftCacheInfos.fbx.file, nftCacheInfos.fbx.directory, nftResponse.get3dModel())) })
    Cache.getCachedFileFromUri(this.nftCacheInfos.fbx.file, this.nftCacheInfos.fbx.directory, this.nftResponse.get3dModel()).then((uri) => {
      loadFbxAsync({ uri: uri }).then((fbxAnim) => {
        this.mixer = new ExpoTHREE.THREE.AnimationMixer(this.mesh);

        let idle = this.mixer.clipAction(fbxAnim.animations[0]);
        idle.play();

        this.renderer.render(this.scene, this.camera);
        this.mesh.scale.setScalar(0.045)
        this.scene.add(this.mesh);
    
        this.mesh.position.set(this.camera.position.x, this.camera.position.y - 5, this.camera.position.z - 10)
        this.gl = gl;
        this.animate();
        this.renderer.render(this.scene, this.camera);
        this.gl.endFrameEXP();
      })
    })
  }

  clock = new ExpoTHREE.THREE.Clock()

  animate = () => {
    requestAnimationFrame(this.animate);

    this.mixer.update(this.clock.getDelta())
    this.renderer.render(this.scene, this.camera);
    this.gl.endFrameEXP();
  }
}
export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
