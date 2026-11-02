import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Building2, 
  Home, 
  Users, 
  CreditCard, 
  Wrench, 
  Plus, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LandlordOverviewPage: React.FC = () => {
  const { user } = useAuth();

  const properties = localStore.getProperties();
  const applications = localStore.getApplications();
  const maintenance = localStore.getMaintenanceRequests();
  const rentPayments = localStore.getRentPayments();

  const activeRentals = properties.filter(p => p.listingStatus === 'rented').length;
  const vacantProperties = properties.filter(p => p.listingStatus === 'active').length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const activeMaintenance = maintenance.filter(m => m.status !== 'RESOLVED').length;
  const monthlyCollection = properties
    .filter(p => p.listingStatus === 'rented')
    .reduce((sum, p) => sum + p.monthlyRent, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-200/80 dark:border-charcoal-700 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-lavender-800 uppercase tracking-wider">Landlord Hub</span>
            <Badge variant="lavender" size="sm">Portfolio Manager</Badge>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
            Welcome, {user?.name || 'Vikram Singh'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            4 Properties Listed • Direct Tenancy Management • 100% Broker-Free Platform
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/landlord/properties">
            <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase">Total Portfolio</span>
            <Building2 className="w-4 h-4 text-lavender-600" />
          </div>
          <span className="font-display font-bold text-2xl text-charcoal-900">
            {properties.length} Properties
          </span>
          <span className="text-[11px] text-charcoal-500 block">
            {activeRentals} Active • {vacantProperties} Vacant / Listed
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase">Monthly Rent Roll</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-display font-bold text-2xl text-charcoal-900">
            ₹{monthlyCollection.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            ✓ 100% Collected for November
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase">Applications</span>
            <Users className="w-4 h-4 text-sage-600" />
          </div>
          <span className="font-display font-bold text-2xl text-charcoal-900">
            {applications.length} Applicants
          </span>
          <span className="text-[11px] text-sage-800 font-medium block">
            {pendingApplications} Pending Review
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase">Maintenance</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-display font-bold text-2xl text-charcoal-900">
            {activeMaintenance} Active Tickets
          </span>
          <span className="text-[11px] text-amber-700 block">
            1 in progress, 1 resolved
          </span>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Rental Applications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900">Recent Applications</h3>
              <p className="text-xs text-charcoal-500">Direct tenant applications awaiting approval</p>
            </div>
            <Link to="/landlord/applications" className="text-xs font-semibold text-lavender-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map(app => (
              <div key={app.id} className="p-3.5 rounded-xl bg-ivory-50 border border-charcoal-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-charcoal-900">{app.tenantName}</h4>
                  <p className="text-[11px] text-charcoal-500">{app.propertyTitle}</p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">
                    {app.employmentStatus} • Move-in: {app.proposedMoveInDate}
                  </p>
                </div>
                <Badge variant={app.status === 'completed' ? 'success' : 'warning'} size="sm">
                  {app.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Maintenance Queue */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900">Maintenance Queue</h3>
              <p className="text-xs text-charcoal-500">Service requests from your active tenants</p>
            </div>
            <Link to="/landlord/maintenance" className="text-xs font-semibold text-lavender-700 hover:underline">
              Manage Tickets →
            </Link>
          </div>

          <div className="space-y-3">
            {maintenance.slice(0, 3).map(ticket => (
              <div key={ticket.id} className="p-3.5 rounded-xl bg-ivory-50 border border-charcoal-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-charcoal-900">{ticket.title}</h4>
                  <p className="text-[11px] text-charcoal-500">
                    {ticket.propertyTitle} • {ticket.tenantName}
                  </p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">
                    Priority: <strong className="text-charcoal-800 uppercase">{ticket.priority}</strong>
                  </p>
                </div>
                <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'} size="sm">
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
