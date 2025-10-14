
import React, { useState } from 'react';
import type { RFQ, Supplier } from '../types';
import { findSuppliers } from '../services/geminiService';
import FileUpload from '../components/FileUpload';
import { Search, Loader, ServerCrash, ExternalLink, MapPin, Clock, CreditCard as CreditCardIcon } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [rfq, setRfq] = useState<RFQ>({ projectName: '', items: '' });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRfq(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field: 'file' | 'logo') => (file: File | undefined) => {
    setRfq(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfq.projectName || !rfq.items) {
      setError('Project Name and Items Required are mandatory.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSuppliers([]);

    try {
      const results = await findSuppliers(rfq);
      setSuppliers(results);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">RFQ & Supplier Discovery</h1>
        <p className="mt-2 text-gray-400">Create a Request for Quotation and let our AI find the best-verified suppliers in South Africa for you.</p>
      </div>

      <div className="bg-brand-secondary p-8 rounded-lg border border-gray-700 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-300">Project Name / Reference</label>
              <input
                type="text"
                name="projectName"
                id="projectName"
                value={rfq.projectName}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-white"
                placeholder="e.g., Office Renovation - Phase 1"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="items" className="block text-sm font-medium text-gray-300">Items Required (be as specific as possible)</label>
              <textarea
                name="items"
                id="items"
                rows={4}
                value={rfq.items}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-white"
                placeholder="e.g., 50x LED Downlights (Warm White), 200m of 2.5mm electrical cable, 10x Double-plug sockets"
              />
            </div>
            <FileUpload
              id="spec-sheet"
              label="Upload Spec Sheet (Optional)"
              file={rfq.file}
              onFileChange={handleFileChange('file')}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <FileUpload
              id="company-logo"
              label="Upload Company Logo (Optional)"
              file={rfq.logo}
              onFileChange={handleFileChange('logo')}
              accept="image/*"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Searching for suppliers...
                </>
              ) : (
                <>
                  <Search className="-ml-1 mr-2 h-5 w-5" />
                  Find Suppliers
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center space-x-3">
          <ServerCrash className="h-5 w-5" />
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      {suppliers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Verified Supplier Results</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {suppliers.map((supplier, index) => (
              <div key={index} className="bg-brand-secondary border border-gray-700 rounded-lg p-6 flex flex-col justify-between space-y-4 hover:border-brand-primary transition-colors">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">{supplier.name}</h3>
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm flex items-center mt-2">
                    <MapPin size={14} className="mr-2 flex-shrink-0" />
                    {supplier.location}
                  </p>
                </div>
                <div className="text-sm space-y-2 text-gray-300 pt-4 border-t border-gray-700">
                    <p className="flex items-center"><Clock size={14} className="mr-2 flex-shrink-0 text-brand-accent" />Lead Time: <span className="font-semibold ml-1">{supplier.leadTime}</span></p>
                    <p className="flex items-start"><CreditCardIcon size={14} className="mr-2 mt-0.5 flex-shrink-0 text-brand-accent" />Payment: <span className="font-semibold ml-1">{supplier.paymentMethods.join(', ')}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
