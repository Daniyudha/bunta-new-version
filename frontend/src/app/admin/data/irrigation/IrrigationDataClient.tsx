'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

interface WaterLevelData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface RainfallData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CropData {
  id: string;
  crop: string;
  area: number;
  production: number;
  season: string;
  location: string | null;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Farmer {
  id: string;
  name: string;
  group: string;
  chairman: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

interface IrrigationProfile {
  id: string;
  name: string;
}

type DataType = 'water-level' | 'rainfall' | 'crops' | 'farmers';

// ─── Add Form Data ───────────────────────────────────────────────────────────

interface AddFormData {
  location: string;
  value: string;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  crop: string;
  area: string;
  production: string;
  season: string;
  name: string;
  group: string;
  chairman: string;
  members: string;
}

const emptyAddForm: AddFormData = {
  location: '', value: '', unit: '', measuredAt: '', recordedBy: '',
  crop: '', area: '', production: '', season: '',
  name: '', group: '', chairman: '', members: '',
};

// ─── Tab Configuration ──────────────────────────────────────────────────────

const tabs: { id: DataType; label: string; color: string }[] = [
  { id: 'water-level', label: 'Level Air (TMA)', color: 'bg-cyan-600' },
  { id: 'rainfall', label: 'Curah Hujan', color: 'bg-green-600' },
  { id: 'crops', label: 'Data Tanaman', color: 'bg-amber-600' },
  { id: 'farmers', label: 'Data Petani', color: 'bg-indigo-600' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function IrrigationDataClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<DataType>('water-level');
  const [locations, setLocations] = useState<IrrigationProfile[]>([]);
  const [dataLocation, setDataLocation] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data state per tab
  const [waterLevelData, setWaterLevelData] = useState<WaterLevelData[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [farmerData, setFarmerData] = useState<Farmer[]>([]);

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState<AddFormData>(emptyAddForm);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Import/Export state
  const [showImportModal, setShowImportModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/admin/irrigation-profiles?limit=500');
        const data = await res.json();
        setLocations(data.profiles || []);
      } catch (e) {
        console.error('Failed to fetch locations:', e);
      }
    };
    if (status === 'authenticated') fetchLocations();
  }, [status]);

  // Fetch data for active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpointMap: Record<DataType, string> = {
        'water-level': '/api/admin/data/water-level',
        'rainfall': '/api/admin/data/rainfall',
        'crops': '/api/admin/data/crops',
        'farmers': '/api/admin/farmers',
      };
      const url = new URL(endpointMap[activeTab], window.location.origin);
      if (dataLocation !== 'all') url.searchParams.append('location', dataLocation);
      url.searchParams.append('limit', '500');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      const items = data.data || data || [];

