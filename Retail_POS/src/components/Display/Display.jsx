import './Display.css'
import EditBar from './EditBar/EditBar'
import Current from './Current/Current'
import CurrentOrder from './CurrentOrder/CurrentOrder'
const Display = () => {
  return (
    <div className="display-container h-full overflow-y-auto overflow-x-hidden">
      <Current />
      <EditBar />
      <CurrentOrder />
    </div>
  )
}

export default Display
