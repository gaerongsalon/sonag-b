import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const logout: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: {
          name: "authorize",
          type: "request",
        },
        method: "post",
        path: "/api/logout",
      },
    },
  ],
};
export default logout;
