import { APIGatewayProxyResultV2 } from "aws-lambda";
import { OkResponse, succeed } from "@libs/api-gateway";
import { useQueryFetch } from "@libs/useQuery";

const fetchCount = 30;

type GetStagesResponse = {
  seq: number;
  name: string;
}[];

export async function main(): Promise<
  APIGatewayProxyResultV2<OkResponse<GetStagesResponse>>
> {
  const dbStages = await useQueryFetch<{ seq: number; name: string }>(
    `SELECT seq, name FROM stage ORDER BY seq DESC LIMIT ${fetchCount}`,
    []
  );
  const stages = dbStages.map((each) => ({ seq: each.seq, name: each.name }));
  console.info({ stages }, "fetch all");

  return succeed(stages);
}
