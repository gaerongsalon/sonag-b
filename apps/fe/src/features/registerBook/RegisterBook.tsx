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
import { IconBook2, IconPlus, IconQrcode } from "@tabler/icons-react";

import { listBooks } from "../../api/server.ts";
import paths from "../../paths.ts";
import registerBook from "./registerBook.ts";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

export default function RegisterBook() {
  const navigate = useNavigate();
  const books = useSWR("library", listBooks);
  const form = useForm({
    initialValues: {
      isbn: "",
    },
  });
  return (
    <Stack gap="lg">
      <Text fz={24} component="h1">
        책 추가
      </Text>

      <form
        onSubmit={form.onSubmit(({ isbn }) =>
          registerBook({
            isbn: isbn,
            onComplete: () => {
              books.mutate();
              form.reset();
            },
          })
        )}
      >
        <Group>
          <TextInput placeholder="ISBN" {...form.getInputProps("isbn")} />
          <ActionIcon type="submit">
            <IconPlus />
          </ActionIcon>
          <ActionIcon onClick={() => navigate(paths.scanBook)}>
            <IconQrcode />
          </ActionIcon>
        </Group>
      </form>

      <Divider />
      <Paper>
        <List>
          {(books.data ?? []).map(({ isbn, title }) => (
            <List.Item key={isbn} icon={<IconBook2 />}>
              {title}
            </List.Item>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
