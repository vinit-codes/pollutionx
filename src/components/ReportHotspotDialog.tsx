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
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Report a Pollution Hotspot</DialogTitle>
          <DialogDescription className="text-gray-400">
            Help us improve air quality monitoring by reporting pollution sources in your area.
            Your contribution is valuable to the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="locationName" className="text-gray-200">
              Location Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="locationName"
              placeholder="e.g., Bhubaneswar Railway Station"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pollutionType" className="text-gray-200">
              Pollution Type <span className="text-red-400">*</span>
            </Label>
            <Select
              id="pollutionType"
              value={formData.pollutionType}
              onChange={(e) => setFormData({ ...formData, pollutionType: e.target.value })}
              required
              className="bg-gray-700 border-gray-600 text-white"
            >
              <option value="vehicular">Vehicular Emissions</option>
              <option value="industrial">Industrial Pollution</option>
              <option value="fire">Open Burning / Fire</option>
              <option value="construction">Construction Dust</option>
              <option value="waste">Waste Burning</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe the pollution source, its severity, and any other relevant details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
