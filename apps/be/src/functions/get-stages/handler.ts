import { APIGatewayProxyResultV2 } from "aws-lambda";
import { succeed } from "@libs/api-gateway";
import { useQueryFetch } from "@libs/useQuery";

export async function main(): Promise<APIGatewayProxyResultV2<never>> {
  const dbStages = await useQueryFetch<{ seq: number; name: string }>(
    `SELECT seq, name FROM stage`,
    []
  );
  const stages = dbStages.map((each) => ({ seq: each.seq, name: each.name }));
  console.info({ stages }, "fetch all");

  return succeed(stages);
}
