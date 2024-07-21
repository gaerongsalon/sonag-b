import { Space, Stack, Text } from "@mantine/core";

import { IconFileSmile } from "@tabler/icons-react";
import NavLinks from "./NavLinks.tsx";

export default function First() {
  return (
    <Stack gap="lg" align="center">
      <IconFileSmile size={120} />
      <Space h={40} />
      <Text>책을 등록하고 게임을 만들어보세요.</Text>
      <Text>또는 다른 사람이 만든 게임을 즐겨보세요!</Text>
      <Space h={40} />
      <NavLinks menus={{ home: false }} />
    </Stack>
  );
}
