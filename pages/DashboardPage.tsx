import React, { useState } from 'react';
import type { RFQ, Supplier } from '../types';
import { findSuppliers } from '../services/geminiService';
import FileUpload from '../components/FileUpload';
import { Search, Loader, ServerCrash, ExternalLink, MapPin, Clock, CreditCard as CreditCardIcon, FileText, Download, Frown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SkeletonCard = () => (
  <div className="bg-brand-secondary border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-600 rounded w-full mb-6"></div>
    <div className="space-y-3 pt-4 border-t border-gray-700">
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-600 rounded w-5/6"></div>
    </div>
  </div>
);

const NoResults = () => (
  <div className="bg-brand-secondary border border-dashed border-gray-700 text-gray-400 p-8 rounded-lg text-center">
    <Frown className="mx-auto h-12 w-12 text-gray-500 mb-4" />
    <h3 className="text-xl font-bold text-white">No Suppliers Found</h3>
    <p className="mt-2 text-sm">We couldn't find any suppliers matching your request. Please try refining your search terms for better results.</p>
  </div>
);


const DashboardPage: React.FC = () => {
  const [rfq, setRfq] = useState<RFQ>({ projectName: '', items: '' });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
    setHasSearched(true);
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
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const tableColumn = ["Supplier Name", "Location", "Lead Time", "Payment Methods", "Website"];
    const tableRows: (string | string[])[][] = suppliers.map(s => [
      s.name, s.location, s.leadTime, s.paymentMethods.join(', '), s.website
    ]);

    let startY = 15;

    if (rfq.logo) {
      try {
        const logoDataUrl = await fileToBase64(rfq.logo);
        const img = new Image();
        img.src = logoDataUrl;
        await new Promise(resolve => { img.onload = resolve; });
        const aspectRatio = img.width / img.height;
        const logoWidth = 35;
        const logoHeight = logoWidth / aspectRatio;
        doc.addImage(logoDataUrl, 'PNG', 15, 15, logoWidth, logoHeight);
        startY = 25 + logoHeight;
      } catch (e) {
        console.error("Error adding logo to PDF", e);
        startY = 25;
      }
    }
    
    doc.setFontSize(18);
    doc.text(`RFQ Results: ${rfq.projectName}`, 14, startY);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: startY + 10,
    });
    
    doc.save(`RFQ_${rfq.projectName.replace(/\s+/g, '_')}_Suppliers.pdf`);
  };

  const handleExportCSV = () => {
    const headers = ["Supplier Name", "Website", "Location", "Lead Time", "Payment Methods"];
    const csvRows = [
      headers.join(','),
      ...suppliers.map(s => [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.website}"`,
        `"${s.location.replace(/"/g, '""')}"`,
        `"${s.leadTime.replace(/"/g, '""')}"`,
        `"${s.paymentMethods.join('; ')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `RFQ_${rfq.projectName.replace(/\s+/g, '_')}_Suppliers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              label="Upload Company Logo (For PDF Export)"
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

      {hasSearched && !isLoading && !error && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Verified Supplier Results</h2>
            {suppliers.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-brand-secondary hover:bg-gray-700 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-brand-secondary hover:bg-gray-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Export CSV
                </button>
              </div>
            )}
          </div>
          {suppliers.length > 0 ? (
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
                  <div className="text-sm space-y-3 text-gray-300 pt-4 border-t border-gray-700">
                    <p className="flex items-center"><Clock size={14} className="mr-2 flex-shrink-0 text-brand-accent" />Lead Time: <span className="font-semibold ml-1">{supplier.leadTime}</span></p>
                    <div className="flex items-start">
                      <CreditCardIcon size={14} className="mr-2 mt-1 flex-shrink-0 text-brand-accent" />
                      <div className="flex flex-wrap gap-1">
                        <span className="font-normal mr-1">Payment:</span>
                        {supplier.paymentMethods.map(method => (
                           <span key={method} className="bg-brand-dark text-xs font-semibold text-gray-300 px-2 py-0.5 rounded-full">{method}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <NoResults />
          )}
        </div>
      )}

      {isLoading && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Searching...</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;