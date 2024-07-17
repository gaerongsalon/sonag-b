import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { failed, OkResponse, succeed } from "@libs/api-gateway";

import { useQueryFetch } from "@libs/useQuery";

interface GetStageResponse {
  name: string;
  data: string[];
}

export async function main({
  pathParameters = {},
}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<OkResponse<GetStageResponse>>
> {
  const { stageSeq: maybeStageSeq } = pathParameters;
  if (!maybeStageSeq || !/^\d+$/.test(maybeStageSeq)) {
    return failed("Missing stageSeq");
  }

  const stageSeq = +maybeStageSeq;
  const [dbStage] = await useQueryFetch<{ name: string; data: string }>(
    `SELECT name, data FROM stage WHERE seq = ?`,
    [stageSeq]
  );
  if (!dbStage) {
    return failed("Cannot find stage data", 404);
  }
  const stage = { name: dbStage.name, data: JSON.parse(dbStage.data) };
  console.info({ stageSeq, stage }, "fetch stage from database");

  return succeed(stage);
}
