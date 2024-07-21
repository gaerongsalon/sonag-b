import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { OkResponse, failed, succeed } from "@libs/api-gateway";

import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

interface TitleByIsbnResponse {
  title: string;
}

export async function main({
  pathParameters = {},
}: APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<OkResponse<TitleByIsbnResponse>>
> {
  const { isbn: maybeIsbn = "" } = pathParameters;
  if (!maybeIsbn) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No ISBN in path parameter" }),
    };
  }
  const isbnCode = maybeIsbn.replace(/-/g, "");

  const response = await fetch(`https://m.yes24.com/Search?query=${isbnCode}`);
  if (!response.ok) {
    return failed(`No data from ISBN[${isbnCode}]`, 400);
  }

  const html = await response.text();
  const { window } = new JSDOM(html);
  const { document } = window;
  const element = document.querySelector("#yesSchGList div.info_row.info_name");
  if (!element) {
    return failed(`No data from ISBN[${isbnCode}]`, 400);
  }

  const title = element.textContent?.trim() ?? "";
  const bookTitle = title.includes("]")
    ? title.substring(title.indexOf("]") + 1).trim()
    : title;

  return succeed({ title: bookTitle }, 200);
}
