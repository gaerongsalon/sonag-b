import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { succeed } from "@libs/api-gateway";

import { useQueryFetch } from "@libs/useQuery";

const fetchCount = 100;

export async function main({}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<never>
> {
  const dbScores = await useQueryFetch<{
    accountName: String;
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
