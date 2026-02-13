import getCurrentUser from "../customHooks/getCurrentUser";
import getCouseData from "../customHooks/getCouseData";
import getCreatorCourseData from "../customHooks/getCreatorCourseData";
import getAllReviews from "../customHooks/getAllReviews";

const GlobalDataLoader = () => {
  getCurrentUser();
  getCouseData();
  getCreatorCourseData();
  getAllReviews();
  return null;
};

export default GlobalDataLoader;
