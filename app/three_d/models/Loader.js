import { loadObjAsync, loadTextureAsync } from 'expo-three';
import { resolveAsync } from 'expo-asset-utils';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { decode } from 'base64-arraybuffer';
import { EncodingType, readAsStringAsync } from 'expo-file-system';

export async function loadFbxAsync({ uri, onAssetRequested }) {
    const base64 = await readAsStringAsync(uri, {
        encoding: EncodingType.Base64,
    });
    
    const arrayBuffer = decode(base64);
    const loader = new FBXLoader();
    return loader.parse(arrayBuffer, onAssetRequested);
}