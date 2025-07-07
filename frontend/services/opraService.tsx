import axios from 'axios'

interface OpraFormData {
    firstName: string;
    middleInitial: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    fax: string;
    requestType: string;
}

export async function submitOpraForm(data: OpraFormData) {
    try {
        const response = await axios.post('http://localhost:8001/api/submit-opra', data)
        return response
    } catch (error) {
        console.error('Error submitting form:', error)
        throw error
    }
}