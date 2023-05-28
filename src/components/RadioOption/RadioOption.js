import React from 'react';

function RadioOption({choice,selectedValue,handleRadioChange}) {
    const {name,value}=choice;
    return (
        <label className="label radioInput" htmlFor={name}>
            <input type='radio' name={name} className="radio" value={value} checked={selectedValue===value} onChange={handleRadioChange}/>
            {name}
        </label>
    );
}

export default RadioOption;