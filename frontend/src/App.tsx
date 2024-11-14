import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./core/ProtectedRoute/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Lobby from "./modules/lobby/view/Lobby";
import TradeRoom from "@modules/trade/view/TradeRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Lobby />} />
          <Route path="trade">
            <Route path=":tradeId" element={<TradeRoom />} />
            <Route path=":tradeId/:participantId" element={<TradeRoom />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
