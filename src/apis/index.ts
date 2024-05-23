import {
  test,
  Login,
  register,
  getUserInfo,
  updateUserInfo
} from "./user";
import {
  getLinks,
  searchAdvice,
  getLinkTableList,
  getCategoryList,
  deleteLink,
  deleteCategory,
  addCategory,
  addLink,
  getLinkById,
  editLink
} from "./link";

import {
  getTaskList,
  getTaskById,
  addTask,
  editTask,
  deleteTask,
  uploadTemplate,
  getHistoryList,
  downloadHistoryFile,
  deleteHistoryFile,
  exportMonthly,
  sendDailyEmail,
  exportDaily,
  downloadTemplate,
  getLunarDate,
  getEstimateTaskByMonth,
  getActualTaskByMonth,
  getHoildayByMonth
} from "./task";

export const apis = {
  test,
  Login,
  register,
  getUserInfo,
  updateUserInfo,
  getLinks,
  searchAdvice,
  getLinkTableList,
  getCategoryList,
  deleteLink,
  deleteCategory,
  addCategory,
  addLink,
  getLinkById,
  editLink,
  getTaskList,
  getTaskById,
  addTask,
  editTask,
  deleteTask,
  uploadTemplate,
  getHistoryList,
  downloadHistoryFile,
  deleteHistoryFile,
  exportMonthly,
  sendDailyEmail,
  exportDaily,
  downloadTemplate,
  getLunarDate,
  getEstimateTaskByMonth,
  getActualTaskByMonth,
  getHoildayByMonth
};
