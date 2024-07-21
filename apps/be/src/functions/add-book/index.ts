import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const addBook: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: {
          name: "authorize",
          type: "request",
        },
        method: "post",
        path: "/api/library",
      },
    },
  ],
};
export default addBook;
