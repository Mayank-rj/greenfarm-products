import { useEffect, useState } from 'react'
import './Clock.css'
const Clock = () => {
     const [date, setDate] = useState(new Date())
      // Format date and time
      const formattedDateTime = date
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        .replace(/\//g, '-')
        
      useEffect(() => {
        const intervalId = setInterval(() => {
          setDate(new Date())
        }, 1000)
        return () => {
          clearInterval(intervalId)
        }
      }, [])
    return (
        <div className="clock-container">
            <p>{formattedDateTime}</p>
        </div>
    )
}

export default Clock
