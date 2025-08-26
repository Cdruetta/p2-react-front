import { useContext, useRef } from 'react';
import { useUserContext } from '../../context/UserContext';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { AuthContext } from '../../context/AuthContext';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

export default function UsersView() {
  const { users, deleteUser, updateUserRole, loading, error } = useUserContext();
  const { user } = useContext(AuthContext);
  const roles = ['admin', 'moderador', 'cliente'];
  const toast = useRef(null);

  const handleExport = () => {
    exportToPDF(users, 'Usuarios', ['nombre', 'email', 'edad']);
  };

  const handleRoleChange = async (selectedRole, userId) => {
    try {
      await updateUserRole(userId, selectedRole);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado correctamente', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No tenés permisos para cambiar roles', life: 3000 });
    }
  };

  const confirmDelete = (userId) => {
    confirmDialog({
      message: '¿Estás seguro que deseas eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => handleDelete(userId),
    });
  };

  const handleDelete = async (userId) => {
    if(user?.rol !== 'admin') {
      toast.current.show({ severity: 'warn', summary: 'Permiso denegado', detail: 'No tenés permisos para eliminar usuarios', life: 3000 });
      return;
    }
    try {
      await deleteUser(userId);
      toast.current.show({ severity: 'success', summary: 'Usuario eliminado', detail: 'Se eliminó correctamente', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al eliminar el usuario', life: 3000 });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>👤 Lista de Usuarios 👤</h2>

      {user?.rol === 'admin' && (
        <Link to="/usuarios/crear">
          <Button label="Crear nuevo usuario" icon="pi pi-plus" className="p-button-rounded p-button-success" />
        </Link>
      )}

      <Link to="/">
        <Button label="Volver al inicio" icon="pi pi-home" className="p-button-rounded p-button-secondary" />
      </Link>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-warning" onClick={handleExport} />

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DataTable value={Array.isArray(users) ? users : []} paginator={false} className="p-datatable-sm p-shadow-2 mt-4">
        <Column field="nombre" header="Nombre" />
        <Column field="email" header="Email" />
        <Column field="edad" header="Edad" />
        <Column 
          header="Rol" 
          body={(rowData) =>
            user?.rol === 'admin' ? (
              <Dropdown value={rowData.rol} options={roles} onChange={(e) => handleRoleChange(e.value, rowData.id)} />
            ) : (
              <span>{rowData.rol}</span>
            )
          } 
        />
        <Column 
          header="Acciones" 
          body={(rowData) => (
            user?.rol === 'admin' ? (
              <>
                <Link to={`/usuarios/editar/${rowData.id}`}>
                  <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-info mr-2" />
                </Link>
                <Button label="Eliminar" icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData.id)} />
              </>
            ) : null
          )}
        />
      </DataTable>
    </div>
  );
}
