import { Box, Button, Group, TextInput } from "@mantine/core";

import { useForm } from "@mantine/form";

export default function TitleForm({
  onTitleSubmit,
}: {
  onTitleSubmit: (title: string) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
    },

    validate: {
      title: (value) => {
        const trimmed = value.trim();
        return trimmed.length > 0 && trimmed.length < 20;
      },
    },
  });

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit((values) => onTitleSubmit(values.title))}>
        <TextInput
          withAsterisk
          label="title"
          placeholder="스테이지 이름"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
