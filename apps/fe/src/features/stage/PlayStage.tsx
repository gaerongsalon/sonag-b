import {
  ActionIcon,
  Button,
  Divider,
  Group,
  List,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconBook2, IconSend2 } from "@tabler/icons-react";
import { getStage, postStageScore } from "../../api/server.ts";

import React from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export default function PlayStage() {
  const { stageSeq } = useParams<"stageSeq">();
  const stage = useSWR(
    { type: "stage", stageSeq: +(stageSeq || "0") },
    getStage
  );
  const [state, setState] = React.useState<"wait" | "game">("wait");

  if (stage.error) {
    return <div>서버에 연결할 수 없습니다!</div>;
  }
  if (!stage.data) {
    return <div>로딩 중...</div>;
  }

  if (state === "wait") {
    return (
      <Stack gap="lg">
        <Text fz={24} component="h1">
          {stage.data.name}
        </Text>
        <Space h={40} />
        <Button onClick={() => setState("game")}>시작</Button>
      </Stack>
    );
  }
  return (
    <Game
      stageSeq={+(stageSeq || "0")}
      name={stage.data.name}
      data={stage.data.data}
    />
  );
}

function Game({
  stageSeq,
  name,
  data,
}: {
  stageSeq: number;
  name: string;
  data: string[];
}) {
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);
  const [remains, setRemains] = React.useState<string[]>(data);
  const form = useForm({
    initialValues: {
      text: "",
    },
  });

  React.useEffect(() => {
    if (remains.length === 0) {
      setEndTime(Date.now());
    }
  }, [remains]);

  React.useEffect(() => {
    if (endTime !== null) {
      const score =
        data.reduce((sum, item) => sum + item.length, 0) /
        ((endTime - startTime) / 1000);
      notifications.show({
        title: "게임 종료",
        message: `축하합니다! ${score}점`,
        color: "blue",
      });
      postStageScore({
        stageSeq,
        score,
      });
    }
  }, [data, endTime, startTime]);

  return (
    <Stack gap="lg">
      <Text fz={24} component="h1">
        {name}
      </Text>
      {endTime === null ? (
        <StopWatch startTime={startTime} />
      ) : (
        <StoppedWatch startTime={startTime} endTime={endTime} />
      )}

      <form
        onSubmit={form.onSubmit(({ text }) => {
          if (remains.includes(text)) {
            setRemains(remains.filter((r) => r !== text));
          }
          form.reset();
        })}
      >
        <Group>
          <TextInput {...form.getInputProps("text")} />
          <ActionIcon type="submit">
            <IconSend2 />
          </ActionIcon>
        </Group>
      </form>

      <Divider />
      <Paper>
        <List>
          {remains.map((title) => (
            <List.Item key={title} icon={<IconBook2 />}>
              {title}
            </List.Item>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}

function StopWatch({ startTime }: { startTime: number }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text fz={20} component="h2">
      {Math.floor((now - startTime) / 1000.0).toFixed(3)}초
    </Text>
  );
}

function StoppedWatch({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime: number;
}) {
  return (
    <Text fz={20} component="h2">
      {Math.floor((endTime - startTime) / 1000.0).toFixed(3)}초
    </Text>
  );
}
