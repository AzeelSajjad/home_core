import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

//making components of the questionnaire
const FirstName = () => {
    const [firstName, setFirstName] = useState("")
    return (
        <>
        <label>What is your first name?</label>
        <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </>
    )
}

const MiddleInitial = () => {
    const [middleInitial, setMiddleInitial] = useState("")
    return (
        <>
        <label>What is your middle initial?(If you do not have one, leave it blank.)</label>
        <input type='text' value={middleInitial} onChange={(e) => setMiddleInitial(e.target.value)}/>
        </>
    )
}

const LastName = () => {
    const [lastName, setLastName] = useState("")
    return (
        <>
        <label>What is your last name?</label>
        <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)}/> 
        </>
    )
}

