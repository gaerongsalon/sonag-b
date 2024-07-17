import { verifyToken } from "@functions/authorize/config";
import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerWithContextResult,
} from "aws-lambda";
import parseTokenFromCookie from "./parseTokenFromCookie";
import AuthorizationContext, {
  nullAuthorizationContext,
} from "@functions/authorize/AuthorizationContext";

export async function main({
  cookies,
}: APIGatewayRequestAuthorizerEventV2): Promise<
  APIGatewaySimpleAuthorizerWithContextResult<AuthorizationContext>
> {
  try {
    const token = parseTokenFromCookie(cookies ?? []);
    if (!token) {
      return { isAuthorized: false, context: nullAuthorizationContext };
    }

    const context = verifyToken(token) as AuthorizationContext;
    return { isAuthorized: true, context };
  } catch (error) {
    return { isAuthorized: false, context: nullAuthorizationContext };
  }
}
