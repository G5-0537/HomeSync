import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MaintenanceModal } from '../../components/dashboard/MaintenanceModal';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Image as ImageIcon,
  UserCheck
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { household, maintenance, refreshData } = useHousehold();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Maintenance & Repair Requests
            </h1>
            <Badge variant="sage">Direct Landlord Dispatch</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Submit service tickets, attach damage photos, and monitor contractor resolution in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Submit New Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {maintenance.length === 0 ? (
          <Card className="p-8 text-center text-xs text-charcoal-500">
            No maintenance tickets reported. All household appliances & fixtures are in good shape!
          </Card>
        ) : (
          maintenance.map(ticket => {
            const isResolved = ticket.status === 'RESOLVED';
            const isInProgress = ticket.status === 'IN_PROGRESS';
            return (
              <Card key={ticket.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-charcoal-900">{ticket.title}</h3>
                      <p className="text-[11px] text-charcoal-500">
                        Category: {ticket.category} • Reported by {ticket.tenantName} on {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-charcoal-500">
                      Priority: <strong className="text-charcoal-900">{ticket.priority}</strong>
                    </span>
                    <Badge variant={isResolved ? 'success' : isInProgress ? 'warning' : 'sage'} size="md">
                      {ticket.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                  {ticket.description}
                </p>

                {/* Photos if attached */}
                {ticket.photos.length > 0 && (
                  <div className="flex items-center gap-3">
                    {ticket.photos.map((p, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-charcoal-200">
                        <img src={p} alt="Evidence" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Landlord notes / Technician */}
                {(ticket.landlordNotes || ticket.assignedTechnician) && (
                  <div className="p-3.5 bg-ivory-50 rounded-xl border border-charcoal-200 text-xs space-y-1">
                    <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-sage-600" />
                      Landlord Vikram Singh Update:
                    </span>
                    {ticket.assignedTechnician && (
                      <p className="text-charcoal-600">Assigned Contractor: <strong>{ticket.assignedTechnician}</strong></p>
                    )}
                    {ticket.landlordNotes && (
                      <p className="text-charcoal-700 italic">"{ticket.landlordNotes}"</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <MaintenanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
