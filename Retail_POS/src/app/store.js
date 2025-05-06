import { configureStore } from "@reduxjs/toolkit";
import manageCategoryReducer from "../feature/manageCategorySlice";
import displayOrderSlice from "../feature/displayOrderSlice";
import footerReducer from "../feature/showorderslice"
import displayViewOrderReducer from "../feature/viewOrderSlice"
import excelDataSlice from '../feature/excelDataSlice'
import weightReducer from "../feature/weightSlice"
import posDataReducer from "../feature/posDataSlice"
import zprintDataReducer from '../feature/zprintDataSlice'
import webOrderBadgeCountReducer from '../feature/webOrderBadgeSlice'
import transactionReducer from '../feature/transactionSlice';
import settingsAuthReducer from '../feature/settingsAuth'
export default configureStore({
  reducer: {
    manageCategory: manageCategoryReducer,
    displayOrder: displayOrderSlice,
    footer: footerReducer,
    displayViewOrder:displayViewOrderReducer,
    weight: weightReducer,
    excelData: excelDataSlice,
    posData: posDataReducer,
    zprintData:zprintDataReducer,
    webOrderBadgeCount:webOrderBadgeCountReducer,
    transaction: transactionReducer,
    settingsAuth: settingsAuthReducer,
  },
});
