import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from "aws-lambda";

export type APIGatewayProxyEventV2WithCustomAuthorizer<TAuthorizer> =
  APIGatewayProxyEventV2WithRequestContext<
    APIGatewayEventRequestContextV2WithAuthorizer<TAuthorizer>
  >;
