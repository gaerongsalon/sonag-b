import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { OkResponse, succeed } from "@libs/api-gateway";

import { useQueryFetch } from "@libs/useQuery";

const fetchCount = 100;

type GetScoresResponse = {
  accountName: string;
  stageSeq: number;
  stageName: string;
  score: number;
}[];

export async function main({}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<OkResponse<GetScoresResponse>>
> {
  const dbScores = await useQueryFetch<{
    accountName: string;
    stageSeq: number;
    stageName: string;
    score: number;
  }>(
    `SELECT a.name AS accountName, sb.stageSeq, s.name AS stageName, sb.score
     FROM scoreboard sb
       JOIN account a ON sb.accountSeq = a.seq
       JOIN stage s ON sb.stageSeq = s.seq
     ORDER BY score DESC
     LIMIT ${fetchCount}`,
    []
  );
  const scores = dbScores.map((each) => ({
    accountName: each.accountName,
    stageSeq: each.stageSeq,
    stageName: each.stageName,
    score: each.score,
  }));
  console.info({ scores }, "fetch all");

  return succeed(scores);
}
