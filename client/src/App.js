import React, { useEffect, useState } from 'react'
import Application from './components/application'

function App() {

  const [ backendData, setBackendData ] = useState([{}])
  
  useEffect(() => {
    fetch("/api/applications")
    .then(response => response.json())
    .then(data => {
      setBackendData(data);
    })
  }, [])

  return (
    <div className="job-hunt-container">
      {
        (typeof backendData.applications === 'undefined') ? (
          <p>loading...</p>
        ) : (
            backendData.applications.map((application, i) => (
              <Application key={application.application_id} application={application} />
            ))
        )
      }
    </div>
  )
}

export default App