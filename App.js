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
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
    Cache.setupCacheWorkspace().then(() => {
      this.setState({ loaded: true })
    })
  }

  render() {
    return !this.state.loaded ? (<View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: 'center', alignItems: 'center' }}/>) : (
      <View style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight, justifyContent: 'center', alignItems: 'center' }}>
        <GLView
          style={{ width: AppDimensions.ContentWidth, height: AppDimensions.ContentHeight }}
          onContextCreate={this._glViewContextCreate}
        />
      </View>
    );
  }

  _glViewContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    let nftCacheInfos = Cache.nftCacheInfos(12);
    let nftResponse = await GetPetRequest.createAndSend(12);
    console.log((JSON.stringify(nftResponse)))
    let modelObjCacheUri = await Cache.getCachedFileFromUri(nftCacheInfos.obj.file, nftCacheInfos.obj.directory, nftResponse.get3dModel())
    let modelMtlCacheUri = await Cache.getCachedFileFromUri(nftCacheInfos.mtl.file, nftCacheInfos.mtl.directory, nftResponse.getModelMtl())
    const model = {
      'tgm.obj': modelObjCacheUri,
      'tgm.mtl': modelMtlCacheUri,
    };

    /// Load model!
    const mesh = await ExpoTHREE.loadAsync(
      [model['tgm.obj'], model['tgm.mtl']],
      null,
      name => model[name],
    );

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 5);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    scene.add(mesh);

    mesh.position.set(camera.position.x, camera.position.y - 3, camera.position.z - 10)
    mesh.rotation.x -= 1.5
    renderer.render(scene, camera);
    gl.endFrameEXP();

    console.log(typeof mesh)
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
