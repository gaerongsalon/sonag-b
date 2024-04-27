import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import useQuery from "@libs/useQuery";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { name } = event.body;
  const [inserted] = await useQuery((connection) =>
    connection.execute("INSERT IGNORE INTO hello (name) VALUES (?)", [name])
  );
  console.info({ inserted, name }, "Update database");

  const [names] = await useQuery((connection) =>
    connection.query("SELECT seq, name FROM hello")
  );
  console.info({ names }, "all names");

  return formatJSONResponse({
    message: `Hello ${name}! Here are waiting you: ${(
      names as { seq: number; name: string }[]
    )
      .map((row) => row.name)
      .join(", ")}`,
    event,
  });
};

export const main = middyfy(hello);
