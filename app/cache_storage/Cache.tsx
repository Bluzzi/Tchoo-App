import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export class Cache {
    static DIRECTORY_MODEL_MTL = "nft_model_mtl"
    static DIRECTORY_MODEL_FBX = "nft_model_fbx"
    static DIRECTORY_MODEL_IMAGE_PREVIEW = "nft_model_image_preview"
    static DIRECTORY_BACKGROUND = "nft_background"
    static DIRECTORY_ANIMATIONS = "nft_animations"
    static DIRECTORY_DYNAMIC_ASSETS = "dynamic_assets"

    static CACHE_LOGIN_TOKEN = "@login_token"
    static CACHE_PET_NONCE = "@pet_nonce"
    static CACHE_PET_SLEEPING = "@pet_sleeping"

    static nftCacheInfos = (nftNonce) => {
        return {
            mtl: {
                directory: Cache.DIRECTORY_MODEL_MTL,
                file: nftNonce + "_mtl.mtl",
            },

            fbx: {
                directory: Cache.DIRECTORY_MODEL_FBX,
                file: nftNonce + "_fbx.fbx",
            },

            image_preview: {
                directory: Cache.DIRECTORY_MODEL_IMAGE_PREVIEW,
                file: nftNonce + "_image_preview.png",
            },
        }
    }

    /**
     * Creates the needed directories etc
     */
    static async setupCacheWorkspace() {
        if(Platform.OS == "web") {
            return
        }
        
        let createDirectoryIfNotExists = async (path) => {
            let directoryOptions = await FileSystem.getInfoAsync(path)
            if(!directoryOptions.exists) await FileSystem.makeDirectoryAsync(path)
        }

        return Promise.all([
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_MODEL_MTL),
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_MODEL_IMAGE_PREVIEW),
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_MODEL_FBX),
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_ANIMATIONS),
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_DYNAMIC_ASSETS),
            createDirectoryIfNotExists(FileSystem.cacheDirectory + this.DIRECTORY_BACKGROUND)
        ])
    }

    /**
     * Get the value for a key
     * @param {string} key 
     * @returns {Promise<string>}
     */
    static getCachedValue(key) {
        return AsyncStorage.getItem(key)
    }

    /**
     * Get the value for a key
     * @param {string} key 
     * @returns {bool}
     */
     static async isCachedValue(key) {
        return (await AsyncStorage.getItem(key)) != null && (await AsyncStorage.getItem(key)) != ""
    }

    /**
     * Get the value for a key
     * @param {string} key 
     * @param {string} value  
     * @returns {Promise<void>}
     */
    static setCachedValue(key, value) {
        return AsyncStorage.setItem(key, value)
    }

    /**
     * Get the file from a remote url
     * @param {string} key
     * @param {string} directory
     * @param {string} remoteUri  
     * @returns {Promise<FileSystem.FileSystemDownloadResult>}
     */
    static setCachedFile(key, directory, remoteUri) {
        return FileSystem.downloadAsync(remoteUri, FileSystem.cacheDirectory + directory + "/" + key)
    }

    /**
    * Get the cached asset uri
    * @param {string} key
    * @param {string} directory
    * @param {string} remoteUri  
    * @returns {Promise<string>}
    */
    static async getCachedFileFromUri(key, directory, remoteUri) {
        if (Platform.OS == "web") {
            return remoteUri;
        }

        let directoryOptions = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + directory + "/" + key)
        if (directoryOptions.exists) {
            return directoryOptions.uri
        } else {
            let result = await this.setCachedFile(key, directory, remoteUri)
            return result.uri
        }
    }
}