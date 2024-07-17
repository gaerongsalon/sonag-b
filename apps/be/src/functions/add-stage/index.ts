import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const addStage: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: "authorize",
        method: "post",
        path: "/api/stage",
      },
    },
  ],
};
export default addStage;
