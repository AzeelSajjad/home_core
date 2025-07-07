import React from 'react'
import { useParams } from 'react-router-dom'

const PdfViewer = () => {
  const { filename } = useParams<{ filename: string }>()

  return (
    <iframe
      src={`http://localhost:8000/filled_forms/${filename}`}
      width="100%"
      height="800px"
      title="OPRA PDF"
    />
  )
}

export default PdfViewer