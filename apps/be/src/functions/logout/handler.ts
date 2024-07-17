import { cookieName } from "@functions/authorize/config";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export async function main({}: APIGatewayProxyEventV2): Promise<
  APIGatewayProxyResultV2<never>
> {
  const epoch = new Date(0).toUTCString();
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `${cookieName}=; Path=/; Expires=${epoch}`,
    },
  };
}
