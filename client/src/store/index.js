import { createPinia } from "pinia";
import useAuth from "./modules/auth.js";
import useDiary from "./modules/diary.js";
import useGrades from "./modules/grades.js";
import useSettings from "./modules/settings.js";
import useSubject from "./modules/subject.js";
import useTerms from "./modules/terms.js";
import useYears from "./modules/years.js";
import useLoader from "./modules/loader.js";
import useHealth from "./modules/health.js";

const pinia = createPinia();

export {
  useAuth,
  useDiary,
  useGrades,
  useSettings,
  useSubject,
  useTerms,
  useYears,
  useLoader,
  useHealth,
};

export default pinia;
