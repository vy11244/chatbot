import style from "./style.module.css";
import { AppShell, Flex, Group, Container, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "../Logo";
import Navbar from "../Navbar";
import User from "../User";

export default function Layout({
  children,
  navItems = [],
  navPreItems = [],
  navPostItems = [],
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className={style.header}>
  <Flex h="100%" align="center" justify="space-between" px="xl">
    <Flex align="center">
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
      />
    </Flex>
    <Flex align="center" style={{ marginLeft: 'auto' }}>
      <User />
    </Flex>
  </Flex>
</AppShell.Header>
      <AppShell.Navbar>
     <div className={style.logoContainer}> {/* Sử dụng class từ style.css */}
      <Logo size={30} />
      </div>
        <Navbar
          preItems={navPreItems}
          items={navItems}
          postItems={navPostItems}
        />
      </AppShell.Navbar >
      <AppShell.Main>
        <Container className={style.contentContainer}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
