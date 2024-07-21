import { addBook, getTitleByIsbn } from "../../api/server.ts";

import promiseNotification from "../../support/promiseNotification.ts";

export default async function registerBook({
  isbn,
  onComplete,
}: {
  isbn: string;
  onComplete: () => void;
}) {
  if (!isbn) {
    return;
  }

  await promiseNotification(
    (async function (): Promise<string> {
      const { title } = await getTitleByIsbn({ isbn });
      console.log({ title }, "Found book by ISBN");
      await addBook({ isbn, title });
      onComplete();
      return title;
    })(),
    {
      onSuccess: (title) => `책을 추가했습니다: ${title}`,
      onFailed: () => `잘못된 ISBN입니다: ${isbn}`,
    }
  );
}
