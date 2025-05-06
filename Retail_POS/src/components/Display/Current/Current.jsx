import './Current.css'
import RetailerDetail from './RetailerDetail/RetailerDetail'
import QuantityChange from './QuantityChange/QuantityChange'
import Clock from './Clock/Clock'
const Current = () => {
    return (
        <div className="display-current-container">
            <RetailerDetail />
            <div className="current-date">
                <Clock />
                <QuantityChange />
            </div>
        </div>
    )
}

export default Current
