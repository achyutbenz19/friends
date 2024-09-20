import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-center mb-2">We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View className="flex-1">
            <TapGestureHandler onActivated={toggleCameraFacing} numberOfTaps={2}>
                <CameraView className="flex-1" facing={facing}>
                    <View className="absolute bottom-8 left-0 right-0 flex-row justify-between px-4">
                        <TouchableOpacity className="bg-gray-300 p-4 rounded-full shadow-lg" onPress={toggleCameraFacing}>
                            <Text className="font-bold text-gray-800">Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-300 p-4 rounded-full shadow-lg">
                            <Text className="font-bold text-gray-800">Mute</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </TapGestureHandler>
        </View>
    );
}
