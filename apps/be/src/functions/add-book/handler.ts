import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { OkResponse, failed, succeed } from "@libs/api-gateway";

import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { ResultSetHeader } from "mysql2";
import useQuery from "@libs/useQuery";

interface AddBookResponse {
  seq: number;
  isbn: string;
  title: string;
}

export async function main({
  body = "{}",
  requestContext: {
    authorizer: {
      lambda: { seq: accountSeq },
    },
  },
}: APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<OkResponse<AddBookResponse>>
> {
  const { title, isbn } = JSON.parse(body);
  if (!title || !isbn) {
    return failed("Missing title or isbn at payload");
  }
  if (typeof title !== "string") {
    return failed("'title' must be a string");
  }
  const titleString = (title as string).trim();
  if (!titleString) {
    return failed("'title' must not be empty string");
  }
  if (typeof isbn !== "string") {
    return failed("'isbn' must be a string");
  }
  const isbnString = (isbn as string).trim();
  if (!isbnString) {
    return failed("'isbn' must not be empty string");
  }

  console.info({ accountSeq, isbnString, titleString }, "insert new book");

  const [result] = await useQuery((connection) =>
    connection.execute<ResultSetHeader>(
      `INSERT INTO library (accountSeq, isbn, title) VALUES (?, ?, ?)`,
      [accountSeq, isbnString, titleString]
    )
  );
  const book: AddBookResponse = {
    seq: result.insertId,
    isbn: isbnString,
    title: titleString,
  };
  console.info({ book, result }, "new book inserted");
  return succeed(book);
}
