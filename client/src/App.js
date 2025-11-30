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
    <div class="job-hunt-container">
      {
        (typeof backendData.applications === 'undefined') ? (
          <p>loading...</p>
        ) : (
            backendData.applications.map((application, i) => (
              <Application application={application} />
            ))
        )
      }
    </div>
  )
}

export default App