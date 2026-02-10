import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductListing from './pages/ProductListing'
import OrderManagement from './pages/OrderManagement'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/manage" element={<OrderManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
