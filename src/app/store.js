import { configureStore } from "@reduxjs/toolkit";
import userTaskSlice from "./slices/userTaskSlice";
import TimerSlice from "./slices/TimerSlice";

export default configureStore({
    reducer:{
        Timer:TimerSlice,
        userTasks:userTaskSlice,
    }
});

