import { OkResponse, failed, succeed } from "@libs/api-gateway";

import { APIGatewayProxyEventV2WithCustomAuthorizer } from "@libs/lambda";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { ResultSetHeader } from "mysql2";
import useQuery from "@libs/useQuery";

export async function main({
  body = "{}",
  requestContext: {
    authorizer: { seq: accountSeq },
  },
}: APIGatewayProxyEventV2WithCustomAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<OkResponse<void>>
> {
  const { alias } = JSON.parse(body);
  if (!alias) {
    return failed("Missing alias at payload");
  }
  if (typeof alias !== "string") {
    return failed("'name' must be a string");
  }
  const aliasString = (alias as string).trim();
  if (!aliasString) {
    return failed("'alias' must not be empty string");
  }

  const [result] = await useQuery((connection) =>
    connection.execute<ResultSetHeader>(
      `UPDATE account SET alias = ? WHERE seq = ?`,
      [aliasString, accountSeq]
    )
  );
  console.info({ accountSeq, alias, result }, "update alias");
  return succeed(undefined);
}
