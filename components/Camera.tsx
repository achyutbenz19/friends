import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { observe } from '../lib/ai';
import Cartesia from "@cartesia/cartesia-js";
import { WebPlayer } from "@cartesia/cartesia-js";

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const cartesia = useRef(new Cartesia({

    }));
    const player = useRef(new WebPlayer({ bufferDuration: 500 }));


    useEffect(() => {
        if (aiResponse) {
            speak(aiResponse);
        }
    }, [aiResponse]);

    const speak = async (text: string) => {
        try {
            console.log(text)
            const websocket = cartesia.current.tts.websocket({
                container: "raw",
                encoding: "pcm_f32le",
                sampleRate: 44100
            });

            await websocket.connect();

            const response = await websocket.send({
                model_id: "sonic-english",
                voice: {
                    mode: "id",
                    id: "a0e99841-438c-4a64-b679-ae501e7d6091",
                },
                transcript: text
            });

            await player.current.play(response.source);
        } catch (error) {
            console.error('Error speaking:', error);
        }
    };

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

    async function takePicture() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const imageUrl = photo!.uri;

            const base64Image = await fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                }))
                .then(dataUrl => {
                    if (typeof dataUrl === 'string') {
                        return dataUrl.split(',')[1];
                    }
                    throw new Error('Data URL is not a string');
                });

            const response = await observe(base64Image);
            setAiResponse(response); // Update state with AI response
            console.log(response);
        }
    }

    return (
        <View className="flex-1">
            <TapGestureHandler onActivated={toggleCameraFacing} numberOfTaps={2}>
                <CameraView ref={cameraRef} className="flex-1" facing={facing}>
                    {aiResponse && (
                        <Text className="absolute bottom-20 left-0 right-0 text-center text-white font-bold">
                            {aiResponse}
                        </Text>
                    )}
                    <View className="absolute bottom-8 left-0 right-0 flex-row justify-between px-4">
                        <TouchableOpacity className="bg-gray-300 p-4 rounded-full shadow-lg" onPress={toggleCameraFacing}>
                            <Text className="font-bold text-gray-800">Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-300 p-4 rounded-full shadow-lg" onPress={takePicture}>
                            <Text className="font-bold text-gray-800">Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </TapGestureHandler>
        </View>
    );
}