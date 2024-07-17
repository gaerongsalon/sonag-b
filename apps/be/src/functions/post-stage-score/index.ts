import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const postStageScore: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        authorizer: {
          name: "authorize",
          type: "request",
        },
        method: "post",
        path: "/api/stage/{stageSeq}/score",
      },
    },
  ],
};
export default postStageScore;
