import axios from 'axios'

export async function submitOpraForm(data) {
    try {
        const response = await axios.post('/submit-opra', data)
        return response
    } catch (error) {
        console.error('Error submitting form:', error)
        throw error
    }
}