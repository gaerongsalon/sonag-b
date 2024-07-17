import { verifyToken } from "@functions/authorize/config";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import parseTokenFromCookie from "@functions/authorize/parseTokenFromCookie";
import { failed, OkResponse, succeed } from "@libs/api-gateway";

export async function main({
  cookies,
}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<OkResponse<AuthorizationContext>>
> {
  try {
    const token = parseTokenFromCookie(cookies ?? []);
    if (!token) {
      return failed("No token", 401);
    }

    const context = verifyToken(token) as AuthorizationContext;
    return succeed(context, 200);
  } catch (error) {
    return failed(error.message, 401);
  }
}
