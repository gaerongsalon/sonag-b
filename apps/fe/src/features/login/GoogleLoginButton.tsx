import { Button } from "@mantine/core";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async function (tokenResponse) {
      fetch(`/api/login/google?token=${tokenResponse.access_token}`, {
        method: "POST",
        credentials: "include",
      })
        .then((response) => console.info(response))
        .catch(console.error);
    },
  });
  return <Button onClick={() => login()}>Login</Button>;
}
