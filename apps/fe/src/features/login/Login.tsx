import { Space, Text } from "@mantine/core";

import GoogleLoginButton from "./GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IconCloudRain } from "@tabler/icons-react";

export default function Login() {
  return (
    <div style={{ textAlign: "center" }}>
      <IconCloudRain size={120} />
      <Text fz={48} component="h1">
        소낙비
      </Text>

      <Space h={120} />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!!}>
        <GoogleLoginButton />
      </GoogleOAuthProvider>
    </div>
  );
}
