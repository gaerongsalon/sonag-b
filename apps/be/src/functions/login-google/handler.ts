import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import fetchGoogleUserinfo from "./fetchGoogleUserinfo";
import {
  signToken,
  loginCookieExpiresIn,
  cookieName,
} from "@functions/authorize/config";
import useQuery, { useQueryFetch } from "@libs/useQuery";
import { ResultSetHeader } from "mysql2";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { failed, OkResponse } from "@libs/api-gateway";

export async function main({
  queryStringParameters: { token } = { token: "" },
}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<OkResponse<undefined>>
> {
  if (!token) {
    return failed("No token", 400);
  }

  const response = await fetchGoogleUserinfo(token);
  if (response.error) {
    return failed("Invalid token", 401);
  }
  const { email, name } = response;

  const [result] = await useQuery((connection) =>
    connection.execute<ResultSetHeader>(
      `INSERT INTO account (email, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?`,
      [email, name, name]
    )
  );
  let seq = result.insertId;
  if (seq === 0) {
    const [account] = await useQueryFetch<{ seq: number }>(
      `SELECT seq FROM account WHERE email = ?`,
      [email]
    );
    if (!account) {
      return failed("Cannot create a new account", 500);
    }
    seq = account.seq;
  }
  console.info({ seq, email, name }, "Logged by Google OAuth");

  const context: AuthorizationContext = { seq, email, name };
  const jwt = signToken(context);
  const expires = new Date(Date.now() + loginCookieExpiresIn).toUTCString();
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `${cookieName}=${jwt}; Path=/; Expires=${expires}; Secure; HttpOnly`,
    },
  };
}
