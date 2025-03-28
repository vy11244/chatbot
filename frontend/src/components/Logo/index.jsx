import logo from "../../assets/logo512.png";
import logow from "../../assets/logo512.png";
import { Flex, Title } from "@mantine/core";
import useGlobalState from "../../context/global";
// import appStrings from "../../utils/strings";

export default function Logo({ size = 50, onTap, variant = "auto" }) {
  let theme = useGlobalState((state) => state.theme);

  if (variant === "dark") {
    theme = "dark";
  } else if (variant === "light") {
    theme = "light";
  }

  return (
    <Flex
      align="center"
      onClick={onTap}
      style={{
        cursor: "pointer",
      }}
    >
      <img
        src={theme === "dark" ? logow : logo}
        alt="logo"
        style={{ width: size, height: size }}
      />
      <Title
        ff="Roboto, sans-serif"
        order={3}
        c={theme === "dark" ? "#fff" : "#000"}
      >
        UpSale
      </Title>
    </Flex>
  );
}