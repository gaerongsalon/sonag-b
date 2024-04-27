import { Box, Divider, List, Text } from "@mantine/core";

import Html5QrcodePlugin from "../../plugin/barcode/Html5QrcodeScannerPlugin";
import React from "react";

type BookMetadata = {
  isbn: string;
  title: string;
};

const seenIsbns = new Set<string>();

export default function BookListForm({ title }: { title: string }) {
  const [books, setBooks] = React.useState<BookMetadata[]>([]);
  async function appendBook(isbn: string) {
    if (seenIsbns.has(isbn)) {
      console.info({ isbn }, "already seen");
      return;
    }
    console.info({ isbn }, "scanned");
    seenIsbns.add(isbn);

    const response = await fetch(`https://openlibrary.org/isbn/${isbn}`);
    const data = await response.json();
    try {
      if (!data.ok) {
        console.error({ isbn, data }, "server returns error");
      } else {
        console.info({ isbn, data }, "retrieve information");
        setBooks((books) => [...books, { isbn, title: data.result.title }]);
      }
    } catch (error) {
      console.error({ isbn, error }, "cannot fetch from server");
    }
  }
  return (
    <Box mx="auto">
      <Text>{title}</Text>
      <List>
        {books.map((book) => (
          <List.Item key={book.isbn}>{book.title}</List.Item>
        ))}
      </List>
      <Divider />
      <Html5QrcodePlugin
        fps={10}
        qrbox={500}
        disableFlip={true}
        qrCodeErrorCallback={(error) =>
          console.log({ error }, "error from scanner")
        }
        qrCodeSuccessCallback={(isbn) => {
          appendBook(isbn);
        }}
      />
    </Box>
  );
}
