import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { JSDOM } from "jsdom";
import fetch from "node-fetch";

export async function main({
  pathParameters = {},
}: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<never>> {
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
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        error: `No data from ISBN[${isbnCode}]`,
      }),
    };
  }

  const html = await response.text();
  const { window } = new JSDOM(html);
  const { document } = window;
  const element = document.querySelector("#resultList_div div.tit");
  if (!element) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        error: `No data from ISBN[${isbnCode}]`,
      }),
    };
  }

  const title = element.textContent?.trim() ?? "";
  const bookTitle = title.includes(".")
    ? title.substring(title.indexOf(".") + 1).trim()
    : title;

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, result: { title: bookTitle } }),
  };
}
