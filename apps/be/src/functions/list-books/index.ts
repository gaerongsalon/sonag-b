import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const listBooks: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: {
          name: "authorize",
          type: "request",
        },
        method: "get",
        path: "/api/library",
      },
    },
  ],
};
export default listBooks;
