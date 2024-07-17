import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const titleByIsbn: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: "authorize",
        method: "get",
        path: "/api/title-by-isbn/{isbn}",
      },
    },
  ],
};
export default titleByIsbn;
