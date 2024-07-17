import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { failed, OkResponse, succeed } from "@libs/api-gateway";
import { APIGatewayProxyEventV2WithCustomAuthorizer } from "@libs/lambda";
import { APIGatewayProxyResultV2 } from "aws-lambda";

import { JSDOM } from "jsdom";
import fetch from "node-fetch";

interface TitleByIsbnResponse {
  title: string;
}

export async function main({
  pathParameters = {},
}: APIGatewayProxyEventV2WithCustomAuthorizer<AuthorizationContext>): Promise<
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

  const response = await fetch(
    `https://www.nl.go.kr/seoji/contents/S80100000000.do?schType=simple&schStr=${isbnCode}`
  );
  if (!response.ok) {
    return failed(`No data from ISBN[${isbnCode}]`, 400);
  }

  const html = await response.text();
  const { window } = new JSDOM(html);
  const { document } = window;
  const element = document.querySelector("#resultList_div div.tit");
  if (!element) {
    return failed(`No data from ISBN[${isbnCode}]`, 400);
  }

  const title = element.textContent?.trim() ?? "";
  const bookTitle = title.includes(".")
    ? title.substring(title.indexOf(".") + 1).trim()
    : title;

  return succeed({ title: bookTitle }, 200);
}
