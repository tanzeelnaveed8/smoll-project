import { ReactElement, createContext, useContext, useState } from "react";
import { Div } from "react-native-magnus";
import { IconChevronDown } from "@tabler/icons-react-native";
import { TouchableOpacity } from "react-native";

const AccordionContext = createContext({ open: false, toggle: () => {} });

const AccordionTitle = ({ children }: { children: ReactElement }) => {
  const { open, toggle } = useContext(AccordionContext);
  return (
    <TouchableOpacity onPress={toggle} activeOpacity={1}>
      <Div flexDir="row" alignItems="center" justifyContent="space-between">
        {children}
        <IconChevronDown
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
          size={24}
          color="#494949"
          strokeWidth={1.5}
        />
      </Div>
    </TouchableOpacity>
  );
};

const AccordionContent = ({ children }: { children: ReactElement }) => {
  const { open } = useContext(AccordionContext);
  return (
    <Div mt={4} h={open ? undefined : 0}>
      {children}
    </Div>
  );
};

const Accordion = ({ children }: { children: ReactElement[] }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <Div pb={16} borderBottomWidth={1} borderColor="#E0E0E0">
        {children}
      </Div>
    </AccordionContext.Provider>
  );
};

Accordion.title = AccordionTitle;
Accordion.content = AccordionContent;

export default Accordion;
