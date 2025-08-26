import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/">Inicio</Link>{" | "}

        {!user && (
            <>
            <Link to="/inicio-sesion">Login</Link>{" | "}
            <Link to="/registro">Registro</Link>
            </>
        )}

        {user && (
            <>
            <Link to="/productos">Productos</Link>{" | "}
            <Link to="/usuarios">Usuarios</Link>{" | "}
            {user.rol === "admin" && <span>Panel Admin</span>}{" | "}
            <button onClick={logout}>Logout</button>
            </>
        )}

        {user && <span style={{ marginLeft: "1rem" }}>Rol: {user.rol}</span>}
        </nav>
    );
};

export default Navbar;
