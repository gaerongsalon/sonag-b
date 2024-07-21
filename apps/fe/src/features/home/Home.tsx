import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";

import { IconLogout } from "@tabler/icons-react";
import NavLinks from "./NavLinks.tsx";
import { Outlet } from "react-router-dom";
import { logout } from "../../api/server.ts";
import paths from "../../paths.ts";
import promiseNotification from "../../support/promiseNotification.ts";
import { useDisclosure } from "@mantine/hooks";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header bg="blue">
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
          />
          <Text c="white">소낙비</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <NavLinks />
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            label="로그아웃"
            leftSection={<IconLogout />}
            onClick={() =>
              promiseNotification(logout(), {
                onSuccess: () => window.location.assign(paths.home),
              })
            }
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
