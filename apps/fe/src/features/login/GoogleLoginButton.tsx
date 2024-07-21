import * as server from "../../api/server.ts";

import { Button } from "@mantine/core";
// import paths from "../../paths.ts";
import promiseNotification from "../../support/promiseNotification.ts";
import { useGoogleLogin } from "@react-oauth/google";

// import { useSearchParams } from "react-router-dom";

export default function GoogleLoginButton() {
  // const [params] = useSearchParams();
  // const returnUrl = params.has("return")
  //   ? decodeURIComponent(params.get("return")!)
  //   : paths.home;
  const handleLogin = useGoogleLogin({
    onSuccess: async function (tokenResponse) {
      promiseNotification(server.login({ token: tokenResponse.access_token }), {
        onSuccess: () => {
          window.location.reload();
        },
      });
    },
  });
  return (
    <Button variant="light" size="xl" onClick={() => handleLogin()}>
      구글로 로그인
    </Button>
  );
}
