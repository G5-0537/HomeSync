import React, { useState } from 'react';
import { localStore } from '../../services/localStore';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Wrench, CheckCircle2, Clock, UserCheck, MessageSquare } from 'lucide-react';
import { MaintenanceRequest } from '../../types';

export const LandlordMaintenancePage: React.FC = () => {
  const { success } = useToast();
  const [maintenance, setMaintenance] = useState(localStore.getMaintenanceRequests());
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);
  const [status, setStatus] = useState<MaintenanceRequest['status']>('IN_PROGRESS');
  const [technician, setTechnician] = useState('');
  const [landlordNotes, setLandlordNotes] = useState('');

  const refreshList = () => {
    setMaintenance(localStore.getMaintenanceRequests());
  };

  const handleOpenUpdate = (ticket: MaintenanceRequest) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setTechnician(ticket.assignedTechnician || 'Urban Company Partner');
    setLandlordNotes(ticket.landlordNotes || '');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    localStore.updateMaintenanceStatus(selectedTicket.id, status, landlordNotes);
    success(`Maintenance ticket status updated to ${status}!`);
    refreshList();
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Maintenance Management Hub
            </h1>
            <Badge variant="lavender">{maintenance.length} Total Tickets</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Coordinate contractor dispatches, review tenant damage photos, and record repair notes.
          </p>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="space-y-4">
        {maintenance.map(ticket => (
          <Card key={ticket.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-charcoal-900">{ticket.title}</h3>
                  <p className="text-xs text-charcoal-500">
                    {ticket.propertyTitle} • Reported by {ticket.tenantName} ({ticket.category})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'} size="md">
                  {ticket.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => handleOpenUpdate(ticket)}>
                  Update Ticket
                </Button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
              {ticket.description}
            </p>

            {ticket.photos.length > 0 && (
              <div className="flex items-center gap-3">
                {ticket.photos.map((p, idx) => (
                  <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-charcoal-200">
                    <img src={p} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {ticket.landlordNotes && (
              <div className="p-3 bg-ivory-50 rounded-xl border border-charcoal-200 text-xs text-charcoal-700">
                <strong>Your Notes:</strong> "{ticket.landlordNotes}"
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Update Modal */}
      {selectedTicket && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          title={`Update Ticket: ${selectedTicket.title}`}
          subtitle={selectedTicket.propertyTitle}
          maxWidth="md"
        >
          <form onSubmit={handleSaveUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Assigned Technician / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Plumbers (Urban Company)"
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Resolution Notes for Tenants</label>
              <textarea
                rows={3}
                placeholder="Notes visible to roommates on their dashboard..."
                value={landlordNotes}
                onChange={e => setLandlordNotes(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
              <Button variant="secondary" type="submit">
                Save & Notify Tenants
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
