import {
  ActionIcon,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconBook2, IconPlus } from "@tabler/icons-react";
import { addStage, listBooks } from "../../api/server.ts";

import paths from "../../paths.ts";
import promiseNotification from "../../support/promiseNotification.ts";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

export default function AddStage() {
  const navigate = useNavigate();
  const books = useSWR("library", listBooks);
  const form = useForm<{ name: string; data: string[] }>({
    initialValues: {
      name: "",
      data: [],
    },
  });

  return (
    <Stack gap="lg">
      <Text fz={24} component="h1">
        게임 만들기
      </Text>

      <form
        onSubmit={form.onSubmit(({ name, data }) =>
          promiseNotification(addStage({ name, data }), {
            onSuccess: () => navigate(paths.getGames, { replace: true }),
          })
        )}
      >
        <Group>
          <TextInput placeholder="제목" {...form.getInputProps("name")} />
          <ActionIcon type="submit">
            <IconPlus />
          </ActionIcon>
        </Group>
      </form>

      <Divider />
      <Paper>
        <List>
          {(books.data ?? []).map(({ isbn, title }) => (
            <List.Item
              key={isbn}
              icon={
                <IconBook2
                  color={form.values.data.includes(title) ? "blue" : undefined}
                />
              }
              onClick={() =>
                form.setFieldValue(
                  "data",
                  form.values.data.includes(title)
                    ? form.values.data.filter((each) => each !== title)
                    : form.values.data.concat([title])
                )
              }
            >
              {title}
            </List.Item>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
