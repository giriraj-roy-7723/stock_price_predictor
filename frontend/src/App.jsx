import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MarketAnalysis from './pages/MarketAnalysis';
import StockPredictor from './pages/StockPredictor';
import { useFinanceData } from './utils/useFinanceData';

export default function App() {
  const { loading, error, data, refresh } = useFinanceData();

  return (
    <BrowserRouter>
      <Navbar onRefresh={refresh} loading={loading} />
      <Routes>
        <Route path="/" element={
          <Dashboard data={data} loading={loading} error={error} onRefresh={refresh} />
        } />
        <Route path="/market" element={
          <MarketAnalysis data={data} loading={loading} />
        } />
        <Route path="/predictor" element={<StockPredictor />} />
      </Routes>
    </BrowserRouter>
  );
}