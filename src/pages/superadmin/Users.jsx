import React, { useState } from 'react';
import { MOCK_PLATFORM_USERS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Users, UserPlus, Search, Filter, Edit, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SuperadminUsers = () => {
  const [users, setUsers] = useState(MOCK_PLATFORM_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    rol: 'CAMPESINO',
    finca: ''
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.finca.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.rol === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.estado === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.email) return;

    const created = {
      id: `usr-${Date.now()}`,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol,
      finca: newUser.finca || 'Sin Finca Registrada',
      estado: 'Activo',
      fechaRegistro: new Date().toISOString().split('T')[0],
      consumoAi: '0 tokens'
    };

    setUsers([created, ...users]);
    setNewUser({ nombre: '', email: '', rol: 'CAMPESINO', finca: '' });
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-2.5 text-purple-600" />
            Gestión y Administración de Usuarios SaaS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de identidades, roles B2B (Campesino, Agrónomo, Superadmin) y licencias activas.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          Nuevo Usuario SaaS
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o finca..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Role and Status Dropdowns */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Rol:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="ALL">Todos los Roles</option>
                <option value="CAMPESINO">Campesinos</option>
                <option value="AGRONOMO">Agrónomos</option>
                <option value="SUPERADMIN">Superadmins</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <span>Estado:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
                <option value="Suspendido">Suspendidos</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users SaaS Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-4">Usuario / Email</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4">Finca / Predio</th>
                <th className="py-3.5 px-4">Consumo IA</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{u.nombre}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        u.rol === 'SUPERADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.rol === 'AGRONOMO'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.finca}</td>
                  <td className="py-3.5 px-4 text-slate-500">{u.consumoAi}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.estado === 'Activo' ? 'success' : u.estado === 'Inactivo' ? 'warning' : 'danger'}>
                      {u.estado}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Alternar Estado"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="➕ Crear Nuevo Usuario en la Plataforma SaaS"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={newUser.nombre}
              onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
              placeholder="Ej: Juan Fernando Quintero"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="usuario@agrocontrol.ai"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Rol en la Plataforma</label>
              <select
                value={newUser.rol}
                onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
              >
                <option value="CAMPESINO">Campesino</option>
                <option value="AGRONOMO">Agrónomo</option>
                <option value="SUPERADMIN">Superadmin</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Finca / Organización</label>
              <input
                type="text"
                value={newUser.finca}
                onChange={(e) => setNewUser({ ...newUser, finca: e.target.value })}
                placeholder="Finca La Alborada"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="bg-purple-600 hover:bg-purple-700">
              Guardar Usuario
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
