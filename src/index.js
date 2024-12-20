import {createRoot} from 'react-dom/client'
import App from './App'
import Context_provider from './context/Context_provider'
createRoot(document.getElementById("root")).render(<Context_provider><App></App></Context_provider>)