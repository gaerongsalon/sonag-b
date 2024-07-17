import addStage from "./add-stage";
import authorize from "./authorize";
import getProfile from "./get-profile";
import getStage from "./get-stage";
import getScores from "./get-scores";
import getStages from "./get-stages";
import loginGoogle from "./login-google";
import logout from "./logout";
import postStageScore from "./post-stage-score";
import titleByIsbn from "./title-by-isbn";

export default {
  // Authentication.
  authorize,
  loginGoogle,
  logout,
  getProfile,

  // Features.
  addStage,
  getStage,
  getStages,
  getScores,
  postStageScore,
  titleByIsbn,
};
