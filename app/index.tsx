import Camera from "@/components/Camera";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function Index() {
  return (
    <GestureHandlerRootView className='flex-1'>
      <View
        className="h-full"
      >
        <Camera />
      </View>
    </GestureHandlerRootView>
  );
}
