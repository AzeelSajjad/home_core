import React, { useState } from 'react'
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

const Email = () => {
    const [email, setEmail] = useState("")
    return (
        <>
        <label>What is your email?</label>
        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
        </>
    )
}

const Phone = () => {
    const [phone, setPhone] = useState("")
    return (
        <>
        <label>What is your phone number?</label>
        <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
        </>
    )
}

const Address = () => {
    const [address, setAddress] = useState("")
    return (
        <>
        <label>What is your address?</label>
        <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
        </>
    )
}

const City = () => {
    const [city, setCity] = useState("")
    return (
        <>
        <label>What is your city?</label>
        <input type='text' value={city} onChange={(e) => setCity(e.target.value)} />
        </>
    )
}

const State = () => {
    const [state, setState] = useState("")
    return (
        <>
        <label>What is your state?</label>
        <input type='text' value={state} onChange={(e) => setState(e.target.value)} />
        </>
    )
}

const ZipCode = () => {
    const [zipCode, setZipCode] = useState("")
    return (
        <>
        <label>What is your zip code?</label>
        <input type='text' value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </>
    )
}

const Fax = () => {
    const [fax, setFax] = useState("")
    return (
        <>
        <label>What is your fax?</label>
        <input type='text' value={fax} onChange={(e) => setFax(e.target.value)} />
        </>
    )
}

const RequestType = () => {
    const [requestType, setRequestType] = useState("")
    return (
        <>
        <label>What is the request you are making?</label>
        <input type='text' value={requestType} onChange={(e) => setRequestType(e.target.value)} />
        </>
    )
}
