import { useRef, useEffect, useState, useContext } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

export default function EditProductView() {
    const { products, editProduct } = useProductContext();
    const { user } = useContext(AuthContext);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({ nombre: '', precio: 0 });

    useEffect(() => {
        const p = products.find(p => p.id.toString() === id.toString());
        if (p) setProduct(p);
    }, [products, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || user.rol !== 'admin') {
        toast.current.show({ severity: 'error', summary: 'Acceso denegado', detail: 'No tienes permisos', life: 3000 });
        return;
        }

        const { nombre, precio } = e.target;
        try {
        await editProduct(id, { nombre: nombre.value, precio: parseFloat(precio.value) });
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
        navigate('/productos');
        } catch {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto', life: 3000 });
        }
    };

    return (
        <div className="p-m-4">
        <Toast ref={toast} />
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit} className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
            <label>Nombre</label>
            <InputText name="nombre" defaultValue={product.nombre} required />
            </div>
            <div className="p-field p-col-12">
            <label>Precio</label>
            <InputNumber name="precio" defaultValue={product.precio} mode="currency" currency="ARS" locale="es-AR" required />
            </div>
            <Button type="submit" label="Guardar" icon="pi pi-check" className="p-button-success" />
        </form>
        </div>
    );
}
