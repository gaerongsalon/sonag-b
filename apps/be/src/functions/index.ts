import addBook from "./add-book";
import addStage from "./add-stage";
import authorize from "./authorize";
import getProfile from "./get-profile";
import getScores from "./get-scores";
import getStage from "./get-stage";
import getStages from "./get-stages";
import listBooks from "./list-books";
import loginGoogle from "./login-google";
import logout from "./logout";
import postStageScore from "./post-stage-score";
import titleByIsbn from "./title-by-isbn";
import updateAccountAlias from "./update-account-alias";

export default {
  // Authentication.
  authorize,
  loginGoogle,
  logout,
  getProfile,
  updateAccountAlias,

  // Features.
  addBook,
  listBooks,
  addStage,
  getStage,
  getStages,
  getScores,
  postStageScore,
  titleByIsbn,
};
