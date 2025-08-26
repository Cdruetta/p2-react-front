import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext';

const HomeView = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {/* NAVBAR SIMPLE */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>

        {!user && (
          <>
            <Link to="/inicio-sesion" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/registro" style={{ marginRight: '1rem' }}>Registro</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/productos" style={{ marginRight: '1rem' }}>Productos</Link>
            <Link to="/usuarios" style={{ marginRight: '1rem' }}>Usuarios</Link>
            {user.rol === 'admin' && <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>Panel Admin</span>}
            <Button label="Logout" onClick={logout} className="p-button-secondary" />
          </>
        )}

        {user && <span style={{ marginLeft: '1rem' }}>Rol: {user.rol}</span>}
      </nav>

      {/* CONTENIDO CENTRAL */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Bienvenido al CRUD de productos y usuarios</h1>
        <h4>
          (Aplicación fullstack en JavaScript donde el frontend (React) consume los datos expuestos
          por el backend (Express), permitiendo realizar CRUDs completos)
        </h4>

        {user ? (
          <div style={{ marginTop: '20px' }}>
            <Link to="/usuarios" style={{ marginRight: '10px' }}>
              <Button label="Ir a Usuarios" />
            </Link>

            <Link to="/productos" style={{ marginRight: '10px' }}>
              <Button label="Ir a Productos" />
            </Link>

            <Button label="Cerrar Sesión" onClick={logout} className="p-button-secondary" />
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <Link to="/inicio-sesion" style={{ marginRight: '10px' }}>
              <Button label="Iniciar sesión" />
            </Link>
            <Link to="/registro" style={{ marginRight: '10px' }}>
              <Button label="Registrarse" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
