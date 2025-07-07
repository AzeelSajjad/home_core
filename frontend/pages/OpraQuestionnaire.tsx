import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitOpraForm } from '../services/opraService'
//made one entire component because using multiple useStates would not allow for the data to be handled when the form was submitted
const OpraQuestionnaire = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleInitial: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        fax: '',
        requestType: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError('')
        
        try {
            const result = await submitOpraForm(formData)
            console.log("Form Submitted Successfully:", result)
            // Navigate to the PDF viewer with the filename from the response
            if (result.data && result.data.filename) {
                navigate(`/view-pdf/${result.data.filename}`)
            } else {
                setError("No filename received from server")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            setError("Failed to submit form. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h1>OPRA Request Form</h1>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>What is your first name?</label>
                <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                />
                <label>What is your middle initial? (If you do not have one, leave it blank.)</label>
                <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                />
                <label>What is your last name?</label>
                <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                />
                <label>What is your email?</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
                <label>What is your phone number?</label>
                <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                />
                <label>What is your address?</label>
                <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                />
                <label>What is your city?</label>
                <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                />
                <label>What is your state?</label>
                <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                />
                <label>What is your zip code?</label>
                <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                />
                <label>What is your fax?</label>
                <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
                />
                <label>What is the request you are making?</label>
                <input
                type="text"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}

export default OpraQuestionnaire