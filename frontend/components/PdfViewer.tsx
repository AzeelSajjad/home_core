import React from 'react'
import { useParams } from 'react-router-dom'

const PdfViewer = () => {
  const { filename } = useParams<{ filename: string }>()
  
  return (
    <div>
      <h2>Your Filled OPRA Form</h2>
      <p>Filename: {filename}</p>
      <p>Would load PDF from: http://localhost:8000/api/pdf/{filename}</p>
      {/* Temporarily comment out the iframe */}
      {/* <iframe
        src={`http://localhost:8001/api/pdf/${filename}`}
        width="100%"
        height="800px"
        title="OPRA PDF"
      /> */}
    </div>
  )
}

export default PdfViewer