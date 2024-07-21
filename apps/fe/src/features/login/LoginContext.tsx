import { GetProfile } from "../../api/server";
import React from "react";

const LoginContext = React.createContext<GetProfile>({
  name: "",
  email: "",
  alias: "",
});

export default LoginContext;

export function useProfile() {
  const profile = React.useContext(LoginContext);
  return { profile, isLogged: profile.email !== "" };
}
