'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

interface ReportHotspotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportHotspotDialog({ open, onOpenChange }: ReportHotspotDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    locationName: '',
    pollutionType: 'vehicular',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationName: formData.locationName,
          description: `${formData.pollutionType}: ${formData.description}`,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      await response.json();
      
      // Success toast
      toast.success('Report Submitted Successfully!', {
        description: `Thank you for reporting pollution at ${formData.locationName}. Your contribution helps improve air quality monitoring.`,
        duration: 5000,
      });

      // Reset form
      setFormData({
        locationName: '',
        pollutionType: 'vehicular',
        description: '',
      });

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Submission Failed', {
        description: 'There was an error submitting your report. Please try again.',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] bg-gray-800 border-gray-700 text-white m-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-white">Report Pollution</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Help monitor air quality in your area
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="locationName" className="text-gray-200 text-sm font-medium">
              Location Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="locationName"
              placeholder="e.g., Bhubaneswar Railway Station"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-12 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="pollutionType" className="text-gray-200 text-sm font-medium">
              Pollution Type <span className="text-red-400">*</span>
            </Label>
            <Select
              id="pollutionType"
              value={formData.pollutionType}
              onChange={(e) => setFormData({ ...formData, pollutionType: e.target.value })}
              required
              className="bg-gray-700 border-gray-600 text-white h-12 text-base"
            >
              <option value="vehicular">🚗 Vehicular Emissions</option>
              <option value="industrial">🏭 Industrial Pollution</option>
              <option value="fire">🔥 Open Burning / Fire</option>
              <option value="construction">🚧 Construction Dust</option>
              <option value="waste">🗑️ Waste Burning</option>
              <option value="other">❓ Other</option>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-200 text-sm font-medium">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the pollution source and its impact..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-base resize-none"
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto h-12 border-gray-600 text-gray-300 hover:bg-gray-700 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
