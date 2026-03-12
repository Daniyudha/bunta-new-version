'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type DataType = 'water-level' | 'rainfall' | 'crop' | 'farmer';

export default function DataInputClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dataType, setDataType] = useState<DataType>('water-level');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    location: '',
    value: '',
    unit: '',
    measuredAt: new Date().toISOString().slice(0, 16),
    crop: '',
    area: '',
    production: '',
    season: '',
    // Old farmer data fields (for FarmerData model)
    district: '',
    farmers: '',
    averageYield: '',
    // New farmer fields (for Farmer model)
    name: '',
    group: '',
    chairman: '',
    members: '', // Will be stored as comma-separated string, converted to array
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let apiUrl = '';
      let requestBody = {};

      switch (dataType) {
        case 'water-level':
          apiUrl = '/api/admin/data/water-level';
          requestBody = {
            location: formData.location,
            value: parseFloat(formData.value),
            unit: formData.unit || 'cm',
            measuredAt: formData.measuredAt,
          };
          break;
        case 'rainfall':
          apiUrl = '/api/admin/data/rainfall';
          requestBody = {
            location: formData.location,
            value: parseFloat(formData.value),
            unit: formData.unit || 'mm',
            measuredAt: formData.measuredAt,
          };
          break;
        case 'crop':
          apiUrl = '/api/admin/data/crops';
          requestBody = {
            crop: formData.crop,
            area: parseFloat(formData.area),
            production: parseFloat(formData.production),
            season: formData.season,
            location: formData.location || null,
          };
          break;
        case 'farmer':
          apiUrl = '/api/admin/farmers';
          requestBody = {
            name: formData.name,
            group: formData.group,
            chairman: formData.chairman,
            members: formData.members.split(',').map(member => member.trim()).filter(member => member !== ''),
          };
          break;
        default:
          throw new Error('Invalid data type');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        let successMessage = '';
        switch (dataType) {
          case 'water-level':
            successMessage = 'Water level data submitted successfully!';
            break;
          case 'rainfall':
            successMessage = 'Rainfall data submitted successfully!';
            break;
          case 'crop':
            successMessage = 'Crop data submitted successfully!';
            break;
          case 'farmer':
            successMessage = 'Farmer data submitted successfully!';
            break;
        }
        setSuccess(successMessage);
        setFormData({
          location: '',
          value: '',
          unit: '',
          measuredAt: new Date().toISOString().slice(0, 16),
          crop: '',
          area: '',
          production: '',
          season: '',
          district: '',
          farmers: '',
          averageYield: '',
          name: '',
          group: '',
          chairman: '',
          members: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit data');
      }
    } catch (err) {
      setError('Error submitting data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Input</h1>
          <p className="text-gray-600 mt-2">Input irrigation metrics data</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataType)}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="water-level">Water Level (TMA)</option>
              <option value="rainfall">Rainfall</option>
              <option value="crop">Crop Data</option>
              <option value="farmer">Farmer Data</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {(dataType === 'water-level' || dataType === 'rainfall') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location name"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    name="value"
                    required
                    step="0.01"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder={dataType === 'water-level' ? 'Enter water level in cm' : 'Enter rainfall in mm'}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder={dataType === 'water-level' ? 'cm (default)' : 'mm (default)'}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank to use default unit ({dataType === 'water-level' ? 'cm' : 'mm'})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurement Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="measuredAt"
                    required
                    value={formData.measuredAt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {dataType === 'crop' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="crop"
                    required
                    value={formData.crop}
                    onChange={handleInputChange}
                    placeholder="Enter crop name (e.g., Padi, Jagung)"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (Hektar)
                  </label>
                  <input
                    type="number"
                    name="area"
                    required
                    step="0.01"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area in hectares"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production (Ton)
                  </label>
                  <input
                    type="number"
                    name="production"
                    required
                    step="0.01"
                    value={formData.production}
                    onChange={handleInputChange}
                    placeholder="Enter production in tons"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Season
                  </label>
                  <input
                    type="text"
                    name="season"
                    required
                    value={formData.season}
                    onChange={handleInputChange}
                    placeholder="Enter season (e.g., Musim Hujan, Musim Kemarau)"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter specific location (optional)"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {dataType === 'farmer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Petani/Kelompok
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter farmer or group name"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kelompok Tani
                  </label>
                  <input
                    type="text"
                    name="group"
                    required
                    value={formData.group}
                    onChange={handleInputChange}
                    placeholder="Enter farmer group name"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Ketua Kelompok
                  </label>
                  <input
                    type="text"
                    name="chairman"
                    required
                    value={formData.chairman}
                    onChange={handleInputChange}
                    placeholder="Enter group chairman name"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama-nama Anggota (pisahkan dengan koma)
                  </label>
                  <textarea
                    name="members"
                    required
                    value={formData.members}
                    onChange={handleInputChange}
                    placeholder="Enter member names separated by commas"
                    rows={3}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Contoh: Budi Santoso, Siti Rahayu, Ahmad Fauzi
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Data'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            {dataType === 'water-level' && (
              <>
                <li>• Water level (TMA) is typically measured in centimeters (cm)</li>
                <li>• Use specific location names for better data organization</li>
                <li>• Ensure measurement datetime is accurate for historical records</li>
              </>
            )}
            {dataType === 'rainfall' && (
              <>
                <li>• Rainfall is typically measured in millimeters (mm)</li>
                <li>• Use specific location names for better data organization</li>
                <li>• Ensure measurement datetime is accurate for historical records</li>
              </>
            )}
            {dataType === 'crop' && (
              <>
                <li>• Area should be entered in hectares (Ha)</li>
                <li>• Production should be entered in tons</li>
                <li>• Season examples: Musim Hujan, Musim Kemarau, etc.</li>
                <li>• Location is optional but helps with data organization</li>
              </>
            )}
            {dataType === 'farmer' && (
              <>
                <li>• Enter the name of the farmer or farmer group</li>
                <li>• Specify the official name of the farmer group</li>
                <li>• Enter the full name of the group chairman</li>
                <li>• List all member names separated by commas</li>
                <li>• Example member format: &ldquo;Budi Santoso, Siti Rahayu, Ahmad Fauzi&rdquo;</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
