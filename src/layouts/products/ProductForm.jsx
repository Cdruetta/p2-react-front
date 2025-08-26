import { useContext, useRef } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';   
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function ProductsView() {
  const { products, deleteProduct } = useProductContext();
  const { user } = useContext(AuthContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  // Confirmación de eliminación
  const confirmDelete = (id) => {
    confirmDialog({
      message: '¿Estás seguro que querés eliminar este producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => handleDelete(id),
    });
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!user || user.rol !== 'admin') {
      toast.current.show({ severity: 'error', summary: 'Acceso denegado', detail: 'No tienes permisos', life: 3000 });
      return;
    }

    try {
      await deleteProduct(id);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto', life: 3000 });
    }
  };

  return (
    <div className="p-m-4">
      {/* Toast y confirm dialog */}
      <Toast ref={toast} />
      <ConfirmDialog />

      <h2 className="p-mb-3">📦 Lista de Productos 📦</h2>

      {/* Botones de crear y volver */}
      <div className="p-mb-3">
        {user?.rol === 'admin' && (
          <Link to="/productos/crear">
            <Button label="Crear nuevo producto" icon="pi pi-plus" className="p-button-rounded p-button-success p-mr-2" />
          </Link>
        )}
        <Link to="/">
          <Button label="Volver al inicio" icon="pi pi-home" className="p-button-rounded p-button-secondary" />
        </Link>
      </div>

      {/* Tabla de productos */}
      <DataTable 
        value={Array.isArray(products) ? products : []} 
        paginator={false} 
        className="p-datatable-sm p-shadow-2"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="precio" header="Precio" />

        <Column 
          header="Acciones" 
          body={(rowData) => (
            user?.rol === 'admin' ? (
              <>
                <Link to={`/productos/editar/${rowData.id}`}>
                  <Button 
                    label="Editar" 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-info p-mr-2" 
                  />
                </Link>
                <Button 
                  label="Eliminar" 
                  icon="pi pi-trash" 
                  className="p-button-rounded p-button-danger" 
                  onClick={() => confirmDelete(rowData.id)} 
                />
              </>
            ) : null
          )}
        />
      </DataTable>
    </div>
  );
}
