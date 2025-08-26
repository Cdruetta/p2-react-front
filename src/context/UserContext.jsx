import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

const BASE_URL = 'http://localhost:3000/usuarios'

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.get(BASE_URL);
            console.log("Respuesta usuarios:", responseData);
            setUsers(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            if (e.response && e.response.status === 403) {
                alert("No tienes permisos para ver los usuarios");
            } else {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = async (newUser) => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.post(BASE_URL, newUser);
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setUsers(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } catch (e) {
            if (e.response && e.response.status === 403) {
                alert("No tienes permisos para crear usuarios");
            } else {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const editUser = async (id, updated) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/${id}`, updated);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...updated, id: id } : u))
            );
        } catch (e) {
            if (e.response && e.response.status === 403) {
                alert("No tienes permisos para editar este usuario");
            } else {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const deleteUser = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            if (e.response && e.response.status === 403) {
                alert("No tienes permisos para eliminar este usuario");
            } else {
                setError(e.message);
            }
        }
    };
    
    useEffect(() => {
        getUsers();
    }, []);

    return (
        <UserContext.Provider
            value={{
                users,
                loading,
                error,
                getUsers,
                addUser,
                editUser,
                deleteUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
