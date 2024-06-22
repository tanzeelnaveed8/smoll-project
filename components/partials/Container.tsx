import { Div, DivProps } from "react-native-magnus";

const Container = (props: DivProps) => {
  const { children } = props;
  return <Div px={20}>{children}</Div>;
};

export default Container;
