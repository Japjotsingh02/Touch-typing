import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { calcWPMWithThunk } from '../../app/slices/userTaskSlice';
import { calculateTimeElapsed, updateTimer } from '../../app/slices/TimerSlice';
import RadioOption from '../../components/RadioOption/RadioOption';

// function for generating random words
export function generateRandomWord(length) {
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var word = '';
  
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      word += characters.charAt(randomIndex);
    }
    
    return word;
}

const Home=()=> {
    const {wpm,accuracy,avgWPM,tasksCompleted}=useSelector(state=>state.userTasks);
    const {timerMinutes,timerSeconds,timerHours}=useSelector(state=>state.Timer);

    const dispatch=useDispatch();
    const combination = useRef(2);
    const repitition = useRef(3);
    const wordsInputRef = useRef("");
    const [isRunning, setIsRunning] = useState(false);
    const [selectedValue,setSelectedValue]=useState("2");
    const [randWords,setRandWords]=useState(InputGenerator());
    const [keysPressed,setKeysPressed]=useState(0);
    
    const RadioOptionJSON=[
        {
            name:"Bigrams",
            value:"2"
        },
        {
            name:"Trigrams",
            value:"3"
        },
        {
            name:"Tetragrams",
            value:"4"
        },
        {
            name:"Custom",
            value:"5"
        }
    ];

    useEffect(() => {
        let intervalId;
    
        if (isRunning) {
          intervalId = setInterval(() => {
            dispatch(updateTimer());
          }, 1000);
        }
    
        return () => {
          clearInterval(intervalId);
        };
    }, [isRunning]);
    
    const StartTimer = () => {
        setIsRunning(true);
    };
    
    const StopTimer = () => {
        setIsRunning(false);
    };

    useEffect(()=>{
        if(selectedValue!=='5')
            InputGenerator(selectedValue);
    },[selectedValue]);

    const handleRadioChange=(e)=>{
        setSelectedValue(e.target.value);
        if(e.target.value==="5"){
            setRandWords("");
        }
    }
    
    // to handle input user typed
    const handleUserInput=(e)=>{
        StartTimer();
        setKeysPressed(keysPressed+1);
        
        if(wordsInputRef.current.value===randWords){
            const cValue= typeof combination.current===Number ? combination.current : combination.current.value;
            const rValue= typeof repitition.current===Number ? repitition.current : repitition.current.value;
            StopTimer();

            dispatch(calculateTimeElapsed());
            const wordsTyped=(cValue*rValue);
            console.log(wordsTyped);
            dispatch(calcWPMWithThunk({wordsTyped,wLength:selectedValue,keysPressed}));

            // new input generation
            InputGenerator(e);
            wordsInputRef.current.value = '';
        }
    }

    // Generating words with combinations and repitition
    function InputGenerator(e){
        let newWordsOnInput="";

        const cValue= e ? combination.current.value : combination.current;
        const rValue= e ? repitition.current.value : repitition.current;
        
        for(let i=0;i<cValue;i++){
            let NWord=generateRandomWord(selectedValue);
            if(newWordsOnInput!=="") newWordsOnInput+=" " + NWord;
            else newWordsOnInput=NWord;
        }
                
        let WordAfterRepetition=newWordsOnInput;
        
        for(let i=0;i<(rValue-1);i++){
            WordAfterRepetition+=(" " + newWordsOnInput);
        }
        
        if(e) setRandWords(WordAfterRepetition);
        else return WordAfterRepetition;
    }

    return (
        <div className='main-wrapper'>
            <div className='header'>
                <span className='timer'>{String(timerHours).padStart(2, '0')}:{String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}</span>
            </div>

            <div className='words-generator-type'>
                <div className='source'>
                    <div className='type-header'>Source</div>

                    <form className='form'>
                        {RadioOptionJSON.map((choice,index)=><RadioOption choice={choice} key={index} selectedValue={selectedValue} handleRadioChange={handleRadioChange}/>)}
                    </form>
                </div>
                
                <div className='generator'>
                    <div className='type-header'>Generator</div>

                    <div className='inputCard inputFlexColumn'>
                        <label className='columnLabel'>Combination</label>
                        <input type="number" ref={combination} onInput={(e)=>InputGenerator(e)} className='generatorInput' defaultValue="2"/>
                    </div>

                    <div className='inputCard inputFlexColumn'>
                        <label className='columnLabel'>Repitition</label>
                        <input type='number' ref={repitition} onInput={(e)=>InputGenerator(e)} className='generatorInput' defaultValue="3"/>
                    </div>
                </div>
            </div>

            <div className='tasks-completed'>
                <span>Lesson Completed : </span>
                <span>{tasksCompleted}</span>
            </div>

            <div className='threshold'>
                <span className='threshold-values'>WPM: {wpm}</span>
                <span className='threshold-values'>Accuracy: {accuracy}%</span>
                <span className='threshold-values'>Average WPM: {avgWPM}</span>
            </div>

            <textarea type="text" placeholder={selectedValue==='5' && "Put your random words here"} value={randWords} onInput={(e)=>setRandWords(e.target.value)} readOnly={selectedValue!=='5'} className='randomWordsInput' autoCorrect='none' autoCapitalize='none'/>

            <input autoCorrect='none' autoCapitalize='none' placeholder='Re-type if failed' type='text' onInput={(e)=>handleUserInput(e)} ref={wordsInputRef} className='randomWordsInput user-input'/>
        </div>
    );
}

export default Home;
