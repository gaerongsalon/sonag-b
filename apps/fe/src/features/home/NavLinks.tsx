import {
  IconBook2,
  IconBuilding,
  IconGoGame,
  IconHome2,
  IconMilitaryRank,
} from "@tabler/icons-react";
import { NavLink, Stack } from "@mantine/core";

import { Link } from "react-router-dom";
import paths from "../../paths.ts";

interface Menus {
  home: boolean;
  registerBook: boolean;
  createGame: boolean;
  playGame: boolean;
  seeTotalRanking: boolean;
}
const allMenus: Menus = {
  home: true,
  registerBook: true,
  createGame: true,
  playGame: true,
  seeTotalRanking: true,
};

export default function NavLinks({
  menus: partialMenus,
}: {
  menus?: Partial<Menus>;
}) {
  const menus: Menus = {
    ...allMenus,
    ...partialMenus,
  };
  return (
    <Stack m="md" gap="md">
      {menus.home && (
        <NavLink
          component={Link}
          to={paths.home}
          label="처음으로"
          leftSection={<IconHome2 />}
        />
      )}
      {menus.registerBook && (
        <NavLink
          component={Link}
          to={paths.registerBook}
          label="책 등록"
          leftSection={<IconBook2 />}
        />
      )}
      {menus.createGame && (
        <NavLink
          component={Link}
          to={paths.createGame}
          label="게임 만들기"
          leftSection={<IconBuilding />}
        />
      )}
      {menus.playGame && (
        <NavLink
          component={Link}
          to={paths.playGame}
          label="게임 하기"
          leftSection={<IconGoGame />}
        />
      )}
      {menus.seeTotalRanking && (
        <NavLink
          component={Link}
          to={paths.seeTotalRanking}
          label="랭킹 보기"
          leftSection={<IconMilitaryRank />}
        />
      )}
    </Stack>
  );
}
