import { APIGatewayProxyResultV2 } from "aws-lambda";
import { failed, OkResponse, succeed } from "@libs/api-gateway";

import { ResultSetHeader } from "mysql2";
import useQuery from "@libs/useQuery";
import { APIGatewayProxyEventV2WithCustomAuthorizer } from "@libs/lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";

interface AddStageResponse {
  seq: number;
  name: string;
  data: string[];
}

export async function main({
  body = "{}",
  requestContext: {
    authorizer: { seq: accountSeq },
  },
}: APIGatewayProxyEventV2WithCustomAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<OkResponse<AddStageResponse>>
> {
  const { name, data } = JSON.parse(body);
  if (!name || !data) {
    return failed("Missing name or data at payload");
  }
  if (typeof name !== "string") {
    return failed("'name' must be a string");
  }
  const nameString = (name as string).trim();
  if (!nameString) {
    return failed("'name' must not be empty string");
  }

  if (!Array.isArray(data)) {
    return failed("'data' must be an array");
  }
  const dataArray = data as unknown[];
  if (dataArray.some((each) => !(typeof each === "string"))) {
    return failed("All elements of 'data' must be a string");
  }
  const dataStringArray = (dataArray as string[]).map((each) => each.trim());
  if (dataStringArray.some((each) => each.length === 0)) {
    return failed("All elements of 'data' must not be empty string");
  }

  const [result] = await useQuery((connection) =>
    connection.execute<ResultSetHeader>(
      `INSERT INTO stage (accountSeq, name, data) VALUES (?, ?, ?)`,
      [accountSeq, nameString, JSON.stringify(dataStringArray)]
    )
  );
  const stage = {
    seq: result.insertId,
    name: nameString,
    data: dataStringArray,
  };
  console.info({ stage, result }, "new stage inserted");
  return succeed(stage);
}
