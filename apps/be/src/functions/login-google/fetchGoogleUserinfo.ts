import * as https from "node:https";

export default async function fetchGoogleUserinfo(
  token: string
): Promise<{ email: string; name: string; error?: string }> {
  const response = await new Promise<string>((resolve, reject) =>
    https
      .request(
        {
          hostname: "www.googleapis.com",
          path: "/oauth2/v3/userinfo",
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        (response) => {
          let data = "";
          response
            .on("data", (chunk) => (data += chunk))
            .on("error", reject)
            .on("close", () => resolve(data));
        }
      )
      .on("error", reject)
      .end()
  );
  return JSON.parse(response);
}
