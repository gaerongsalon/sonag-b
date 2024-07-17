import { AWSFunction } from "@libs/api-gateway";
import { handlerPath } from "@libs/handler-resolver";

const authorize: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
};
export default authorize;
