import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { failed, succeed } from "@libs/api-gateway";

import { useQueryFetch } from "@libs/useQuery";

export async function main({
  pathParameters = {},
}: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<never>> {
  const { stageSeq: maybeStageSeq } = pathParameters;
  if (!maybeStageSeq || !/^\d+$/.test(maybeStageSeq)) {
    return failed("Missing stageSeq");
  }

  const stageSeq = +maybeStageSeq;

  const dbScores = await useQueryFetch<{ score: number; userName: string }>(
    `SELECT userName, score FROM scoreboard WHERE stageSeq = ? ORDER BY score DESC LIMIT 100`,
    [stageSeq]
  );
  const scores = dbScores.map((each) => ({
    userName: each.userName,
    score: each.score,
  }));
  console.info({ scores }, "fetch all");

  return succeed(scores);
}
