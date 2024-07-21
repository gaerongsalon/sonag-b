import { Divider, List, Paper, Stack, Text } from "@mantine/core";

import { IconGoGame } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getStages } from "../../api/server.ts";
import useSWR from "swr";

export default function ListStages() {
  const stages = useSWR("stages", getStages);

  return (
    <Stack gap="lg">
      <Text fz={24} component="h1">
        게임 목록
      </Text>

      <Divider />
      <Paper>
        <List>
          {(stages.data ?? []).map(({ seq, name }) => (
            <List.Item key={seq} icon={<IconGoGame />}>
              <Link to={`/stage/${seq}`}>{name}</Link>
            </List.Item>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
