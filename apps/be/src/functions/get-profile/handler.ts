import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { OkResponse, failed, succeed } from "@libs/api-gateway";

import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import parseTokenFromCookie from "@functions/authorize/parseTokenFromCookie";
import { useQueryFetch } from "@libs/useQuery";
import { verifyToken } from "@functions/authorize/config";

interface GetProfileResponse {
  email: string;
  name: string;
  alias: string;
}

export async function main({
  cookies,
}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<OkResponse<GetProfileResponse>>
> {
  try {
    const token = parseTokenFromCookie(cookies ?? []);
    if (!token) {
      return failed("No token", 401);
    }

    const { seq } = verifyToken(token) as AuthorizationContext;
    const [dbAccount] = await useQueryFetch<{
      seq: number;
      email: string;
      name: string;
      alias: string;
    }>(`SELECT seq, email, name, alias FROM account WHERE seq = ?`, [seq]);
    if (!dbAccount) {
      return failed("No account", 401);
    }

    const profile: GetProfileResponse = {
      email: dbAccount.email,
      name: dbAccount.name,
      alias: dbAccount.alias,
    };

    return succeed(profile, 200);
  } catch (error) {
    return failed(error.message, 401);
  }
}
