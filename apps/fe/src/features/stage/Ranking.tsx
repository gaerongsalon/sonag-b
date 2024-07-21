import { Divider, Group, List, Paper, Stack, Text } from "@mantine/core";

import { IconUserBolt } from "@tabler/icons-react";
import { getScores } from "../../api/server.ts";
import useSWR from "swr";

export default function Ranking() {
  const rankings = useSWR("rankings", getScores);

  return (
    <Stack gap="lg">
      <Text fz={24} component="h1">
        랭킹
      </Text>

      <Divider />
      <Paper>
        <List>
          {(rankings.data ?? []).map(
            ({ accountName, stageName, score }, index) => (
              <List.Item key={`rank#${index}`} icon={<IconUserBolt />}>
                <Group>
                  <Text>{accountName}</Text>
                  <Text>{stageName}</Text>
                  <Text>{score}</Text>
                </Group>
              </List.Item>
            )
          )}
        </List>
      </Paper>
    </Stack>
  );
}
