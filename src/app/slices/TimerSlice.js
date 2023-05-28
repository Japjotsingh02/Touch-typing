import {  createSlice } from "@reduxjs/toolkit";

const TimerSlice=createSlice({
    name:"Timer",
    initialState:{
        timerSeconds:0,
        timerMinutes:0,
        timerHours:0,
        timeElapsed:0,
        TimerStartsAt:{
            minutes:0,
            hours:0,
            seconds:0,
        },
    },
    reducers:{
        updateTimer(state){
            let seconds=state.timerSeconds;
            let minutes=state.timerMinutes;
            let hours=state.timerHours;
            seconds++;
            if(seconds===60){
                minutes++;
                seconds=0;
            }
            if(minutes===60){
                hours++;
                minutes=0;
            }
            state.timerHours=hours;
            state.timerMinutes=minutes;
            state.timerSeconds=seconds;
        },
        calculateTimeElapsed(state,action){
            let timeElapsed=0.0;
            const HoursDiff=state.timerHours-state.TimerStartsAt.hours;
            if(HoursDiff>0){
                timeElapsed=HoursDiff*60*60;
            }

            const MinutesDiff=state.timerMinutes-state.TimerStartsAt.minutes;
            if(MinutesDiff>0){
                timeElapsed+=MinutesDiff*60;
            }

            const SecondsDiff=state.timerSeconds-state.TimerStartsAt.seconds;
            if(SecondsDiff>0){
                timeElapsed+=SecondsDiff;
            }
            
            state.TimerStartsAt={
                minutes:state.timerMinutes,
                hours:state.timerHours,
                seconds:state.timerSeconds,
            }

            state.timeElapsed=timeElapsed;
        }
    }
});

export const {updateTimer,calculateTimeElapsed} = TimerSlice.actions;

export default TimerSlice.reducer;