import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";

import Login from "./features/login/Login.tsx";
import LoginContext from "./features/login/LoginContext.tsx";
import { Notifications } from "@mantine/notifications";
import RouteMain from "./RouteMain.tsx";
import { getProfile } from "./api/server.ts";
import useSWR from "swr";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  const profile = useSWR("profile", getProfile);
  console.info(profile);
  if (profile.data) {
    return (
      <MantineProvider theme={theme}>
        <Notifications />
        <LoginContext.Provider value={profile.data}>
          <RouteMain />
        </LoginContext.Provider>
      </MantineProvider>
    );
  } else {
    return (
      <MantineProvider theme={theme}>
        <Notifications />
        <Login />
      </MantineProvider>
    );
  }
}

export default App;
