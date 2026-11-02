import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  ClipboardCheck, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export const InspectionPage: React.FC = () => {
  const { household, inspections, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'move_in' | 'move_out'>('move_in');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  const moveInInspection = inspections.find(i => i.type === 'move_in') || inspections[0];

  const handleStartMoveOutCheck = () => {
    success('Move-out comparative inspection session started! You can now photograph each room to compare with baseline photos.');
    setActiveTab('move_out');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Property Condition Documentation
            </h1>
            <Badge variant="sage">BASELINE VERIFIED</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Room-by-room photographic checklists protecting deposit release at tenancy handover.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleStartMoveOutCheck}
          icon={<Camera className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Begin Move-Out Comparison
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal-200">
        <button
          onClick={() => setActiveTab('move_in')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'move_in'
              ? 'text-sage-700 border-b-2 border-sage-600'
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Move-In Baseline Checklist (Verified)
        </button>

        <button
          onClick={() => setActiveTab('move_out')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'move_out'
              ? 'text-sage-700 border-b-2 border-sage-600'
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Move-Out Comparative Inspection
        </button>
      </div>

      {/* Move-in Record View */}
      {activeTab === 'move_in' ? (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-ivory-50 p-4 rounded-2xl border border-charcoal-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Inspector</span>
              <span className="font-bold text-charcoal-900">{moveInInspection?.inspectorName} (Primary Tenant)</span>
            </div>
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Inspection Date</span>
              <span className="font-bold text-charcoal-900">{moveInInspection?.date}</span>
            </div>
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Landlord Counterpart Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Acknowledged & Locked by Vikram Singh
              </span>
            </div>
          </div>

          {/* Room Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {moveInInspection?.rooms.map((room, idx) => (
              <button
                key={room.roomName}
                onClick={() => setSelectedRoomIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  idx === selectedRoomIndex
                    ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                    : 'bg-white border-charcoal-200 text-charcoal-700 hover:bg-ivory-50'
                }`}
              >
                {room.roomName} ({room.condition.toUpperCase()})
              </button>
            ))}
          </div>

          {/* Room Detail Card */}
          {moveInInspection?.rooms[selectedRoomIndex] && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-100">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-charcoal-900">
                    {moveInInspection.rooms[selectedRoomIndex].roomName}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Assessed Condition: <strong className="text-sage-800 uppercase">{moveInInspection.rooms[selectedRoomIndex].condition}</strong>
                  </p>
                </div>
                <Badge variant="success" size="md">BASELINE LOCKED</Badge>
              </div>

              {/* Room Photo & Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="rounded-2xl overflow-hidden aspect-4/3 bg-charcoal-100 border border-charcoal-200 shadow-subtle">
                  <img
                    src={moveInInspection.rooms[selectedRoomIndex].photos[0]}
                    alt="Room baseline"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      Inspector Baseline Notes:
                    </h4>
                    <p className="p-3.5 rounded-xl bg-ivory-50 border border-charcoal-200/80 text-xs text-charcoal-800 leading-relaxed">
                      {moveInInspection.rooms[selectedRoomIndex].notes}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                      Fixtures & Appliances Verification:
                    </h4>
                    <div className="space-y-2">
                      {moveInInspection.rooms[selectedRoomIndex].fixturesChecked.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-charcoal-200 text-xs"
                        >
                          <span className="font-medium text-charcoal-800">{f.name}</span>
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {f.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Move-Out Comparative View */
        <Card className="p-8 text-center space-y-4 border-sage-300">
          <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-charcoal-900">
            Move-Out Handover Comparison
          </h3>
          <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
            When concluding your tenancy, upload updated photos for all 3 rooms. HomeSync automatically overlays your move-in photos side-by-side to verify condition, fair wear & tear, and release the ₹48,000 security deposit.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => success('Camera simulation: Room photos matched with 98% condition concordance!')}
            >
              Simulate Photo Upload & AI Comparison
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
