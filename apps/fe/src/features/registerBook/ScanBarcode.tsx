import { ActionIcon, Group, Stack, Text } from "@mantine/core";

import { IconArrowLeft } from "@tabler/icons-react";
import QrScanner from "./QrScanner.tsx";
import registerBook from "./registerBook.ts";
import { useNavigate } from "react-router-dom";

export default function ScanBarcode() {
  const navigate = useNavigate();
  return (
    <Stack gap="lg" align="start">
      <Group align="flex-start">
        <ActionIcon onClick={() => navigate(-1)} variant="white">
          <IconArrowLeft />
        </ActionIcon>
        <Text fz={24} component="h1">
          바코드 스캔
        </Text>
      </Group>

      <QrScanner
        key="QrScanner"
        onComplete={(isbn) =>
          registerBook({
            isbn,
            onComplete: () => {},
          })
        }
      />
    </Stack>
  );
}
