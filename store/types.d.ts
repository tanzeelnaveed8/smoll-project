import { NavigationProp, RouteProp } from "@react-navigation/native";

export type Nullable<T> = T | null;

export type NavigationType = NavigationProp<ReactNavigation.RootParamList> & {
  navigate: (screen: string, params?: object) => void;
};
