import { GLView } from 'expo-gl';
import React, { Component } from 'react';
import { View, Text, PanResponder, Platform, Animated } from 'react-native';
import ExpoTHREE, { Renderer, THREE } from 'expo-three';
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
import { Cache } from '../../../../cache_storage/Cache';
import { loadFbxAsync } from '../../../../three_d/models/Loader';
import { AppDimensions } from '../../../../layout/dimensions/Dimensions';
import { PetInteractionRequest } from '../../../../network/pets/interactions/Pet';
import Notifications from '../../../notifications/Notifications';
import * as Haptics from 'expo-haptics';

class GlView extends Component {
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
            this.addHeart(e);
        },
        onPanResponderMove: (e, gS) => { 
            this.addHeart(e);
        },
        onPanResponderRelease: () => {
        }
    });

    addHeart(e) {
        if(!this.canAddHeart) {
            return;
        }
        if (Platform.OS != 'web') {
            Haptics.selectionAsync()
        }
        
        this.canAddHeart = false;

        let scale = ((Math.random() / 5))
        var yValue = new Animated.Value(0)
        var opacityValue = new Animated.Value(Math.random())

        var y = e.nativeEvent.locationY
        var x = e.nativeEvent.locationX

        var index = this.state.heartAnimations.push(
            <Animated.Image
                style={{
                    width: AppDimensions.ContentWidth * scale,
                    height: AppDimensions.ContentWidth * scale,
                    position: 'absolute',
                    opacity: opacityValue,
                    top: y,
                    left: x,
                    transform: [
                        {
                            translateY: yValue
                        },
                    ]
                }}
                source={require('../../../../../assets/images/heart.png')}
            />
        ) - 1;

        this.setState({
            heartAnimations: this.state.heartAnimations,
        }, () => {
            setTimeout(() => {
                this.canAddHeart = true;
            }, 50);
            let timeToDisappear = opacityValue._value * 1000;
            Animated.timing(
                yValue,
                {
                    toValue: -100 - (Math.random() * 100),
                    duration: timeToDisappear * 2,
                    useNativeDriver: true
                }
            ).start()

            Animated.timing(
                opacityValue,
                {
                    toValue: 0,
                    duration: timeToDisappear * 2,
                    useNativeDriver: true
                }
            ).start(() => {
                this.canAddHeart = false;
                this.state.heartAnimations.splice(index, 1);
                this.setState({
                    heartAnimations: this.state.heartAnimations
                }, () => {
                    setTimeout(() => {
                        this.canAddHeart = true;
                    }, 50);
                })
            })
        })

        if (this.canPet) {
            this.canPet = false;
            PetInteractionRequest.createAndSend(this.nftData.getNonce()).then((response) => {
                if (!response.isSuccess()) {
                    Notifications.pushNotification(response.getErrorText());    
                }

                setTimeout(() => {
                    this.canPet = true;
                }, 30000);
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            heartAnimations: [],
            heartAnimationsState: [],
        };

        this.nftData = props.nftData;
        this.canAddHeart = true;
        this.canPet = true;
    }

    render() {
        return (
            <View style={{ flex: 1 }} {...this.panResponder.panHandlers}>
                {[
                <GLView
                    style={{ flex: 1 }}
                    onContextCreate={this._glViewContextCreate}
                    {...this.panResponder.panHandlers}
                />,
                ...this.state.heartAnimations
                ]}
            </View>
        );
    }

    _glViewContextCreate = async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        // Create a WebGLRenderer without a DOM element
        this.renderer = new Renderer({ gl });
        this.renderer.setSize(width, height);

        this.camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        this.camera.position.set(2, 5, 5);

        this.scene = new Scene();

        const pointLight = new PointLight(0xffffff, 1.3, 10000, 0);
        pointLight.position.set(0, 10, 200);
        this.scene.add(pointLight);

        let nftNonce = this.nftData.getNonce();
        let nftCacheInfos = Cache.nftCacheInfos(nftNonce);
        this.nftCacheInfos = nftCacheInfos;

        this.mesh = await loadFbxAsync({ uri: (await Cache.getCachedFileFromUri(nftCacheInfos.fbx.file, nftCacheInfos.fbx.directory, this.nftData.get3dModel())) });

        Cache.getCachedFileFromUri(this.nftCacheInfos.fbx.file, this.nftCacheInfos.fbx.directory, this.nftData.get3dModel()).then((uri) => {
            loadFbxAsync({ uri: uri }).then((fbxAnim) => {
                this.mixer = new ExpoTHREE.THREE.AnimationMixer(this.mesh);

                let idle = this.mixer.clipAction(fbxAnim.animations[0]);
                idle.play();

                this.renderer.render(this.scene, this.camera);
                this.mesh.scale.setScalar(0.047)
                this.scene.add(this.mesh);

                this.mesh.position.set(this.camera.position.x, this.camera.position.y - 4.5, this.camera.position.z - 10)
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

export default GlView;
