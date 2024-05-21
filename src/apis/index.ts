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
  addLink
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
  getTaskByMonth,
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
  getTaskByMonth,
  getHoildayByMonth
};
