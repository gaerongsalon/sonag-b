import AddStage from "./features/stage/AddStage.tsx";
import First from "./features/home/First.tsx";
import Home from "./features/home/Home.tsx";
import ListStages from "./features/stage/ListStages.tsx";
import PlayStage from "./features/stage/PlayStage.tsx";
import Ranking from "./features/stage/Ranking.tsx";
import RegisterBook from "./features/registerBook/RegisterBook.tsx";
import ScanBarcode from "./features/registerBook/ScanBarcode.tsx";
import { createBrowserRouter } from "react-router-dom";
import paths from "./paths.ts";

const router = createBrowserRouter([
  {
    id: "root",
    path: paths.home,
    Component: Home,
    children: [
      {
        index: true,
        Component: First,
      },
      {
        path: paths.registerBook,
        Component: RegisterBook,
      },
      {
        path: paths.scanBook,
        Component: ScanBarcode,
      },
      {
        path: paths.createGame,
        Component: AddStage,
      },
      {
        path: paths.getGames,
        Component: ListStages,
      },
      {
        path: paths.playGame,
        Component: PlayStage,
      },
      {
        path: paths.seeTotalRanking,
        Component: Ranking,
      },
    ],
  },
]);

export default router;
