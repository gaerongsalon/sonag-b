import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { OkResponse, failed, succeed } from "@libs/api-gateway";

import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import { ResultSetHeader } from "mysql2";
import useQuery from "@libs/useQuery";

export async function main({
  body = "{}",
  requestContext: {
    authorizer: {
      lambda: { seq: accountSeq },
    },
  },
}: APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizationContext>): Promise<
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
