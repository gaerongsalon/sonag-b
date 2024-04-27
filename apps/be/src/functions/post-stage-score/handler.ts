import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { failed } from "@libs/api-gateway";
import useQuery from "@libs/useQuery";

export async function main({
  pathParameters = {},
  body = "{}",
}: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<never>> {
  const { stageSeq: maybeStageSeq } = pathParameters;
  if (!maybeStageSeq || !/^\d+$/.test(maybeStageSeq)) {
    return failed("Missing stageSeq");
  }
  const stageSeq = +maybeStageSeq;

  const { userName, score } = JSON.parse(body);
  if (!userName || !score) {
    return failed("Missing userName or score at payload");
  }
  if (typeof userName !== "string") {
    return failed("'userName' must be a string");
  }
  const userNameString = (userName as string).trim();
  if (!userNameString) {
    return failed("'userName' must not be empty string");
  }
  if (typeof score !== "number") {
    return failed("'score' must be a number");
  }
  const scoreNumber = score as number;
  if (scoreNumber < 0) {
    return failed("'score' must be a non-negative number");
  }

  const [result] = await useQuery((connection) =>
    connection.execute(
      `INSERT INTO scoreboard (stageSeq, userName, score) VALUES (?, ?, ?)`,
      [stageSeq, userNameString, scoreNumber]
    )
  );
  console.info(
    { result, stageSeq, userName: userNameString, score: scoreNumber },
    "new stage score inserted"
  );

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}