      switch (activeTab) {
        case 'water-level': setWaterLevelData(items); break;
        case 'rainfall': setRainfallData(items); break;
        case 'crops': setCropData(items); break;
        case 'farmers': setFarmerData(items); break;
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, dataLocation]);

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [fetchData, status]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const endpointMap: Record<DataType, string> = {
        'water-level': `/api/admin/data/water-level/${id}`,
        'rainfall': `/api/admin/data/rainfall/${id}`,
        'crops': `/api/admin/data/crops/${id}`,
        'farmers': `/api/admin/farmers/${id}`,
      };
      const res = await fetch(endpointMap[activeTab], { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchData();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  // Handle add form
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSubmitting(true);
    setError('');
    try {
      let body: any;
      let endpoint: string;

      switch (activeTab) {
        case 'water-level':
          body = { location: addFormData.location, value: parseFloat(addFormData.value), unit: addFormData.unit, measuredAt: addFormData.measuredAt, recordedBy: addFormData.recordedBy };
          endpoint = '/api/admin/data/water-level';
          break;
        case 'rainfall':
          body = { location: addFormData.location, value: parseFloat(addFormData.value), unit: addFormData.unit, measuredAt: addFormData.measuredAt, recordedBy: addFormData.recordedBy };
          endpoint = '/api/admin/data/rainfall';
          break;
        case 'crops':
          body = { crop: addFormData.crop, area: parseFloat(addFormData.area), production: parseFloat(addFormData.production), season: addFormData.season, location: addFormData.location || undefined, recordedBy: addFormData.recordedBy };
          endpoint = '/api/admin/data/crops';
          break;
        case 'farmers':
          body = { name: addFormData.name, group: addFormData.group, chairman: addFormData.chairman, members: addFormData.members ? addFormData.members.split(',').map((m: string) => m.trim()) : [] };
          endpoint = '/api/admin/farmers';
          break;
        default: throw new Error('Unknown tab');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save');
      }
      setShowAddForm(false);
      setAddFormData(emptyAddForm);
      fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddSubmitting(false);
    }
  };

  // Export
  const handleExport = () => {
    const getData = (): any[] => {
      switch (activeTab) {
        case 'water-level': return waterLevelData.map(d => ({ Location: d.location, Value: d.value, Unit: d.unit, MeasuredAt: d.measuredAt, RecordedBy: d.recordedBy }));
        case 'rainfall': return rainfallData.map(d => ({ Location: d.location, Value: d.value, Unit: d.unit, MeasuredAt: d.measuredAt, RecordedBy: d.recordedBy }));
        case 'crops': return cropData.map(d => ({ Crop: d.crop, Area: d.area, Production: d.production, Season: d.season, Location: d.location || '' }));
        case 'farmers': return farmerData.map(d => ({ Name: d.name, Group: d.group, Chairman: d.chairman, Members: d.members.join(', ') }));
        default: return [];
      }
    };
    const ws = XLSX.utils.json_to_sheet(getData());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${activeTab}-data.xlsx`);
  };

  // Import
  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = event.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
    if (!fileInput?.files?.[0]) return;
    setLoading(true);
    setError('');
    try {
      const file = fileInput.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      let successCount = 0;

      for (const row of rows) {
        try {
          let body: any;
          let endpoint: string;
          switch (activeTab) {
            case 'water-level':
              body = { location: row.Location || row.location, value: parseFloat(row.Value || row.value), unit: row.Unit || row.unit || 'm', measuredAt: row.MeasuredAt || row.measuredAt || new Date().toISOString(), recordedBy: row.RecordedBy || row.recordedBy || 'Import' };
              endpoint = '/api/admin/data/water-level';
              break;
            case 'rainfall':
              body = { location: row.Location || row.location, value: parseFloat(row.Value || row.value), unit: row.Unit || row.unit || 'mm', measuredAt: row.MeasuredAt || row.measuredAt || new Date().toISOString(), recordedBy: row.RecordedBy || row.recordedBy || 'Import' };
              endpoint = '/api/admin/data/rainfall';
              break;
            case 'crops':
              body = { crop: row.Crop || row.crop, area: parseFloat(row.Area || row.area), production: parseFloat(row.Production || row.production), season: row.Season || row.season, location: row.Location || row.location || undefined, recordedBy: row.RecordedBy || row.recordedBy || 'Import' };
              endpoint = '/api/admin/data/crops';
              break;
            case 'farmers':
              body = { name: row.Name || row.name, group: row.Group || row.group, chairman: row.Chairman || row.chairman, members: (row.Members || row.members || '').split(',').map((m: string) => m.trim()) };
              endpoint = '/api/admin/farmers';
              break;
            default: throw new Error('Unknown tab');
          }
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (res.ok) successCount++;
        } catch (rowErr) {
          console.error('Import row error:', rowErr);
        }
      }
      alert(`Berhasil mengimpor ${successCount} dari ${rows.length} data.`);
      setShowImportModal(false);
      fetchData();
    } catch (e: any) {
      setError('Import error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Download template
  const downloadTemplate = () => {
    let data: any[] = [];
    switch (activeTab) {
      case 'water-level': data = [{ Location: '', Value: '', Unit: 'm', MeasuredAt: '', RecordedBy: '' }]; break;
      case 'rainfall': data = [{ Location: '', Value: '', Unit: 'mm', MeasuredAt: '', RecordedBy: '' }]; break;
      case 'crops': data = [{ Crop: '', Area: '', Production: '', Season: '', Location: '', RecordedBy: '' }]; break;
      case 'farmers': data = [{ Name: '', Group: '', Chairman: '', Members: '' }]; break;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${activeTab}-template.xlsx`);
  };

  // Format date
  const formatDateTime = (d: string | Date) => {
    return new Date(d).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ─── Render Helpers ────────────────────────────────────────────────────────

  const getCurrentData = () => {
    switch (activeTab) {
      case 'water-level': return waterLevelData;
      case 'rainfall': return rainfallData;
      case 'crops': return cropData;
      case 'farmers': return farmerData;
      default: return [];
    }
  };

  const getTabTitle = () => {
    const t = tabs.find(t => t.id === activeTab);
    return t ? t.label : '';
  };

  const renderAddForm = () => {
    switch (activeTab) {
      case 'water-level':
      case 'rainfall':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              {locations.length > 0 ? (
                <select name="location" value={addFormData.location} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm">
                  <option value="">-- Pilih --</option>
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              ) : (
                <input type="text" name="location" value={addFormData.location} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
              <input type="number" name="value" value={addFormData.value} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input type="text" name="unit" value={addFormData.unit} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Ukur</label>
              <input type="datetime-local" name="measuredAt" value={addFormData.measuredAt} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dicatat Oleh</label>
              <input type="text" name="recordedBy" value={addFormData.recordedBy} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
          </div>
        );
      case 'crops':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanaman</label>
              <input type="text" name="crop" value={addFormData.crop} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Luas (ha)</label>
              <input type="number" name="area" value={addFormData.area} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produksi (ton)</label>
              <input type="number" name="production" value={addFormData.production} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Musim</label>
              <input type="text" name="season" value={addFormData.season} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input type="text" name="location" value={addFormData.location} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dicatat Oleh</label>
              <input type="text" name="recordedBy" value={addFormData.recordedBy} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
          </div>
        );
      case 'farmers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Petani</label>
              <input type="text" name="name" value={addFormData.name} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok Tani</label>
              <input type="text" name="group" value={addFormData.group} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ketua</label>
              <input type="text" name="chairman" value={addFormData.chairman} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anggota (pisahkan dengan koma)</label>
              <input type="text" name="members" value={addFormData.members} onChange={handleAddFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderTable = () => {
    const data = getCurrentData();
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">Belum ada data tersedia. Tambahkan data baru.</div>
      );
    }

    switch (activeTab) {
      case 'water-level':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Ukur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dicatat Oleh</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as WaterLevelData[]).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(item.measuredAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.recordedBy || '-'}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'rainfall':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Ukur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dicatat Oleh</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as RainfallData[]).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(item.measuredAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.recordedBy || '-'}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'crops':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanaman</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Luas (ha)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produksi (ton)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Musim</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as CropData[]).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.crop}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.area}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.production}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.season}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.location || '-'}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'farmers':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelompok</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketua</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anggota</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as Farmer[]).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.group || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.chairman || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.members?.length || 0} anggota</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default: return null;
    }
  };

  // ─── Main Render ──────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Irigasi</h1>
          <p className="mt-2 text-gray-600">
            Kelola data level air, curah hujan, data tanaman, dan data petani.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowAddForm(false); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Filter Lokasi:</label>
              <select
                value={dataLocation}
                onChange={(e) => setDataLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              >
                <option value="all">Semua Lokasi</option>
                {locations.map(l => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                {showAddForm ? 'Tutup Form' : `+ Tambah ${getTabTitle()}`}
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                Export Excel
              </button>
              <button onClick={() => setShowImportModal(true)} className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
                Import Excel
              </button>
              <button onClick={downloadTemplate} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                Template
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah {getTabTitle()}</h3>
            <form onSubmit={handleAddSubmit}>
              {renderAddForm()}
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
                <button type="submit" disabled={addSubmitting} className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                  {addSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {renderTable()}
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Import Data {getTabTitle()}</h3>
            <form onSubmit={handleImport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih file Excel (.xlsx)</label>
                <input type="file" accept=".xlsx,.xls" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Import</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
