import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";

import type { AWS } from "@serverless/typescript";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export type AWSFunction = AWS["functions"]["any"];

export function succeed(
  result: unknown,
  statusCode: number = 200
): APIGatewayProxyResultV2 {
  return { statusCode, body: JSON.stringify({ ok: true, result }) };
}

export function failed(
  error: string,
  statusCode: number = 400
): APIGatewayProxyResultV2 {
  return { statusCode, body: JSON.stringify({ ok: false, error }) };
}
