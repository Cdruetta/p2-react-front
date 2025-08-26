import { Routes, Route } from 'react-router-dom';
import ProductsView from './ProductsView';
import ProductForm from './ProductForm';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// Wrapper para rutas solo de admin
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.rol !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Acceso denegado</h2>
        <p>Solo los administradores pueden acceder a esta sección.</p>
      </div>
    );
  }
  return children;
};

export default function ProductRoutes() {
  return (
    <Routes>
      {/* Listado: cualquier usuario logueado */}
      <Route path="/" element={<ProductsView />} />

      {/* Crear y editar: solo admin */}
      <Route
        path="/crear"
        element={
          <AdminRoute>
            <ProductForm />
          </AdminRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <AdminRoute>
            <ProductForm />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
