import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { MaintenanceRequest } from '../../types';
import { Wrench, UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose }) => {
  const { household, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceRequest['category']>('Plumbing');
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('medium');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...uploadedUrls]);
      success(`Uploaded ${uploadedUrls.length} image(s) to Cloudinary successfully!`);
    } catch (err) {
      console.error(err);
      error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      error('Please provide an issue title and description');
      return;
    }

    localStore.addMaintenanceRequest({
      householdId: household.id,
      propertyId: household.propertyId,
      propertyTitle: household.propertyName,
      tenantUid: user?.uid || 'user-aanya',
      tenantName: user?.name || 'Aanya Sharma',
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
    });

    localStore.addNotification({
      userId: household.landlordUid,
      householdId: household.id,
      title: 'New Maintenance Ticket',
      message: `${user?.name} submitted ticket: "${title}" with ${photos.length} photo(s) (${priority.toUpperCase()} priority).`,
      type: 'maintenance'
    });

    success('Maintenance complaint submitted to landlord Vikram Singh!');
    refreshData();
    onClose();

    setTitle('');
    setDescription('');
    setPhotos([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Maintenance Issue"
      subtitle="Tickets are dispatched directly to landlord & verified service contractors"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block mb-1">Issue Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Geyser water not heating adequately / Bathroom pipe leakage"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-lg px-3.5 py-2 text-sm text-charcoal-900 dark:text-ivory-100 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-900 dark:text-ivory-100"
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Appliance">Appliance</option>
              <option value="Carpentry">Carpentry</option>
              <option value="HVAC">HVAC / Air Conditioning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block mb-1">Urgency / Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-900 dark:text-ivory-100"
            >
              <option value="low">Low (Cosmetic/Convenience)</option>
              <option value="medium">Medium (Standard Repair)</option>
              <option value="high">High (Affects daily living)</option>
              <option value="urgent">Urgent (Emergency leak/electrical)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block mb-1">Detailed Description</label>
          <textarea
            required
            rows={3}
            placeholder="Please detail when it started, location in house, and any troubleshooting done..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-lg px-3.5 py-2 text-sm text-charcoal-900 dark:text-ivory-100 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        {/* Cloudinary Photo Upload */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              Photos of Issue (Cloudinary Powered)
            </label>
            <span className="text-[10px] text-charcoal-400">
              {photos.length} uploaded
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
              photos.length > 0
                ? 'border-sage-500 bg-sage-50/60 dark:bg-sage-950/30 text-sage-800 dark:text-sage-300'
                : 'border-charcoal-200 dark:border-charcoal-700 hover:border-charcoal-400 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-900 text-charcoal-500 dark:text-charcoal-400'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                <span className="text-xs font-medium">Uploading to Cloudinary...</span>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-6 h-6 mx-auto mb-1 opacity-70 text-sage-600" />
                <p className="text-xs font-semibold">
                  Click to choose or drop photos of damage / issue
                </p>
                <p className="text-[10px] text-charcoal-400 mt-0.5">
                  Uploads directly to Cloudinary (PNG, JPG, WebP)
                </p>
              </div>
            )}
          </div>

          {/* Photo Preview Grid */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-charcoal-200 dark:border-charcoal-700 shadow-2xs group">
                  <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-charcoal-900/80 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Submit Complaint'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
