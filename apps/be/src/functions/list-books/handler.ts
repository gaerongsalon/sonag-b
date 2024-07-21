import { OkResponse, succeed } from "@libs/api-gateway";

import { APIGatewayProxyEventV2WithCustomAuthorizer } from "@libs/lambda";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { useQueryFetch } from "@libs/useQuery";

const fetchCount = 300;

type ListBooksResponse = {
  seq: number;
  title: string;
  isbn: string;
}[];

export async function main({
  requestContext: {
    authorizer: { seq: accountSeq },
  },
}: APIGatewayProxyEventV2WithCustomAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<OkResponse<ListBooksResponse>>
> {
  const dbBooks = await useQueryFetch<{
    seq: number;
    title: string;
    isbn: string;
  }>(
    `SELECT seq, title, isbn FROM library WHERE accountSeq = ? ORDER BY seq DESC LIMIT ${fetchCount}`,
    [accountSeq]
  );
  const books = dbBooks.map((each) => ({
    seq: each.seq,
    title: each.title,
    isbn: each.isbn,
  }));
  console.info({ books }, "fetch all");

  return succeed(books);
}
