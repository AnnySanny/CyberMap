import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import AdminCatalog from "./pages/AdminCatalog";
import AdminStat from "./pages/AdminStat";
import Cart from "./pages/dashboard/Cart";
import Catalog from "./pages/dashboard/Catalog";


function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
     
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/catalog" element={<AdminCatalog />} />
        <Route path="/admin/statistics" element={<AdminStat />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="cart" element={<Cart/>} />
          <Route path="catalog" element={<Catalog />} />
        </Route>
      </Routes>
    </>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
