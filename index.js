import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// Register with React Native CLI approach only
AppRegistry.registerComponent(appName, () => App);
