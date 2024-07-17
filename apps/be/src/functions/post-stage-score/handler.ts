import { APIGatewayProxyResultV2 } from "aws-lambda";

import { failed } from "@libs/api-gateway";
import useQuery from "@libs/useQuery";
import { APIGatewayProxyEventV2WithCustomAuthorizer } from "@libs/lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";

export async function main({
  pathParameters = {},
  body = "{}",
  requestContext: {
    authorizer: { seq: accountSeq },
  },
}: APIGatewayProxyEventV2WithCustomAuthorizer<AuthorizationContext>): Promise<
  APIGatewayProxyResultV2<never>
> {
  const { stageSeq: maybeStageSeq } = pathParameters;
  if (!maybeStageSeq || !/^\d+$/.test(maybeStageSeq)) {
    return failed("Missing stageSeq");
  }
  const stageSeq = +maybeStageSeq;

  const { score } = JSON.parse(body);
  if (!score) {
    return failed("Missing userName or score at payload");
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
      `INSERT INTO scoreboard (stageSeq, accountSeq, score) VALUES (?, ?, ?)`,
      [stageSeq, accountSeq, scoreNumber]
    )
  );
  console.info(
    { result, stageSeq, accountSeq, score: scoreNumber },
    "new stage score inserted"
  );

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}
