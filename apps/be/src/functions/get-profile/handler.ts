import { verifyToken } from "@functions/authorize/config";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import AuthorizationContext from "@functions/authorize/AuthorizationContext";
import parseTokenFromCookie from "@functions/authorize/parseTokenFromCookie";

export async function main({
  cookies,
}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<AuthorizationContext>
> {
  try {
    const token = parseTokenFromCookie(cookies ?? []);
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: "No token" }) };
    }

    return verifyToken(token) as AuthorizationContext;
  } catch (error) {
    return { statusCode: 401, body: JSON.stringify({ error: error.message }) };
  }
}
