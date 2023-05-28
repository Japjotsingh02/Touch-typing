import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const calcWPMWithThunk = createAsyncThunk(
    "userTasks/updateWithThunk",
    async (payload, { getState }) => {
        return {
            wordsTyped:payload.wordsTyped,
            timeElapsed:getState().Timer.timeElapsed,
            wLength:payload.wLength,
            keysPressed:payload.keysPressed
        };
    }
);

const userTaskSlice=createSlice({
    name:"userTasks",
    initialState:{
        wpm:0,
        accuracy:0,
        avgWPM:0,
        tasksCompleted:0,
    },
    extraReducers: (builder) => {
        builder.addCase(calcWPMWithThunk.fulfilled, (state, action) => {
            state.tasksCompleted++;
            const {wordsTyped,timeElapsed,wLength,keysPressed}=action.payload;
            const prevWpm=state.wpm;
            state.wpm=calculateWPM(wordsTyped,timeElapsed);
            state.avgWPM=calcAverageWPM(prevWpm,state.wpm);
            
            const keysNeededToPress=(wordsTyped*wLength)+(wordsTyped-1);
            state.accuracy=calcAccuracy(keysNeededToPress,keysPressed);
        });
    }
});

export function calculateWPM(wordsTyped, timeElapsed) {
    const minutes = Math.round((timeElapsed/60)*100)/100;
    const wpm = Math.floor(wordsTyped / minutes);
    return wpm;
}

export function calcAverageWPM(prevWPM,wpm){
    if(prevWPM===0){
        return wpm;
    }
    else{
        return (prevWPM+wpm)/2;
    }
}

export function calcAccuracy(keysNeeded,keysPressed){
    const correctKeysPressed = Math.min(keysNeeded, keysPressed);
    const accuracy = (correctKeysPressed / keysNeeded) * 100;
    return Math.floor(accuracy);
}

export const {updateTasksAfterCompletion} = userTaskSlice.actions;

export default userTaskSlice.reducer;