import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductList from "./pages/Products/ProductList";
import ProductDetail from "./pages/Products/ProductDetail";
import ProductForm from "./pages/Products/ProductForm";
import ProducerDashboard from "./pages/Dashboard/ProducerDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ProducerProfile from "./pages/Profile/ProducerProfile";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                           <Route path="/" element={<Layout />}>
                             <Route index element={<Home />} />
                             <Route path="products" element={<ProductList />} />
                             <Route path="products/:id" element={<ProductDetail />} />
                             <Route path="products/new" element={
                               <ProtectedRoute>
                                 <ProductForm />
                               </ProtectedRoute>
                             } />
                             <Route path="products/:id/edit" element={
                               <ProtectedRoute>
                                 <ProductForm />
                               </ProtectedRoute>
                             } />
                             <Route path="producer/:id" element={<ProducerProfile />} />
                             <Route
                               path="dashboard"
                               element={
                                 <ProtectedRoute>
                                   <Dashboard />
                                 </ProtectedRoute>
                               }
                             />
                             <Route
                               path="dashboard/producer"
                               element={
                                 <ProtectedRoute>
                                   <ProducerDashboard />
                                 </ProtectedRoute>
                               }
                             />
                             <Route
                               path="dashboard/admin"
                               element={
                                 <ProtectedRoute>
                                   <AdminDashboard />
                                 </ProtectedRoute>
                               }
                             />
                             <Route
                               path="profile"
                               element={
                                 <ProtectedRoute>
                                   <Profile />
                                 </ProtectedRoute>
                               }
                             />
                           </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
