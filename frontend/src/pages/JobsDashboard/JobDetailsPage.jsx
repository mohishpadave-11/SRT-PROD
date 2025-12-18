import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Ship, Plane, FileText, Users, MapPin, Calendar, Package, Anchor } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import DocumentExplorer from '../../components/dashboard/DocumentExplorer';
import PdfViewerModal from '../../components/documentdashboardcomponents/PdfViewerModal';
import CompanyDropdown from '../../components/form/CompanyDropdown';
import useFolderSystem from '../../hooks/useFolderSystem';
import { MOCK_EXPORTERS, MOCK_IMPORTERS, addExporter, addImporter } from '../../data/mockCompanies';



const JobDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();


  // -------------------------
  // Mock data (IDENTICAL to JobsDashboard)
  // Replace with API later
  // -------------------------
  const jobs = useMemo(() => {
    const base = [
      {
        id: 1,
        jobNo: "1123",
        date: "22-11-2025",
        exporterName: "Cottson Clothing",
        exporterAddress: "Wagle Estate, Thane, Mumbai",
        consigneeName: "DataCircles",
        consigneeAddress: "New York, USA",
        notifyParty: "ABC Corp",
        portOfLoading: "Mumbai Port",
        portOfDischarge: "New York Port",
        finalDestination: "New York",
        invoiceNo: "INV-2025-001",
        invoiceDate: "20-11-2025",
        shipmentType: "LCL",
        mode: "Air", // Air | Sea
        service: "Import", // Import | Export
        containerNo: "11",
        sobDate: "22-11-25",
        deliveredDate: "25-11-25",
        blNo: "1234",
        shippingBillNo: "SB-2025-001",
        shippingBillNoDate: "21-11-2025",
        billOfEntryNo: "BOE-2025-001",
        billOfEntryDate: "22-11-2025",
        vesselType: "Vessel", // Vessel | Flight
        vesselNo: "",
        flightNo: "",
        vesselNoDisplay: "VES-111",
        flightNoDisplay: "FL-222",
        eta: "10",
        volume: "100",
        blDate: "25-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf", type: 'document', size: '102KB', dateModified: '22-11-2025' },
          { id: 2, name: "PackingList.pdf", type: 'document', size: '210KB', dateModified: '22-11-2025' },
          { id: 3, name: "BL.pdf", type: 'document', size: '194KB', dateModified: '22-11-2025' },
          { id: 4, name: "Insurance.pdf", type: 'document', size: '340KB', dateModified: '22-11-2025' },
          { id: 5, name: "COO.pdf", type: 'document', size: '394KB', dateModified: '22-11-2025' },
          { id: 6, name: "ShippingBill.pdf", type: 'document', size: '385KB', dateModified: '22-11-2025' },
          { id: 7, name: "BillOfEntry.pdf", type: 'document', size: '364KB', dateModified: '22-11-2025' },
          { id: 8, name: "CustomsDeclaration.pdf", type: 'document', size: '282KB', dateModified: '22-11-2025' },
          { id: 9, name: "DeliveryOrder.pdf", type: 'document', size: '271KB', dateModified: '22-11-2025' },
          { id: 10, name: "CargoManifest.pdf", type: 'document', size: '597KB', dateModified: '22-11-2025' }
        ]
      },
      {
        id: 2,
        jobNo: "1133",
        date: "22-11-2025",
        exporterName: "Cottson Clothing",
        exporterAddress: "Wagle Estate, Thane, Mumbai",
        consigneeName: "DataCircles",
        consigneeAddress: "New York, USA",
        notifyParty: "XYZ Ltd",
        portOfLoading: "Mumbai Port",
        portOfDischarge: "Los Angeles Port",
        finalDestination: "California",
        invoiceNo: "INV-2025-002",
        invoiceDate: "20-11-2025",
        shipmentType: "FCL",
        mode: "Sea",
        service: "Export",
        containerNo: "45",
        sobDate: "25-11-25",
        deliveredDate: "27-11-25",
        blNo: "5678",
        shippingBillNo: "SB-2025-002",
        shippingBillNoDate: "24-11-2025",
        billOfEntryNo: "BOE-2025-002",
        billOfEntryDate: "25-11-2025",
        vesselType: "Vessel",
        vesselNo: "VES-123",
        flightNo: "",
        eta: "5",
        volume: "200",
        blDate: "22-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf", type: 'document', size: '102KB', dateModified: '22-11-2025' },
          { id: 2, name: "PackingList.pdf", type: 'document', size: '210KB', dateModified: '22-11-2025' }
        ]
      },
      {
        id: 3,
        jobNo: "1144",
        date: "22-11-2025",
        exporterName: "Cottson Clothing",
        exporterAddress: "Wagle Estate, Thane, Mumbai",
        consigneeName: "DataCircles",
        consigneeAddress: "New York, USA",
        notifyParty: "Global Trade",
        portOfLoading: "Mumbai Port",
        portOfDischarge: "Singapore Port",
        finalDestination: "Singapore",
        invoiceNo: "INV-2025-003",
        invoiceDate: "21-11-2025",
        shipmentType: "Part of FCL",
        mode: "Sea",
        service: "Export",
        containerNo: "9",
        sobDate: "18-11-25",
        deliveredDate: "20-11-25",
        blNo: "9999",
        shippingBillNo: "SB-2025-003",
        shippingBillNoDate: "19-11-2025",
        billOfEntryNo: "BOE-2025-003",
        billOfEntryDate: "20-11-2025",
        vesselType: "Flight",
        vesselNo: "",
        flightNo: "FL-777",
        eta: "3",
        volume: "150",
        blDate: "18-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf", type: 'document', size: '102KB', dateModified: '18-11-2025' },
          { id: 2, name: "BL.pdf", type: 'document', size: '194KB', dateModified: '18-11-2025' },
          { id: 3, name: "Insurance.pdf", type: 'document', size: '340KB', dateModified: '18-11-2025' }
        ]
      }
    ];

    for (let i = 4; i <= 20; i++) {
      base.push({
        id: i,
        jobNo: `1${150 + i}`,
        date: "22-11-2025",
        exporterName: "Cottson Clothing",
        exporterAddress: "Wagle Estate, Thane, Mumbai",
        consigneeName: "DataCircles",
        consigneeAddress: "New York, USA",
        notifyParty: `Party ${i}`,
        portOfLoading: "Mumbai Port",
        portOfDischarge: "Various Ports",
        finalDestination: "Various",
        invoiceNo: `INV-2025-${String(i).padStart(3, "0")}`,
        invoiceDate: "22-11-2025",
        shipmentType: "LCL",
        mode: "Sea",
        service: "Export",
        containerNo: "—",
        sobDate: "—",
        deliveredDate: "—",
        blNo: "—",
        shippingBillNo: "—",
        shippingBillNoDate: "—",
        billOfEntryNo: "—",
        billOfEntryDate: "—",
        vesselType: "Vessel",
        vesselNo: "-",
        flightNo: "-",
        eta: "—",
        volume: "—",
        blDate: "—",
        documents: []
      });
    }

    return base;
  }, []);

  const originalJob = jobs.find((j) => j.id === Number(id));

  if (!originalJob) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-xl font-semibold text-red-600">Job Not Found</h1>
        </div>
      </DashboardLayout>
    );
  }



  // Local editable state (start with original job's values)
  const [jobState, setJobState] = useState({ ...originalJob });
  // initialize edit mode from navigation state (JobsDashboard passes { state: { edit: true } })
  const [isEdit, setIsEdit] = useState(Boolean(location?.state?.edit));
  // Tab state
  const [activeTab, setActiveTab] = useState('details');

  // Use folder system hook for document management
  const { currentFolder, folderDocuments, openFolder, addDocuments, removeDocument } = useFolderSystem()
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [currentPdf, setCurrentPdf] = useState(null)

  // Simulate opening the current job as a folder when documents tab is active
  useEffect(() => {
    if (activeTab === 'documents' && !currentFolder) {
      // Simulate opening the job folder
      openFolder({
        id: originalJob.id,
        jobNo: originalJob.jobNo,
        type: 'folder'
      })
    }
  }, [activeTab, currentFolder, originalJob.id, originalJob.jobNo, openFolder])

  // Handlers for details
  const handleChange = (field, val) => {
    setJobState((s) => ({ ...s, [field]: val }));
  };

  const handleSave = () => {
    // TODO: call backend API to persist changes
    setIsEdit(false);
  };

  const handleCancel = () => {
    setJobState({ ...originalJob });
    setIsEdit(false);
  };

  // Document handlers for DocumentExplorer
  const handleDocumentClick = (document) => {
    // Handle document click - open PDF viewer for PDFs
    if (document.name && document.name.toLowerCase().endsWith('.pdf')) {
      setCurrentPdf(document)
      setShowPdfViewer(true)
    } else {
      // For non-PDF documents, show a message or handle differently
      alert(`Opening document: ${document.name || document.customerName}`)
    }
  }

  // Upload handler
  const handleFileUpload = (files, documentType) => {
    const success = addDocuments(files, documentType)
    
    if (!success) {
      alert('Please select a folder to upload documents to.')
      return
    }

    alert(`Successfully uploaded ${files.length} document(s) as ${documentType}`)
  }

  // Delete document handler
  const handleDeleteDocument = (e, documentId, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    if (confirm(`Are you sure you want to delete "${documentName}"?`)) {
      removeDocument(documentId)
      alert(`"${documentName}" has been deleted successfully.`)
    }
  }

  // Download document handler
  const handleDownloadDocument = (e, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    // Simulate download functionality
    alert(`Downloading "${documentName}"...`)
    // In a real application, you would trigger the actual download here
    // For example: window.open(downloadUrl) or fetch and create blob
  }

  // Company management handlers
  const handleAddExporter = (name, address) => {
    const newExporter = addExporter(name, address)
    alert(`Added new exporter: ${newExporter.name}`)
  }

  const handleAddImporter = (name, address) => {
    const newImporter = addImporter(name, address)
    alert(`Added new importer: ${newImporter.name}`)
  }



  return (
    <DashboardLayout>
      <div className="max-w-screen-2xl mx-auto text-slate-700">

            {/* TOP SECTION - More spacious on mobile */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  alt="Job avatar"
                  className="h-20 w-20 sm:h-16 sm:w-16 rounded-full object-cover mx-auto sm:mx-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0hre0Uaf6H2wCErC9vAft-lROWVxGlf_umIjMCejov2x73TpT-74cqY5GA4QCtiasZeQziJPYQPSzc7IHcAi8aKV1MLHLwmLSI-R7Vvc3Oe9SNgsCrs4vwUeKHBaAsNT-lOeVyuERP9l864stXe9DJqBENCDKPX_J6PRztNTCFjWftCrz1_od3Dylay4cmKLFhYmk4WO4qhxjynz2ABreRfGj7qXO7BUWlvzKZI6KLEIcKxvm9Dks_4_UOAawHVGjViLaD1PZnC0"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Job No {jobState.jobNo}</h1>
                  <p className="text-base sm:text-sm text-slate-500">Datacircles Technologies</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mt-6 lg:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-slate-600">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="font-medium">Created By:</span>
                    <span>Mohish Padave</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="font-medium">Created on:</span>
                    <span>{jobState.date}</span>
                  </div>
                </div>

                {/* Edit button section - More spacious */}
                <div className="mt-4 lg:mt-0">
                  {!isEdit ? (
                    <button
                      onClick={() => setIsEdit(true)}
                      aria-label="Edit job"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-slate-700 hover:bg-blue-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 12.25V15h2.75L17.81 4.94l-2.75-2.75L5 12.25z"/>
                      </svg>
                      <span className="text-sm font-medium">Edit</span>
                   </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path d="M5 8a1 1 0 011-1h8a1 1 0 011 1v7a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                          <path d="M9 3a1 1 0 011-1h0a1 1 0 011 1v3H9V3z" />
                        </svg>
                        <span className="text-sm font-medium">Save</span>
                     </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M6.707 4.293a1 1 0 00-1.414 1.414L8.586 9l-3.293 3.293a1 1 0 101.414 1.414L10 10.414l3.293 3.293a1 1 0 001.414-1.414L11.414 9l3.293-3.293a1 1 0 00-1.414-1.414L10 7.586 6.707 4.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABS NAVIGATION */}
            <div className="bg-white rounded-t-lg shadow-sm border border-slate-200 border-b-0">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'documents'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Documents
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white rounded-b-lg shadow-sm border border-slate-200 border-t-0 mb-6">
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Row 1: Shipment & Route + Current Status */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                      
                      {/* Shipment & Route Section */}
                      <div className="xl:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                          <div className="flex items-center gap-2 mb-6">
                            <Ship className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Shipment & Route</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Port of Loading */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Anchor className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PORT OF LOADING</span>
                              </div>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium">{jobState.portOfLoading || "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.portOfLoading || ""} 
                                  onChange={(e) => handleChange("portOfLoading", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                              )}
                            </div>

                            {/* Port of Discharge */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Anchor className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PORT OF DISCHARGE</span>
                              </div>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium">{jobState.portOfDischarge || "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.portOfDischarge || ""} 
                                  onChange={(e) => handleChange("portOfDischarge", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {/* Service */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">SERVICE</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.service || "—"}</div>
                              ) : (
                                <select value={jobState.service} onChange={(e) => handleChange("service", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1">
                                  <option value="Import">Import</option>
                                  <option value="Export">Export</option>
                                </select>
                              )}
                            </div>

                            {/* Type */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">TYPE</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.shipmentType || "—"}</div>
                              ) : (
                                <select value={jobState.shipmentType} onChange={(e) => handleChange("shipmentType", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1">
                                  <option value="LCL">LCL</option>
                                  <option value="FCL">FCL</option>
                                  <option value="Part of FCL">Part of FCL</option>
                                </select>
                              )}
                            </div>

                            {/* Mode */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">MODE</span>
                              <div className="flex items-center gap-1 mt-1">
                                {jobState.mode === 'Sea' ? <Ship className="w-4 h-4 text-blue-600" /> : <Plane className="w-4 h-4 text-blue-600" />}
                                {!isEdit ? (
                                  <span className="text-gray-900 font-medium">{jobState.mode || "—"}</span>
                                ) : (
                                  <select value={jobState.mode} onChange={(e) => handleChange("mode", e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="Sea">Sea</option>
                                    <option value="Air">Air</option>
                                  </select>
                                )}
                              </div>
                            </div>

                            {/* Volume */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">VOLUME</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.volume ? `${jobState.volume} CBM` : "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.volume || ""} 
                                  onChange={(e) => handleChange("volume", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  placeholder="CBM"
                                />
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {/* Vessel/Flight */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">VESSEL / FLIGHT</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">
                                  {jobState.vesselType === "Vessel" 
                                    ? (jobState.vesselNo || jobState.vesselNoDisplay || "—")
                                    : (jobState.flightNo || jobState.flightNoDisplay || "—")
                                  }
                                </div>
                              ) : (
                                <div className="flex gap-1 mt-1">
                                  <select value={jobState.vesselType} onChange={(e) => handleChange("vesselType", e.target.value)} className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="Vessel">Vessel</option>
                                    <option value="Flight">Flight</option>
                                  </select>
                                  {jobState.vesselType === "Vessel" ? (
                                    <input value={jobState.vesselNo || ""} onChange={(e) => handleChange("vesselNo", e.target.value)} placeholder="Vessel No" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  ) : (
                                    <input value={jobState.flightNo || ""} onChange={(e) => handleChange("flightNo", e.target.value)} placeholder="Flight No" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Container No */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONTAINER NO</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.containerNo || "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.containerNo || ""} 
                                  onChange={(e) => handleChange("containerNo", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                />
                              )}
                            </div>

                            {/* ETA */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ETA</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.eta || "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.eta || ""} 
                                  onChange={(e) => handleChange("eta", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                />
                              )}
                            </div>

                            {/* Delivered */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">DELIVERED</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.deliveredDate || "—"}</div>
                              ) : (
                                <input 
                                  type="date"
                                  value={jobState.deliveredDate || ""} 
                                  onChange={(e) => handleChange("deliveredDate", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div className="xl:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">CURRENT STATUS</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">ON TIME</span>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <div className="font-medium text-gray-900">Customs Cleared</div>
                                <div className="text-sm text-gray-500">{jobState.date}, 10:30 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div>
                                <div className="font-medium text-gray-500">Arrival at Port</div>
                                <div className="text-sm text-gray-400">Est. Oct 28</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div>
                                <div className="font-medium text-gray-500">Delivery</div>
                                <div className="text-sm text-gray-400">Est. Oct 30</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Documentation References + Parties Involved */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                      
                      {/* Documentation References Section */}
                      <div className="xl:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                          <div className="flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Documentation References</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Invoice Details */}
                            <div className="space-y-4">
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">INVOICE NO</span>
                                {!isEdit ? (
                                  <div className="text-gray-900 font-medium mt-1">{jobState.invoiceNo || "—"}</div>
                                ) : (
                                  <input 
                                    value={jobState.invoiceNo || ""} 
                                    onChange={(e) => handleChange("invoiceNo", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">BILL OF ENTRY NO</span>
                                {!isEdit ? (
                                  <div className="text-gray-900 font-medium mt-1">{jobState.billOfEntryNo || "—"}</div>
                                ) : (
                                  <input 
                                    value={jobState.billOfEntryNo || ""} 
                                    onChange={(e) => handleChange("billOfEntryNo", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">SOB DATE</span>
                                {!isEdit ? (
                                  <div className="text-gray-900 font-medium mt-1">{jobState.sobDate || "—"}</div>
                                ) : (
                                  <input 
                                    type="date"
                                    value={jobState.sobDate || ""} 
                                    onChange={(e) => handleChange("sobDate", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>
                            </div>

                            {/* BL and Shipping Details */}
                            <div className="space-y-4">
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">INVOICE DATE</span>
                                {!isEdit ? (
                                  <div className="text-gray-900 font-medium mt-1">{jobState.invoiceDate || "—"}</div>
                                ) : (
                                  <input 
                                    type="date"
                                    value={jobState.invoiceDate || ""} 
                                    onChange={(e) => handleChange("invoiceDate", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">BL NO</span>
                                {!isEdit ? (
                                  <div className="text-blue-600 font-medium mt-1 cursor-pointer hover:underline">{jobState.blNo || "—"}</div>
                                ) : (
                                  <input 
                                    value={jobState.blNo || ""} 
                                    onChange={(e) => handleChange("blNo", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>

                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">BL DATE</span>
                                {!isEdit ? (
                                  <div className="text-gray-900 font-medium mt-1">{jobState.blDate || "—"}</div>
                                ) : (
                                  <input 
                                    type="date"
                                    value={jobState.blDate || ""} 
                                    onChange={(e) => handleChange("blDate", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">BILL OF ENTRY DATE</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.billOfEntryDate || "—"}</div>
                              ) : (
                                <input 
                                  type="date"
                                  value={jobState.billOfEntryDate || ""} 
                                  onChange={(e) => handleChange("billOfEntryDate", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                />
                              )}
                            </div>

                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">SHIPPING BILL NO</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.shippingBillNo || "—"}</div>
                              ) : (
                                <input 
                                  value={jobState.shippingBillNo || ""} 
                                  onChange={(e) => handleChange("shippingBillNo", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Parties Involved */}
                      <div className="xl:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                          <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Parties Involved</h3>
                          </div>
                          
                          <div className="space-y-6">
                            {/* Exporter */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">EXPORTER NAME</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.exporterName || "—"}</div>
                              ) : (
                                <CompanyDropdown 
                                  label="" 
                                  value={jobState.exporterName} 
                                  isEdit={isEdit} 
                                  onChange={(v) => handleChange("exporterName", v)}
                                  companies={MOCK_EXPORTERS}
                                  placeholder="Select exporter..."
                                  onAddNew={handleAddExporter}
                                />
                              )}
                              
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">EXPORTER ADDRESS</span>
                                {!isEdit ? (
                                  <div className="text-gray-600 text-sm mt-1">{jobState.exporterAddress || "—"}</div>
                                ) : (
                                  <textarea 
                                    value={jobState.exporterAddress || ""} 
                                    onChange={(e) => handleChange("exporterAddress", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm" 
                                    rows="2"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Consignee */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONSIGNEE NAME</span>
                              {!isEdit ? (
                                <div className="text-gray-900 font-medium mt-1">{jobState.consigneeName || "—"}</div>
                              ) : (
                                <CompanyDropdown 
                                  label="" 
                                  value={jobState.consigneeName} 
                                  isEdit={isEdit} 
                                  onChange={(v) => handleChange("consigneeName", v)}
                                  companies={MOCK_IMPORTERS}
                                  placeholder="Select importer..."
                                  onAddNew={handleAddImporter}
                                />
                              )}
                              
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONSIGNEE ADDRESS</span>
                                {!isEdit ? (
                                  <div className="text-gray-600 text-sm mt-1">{jobState.consigneeAddress || "—"}</div>
                                ) : (
                                  <textarea 
                                    value={jobState.consigneeAddress || ""} 
                                    onChange={(e) => handleChange("consigneeAddress", e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm" 
                                    rows="2"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="-m-4 sm:-m-6 md:-m-8 p-4 sm:p-6 md:p-8">
                    <DocumentExplorer
                      documents={folderDocuments}
                      currentFolder={currentFolder}
                      isLoading={false}
                      onDocumentClick={handleDocumentClick}
                      onUpload={handleFileUpload}
                      onDelete={handleDeleteDocument}
                      onDownload={handleDownloadDocument}
                      allowUpload={true}
                      title="Job Documents"
                      subtitle={`Manage documents for Job No ${jobState.jobNo}`}
                      showStats={false}
                      showBreadcrumb={false}
                    />
                  </div>
                )}
              </div>
            </div>



      </div>

      {/* PDF Viewer Modal */}
      <PdfViewerModal 
        isOpen={showPdfViewer}
        fileName={currentPdf?.name}
        onClose={() => setShowPdfViewer(false)}
        onDownload={handleDownloadDocument}
      />
    </DashboardLayout>
  );
};

/**
 * FieldDisplay
 * - label: string
 * - value: string
 * - isEdit: bool
 * - onChange: fn(newVal)
 */
const FieldDisplay = ({ label, value, isEdit, onChange = () => {} }) => {
  return (
    <div className="space-y-2">
      <dt className="font-medium text-slate-700 text-sm">{label}</dt>
      <dd>
        {!isEdit ? (
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">
            {value ?? "—"}
          </div>
        ) : (
          <input 
            value={value ?? ""} 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        )}
      </dd>
    </div>
  );
};

/**
 * DateFieldDisplay - Special component for date fields with calendar picker
 * - label: string
 * - value: string (date value)
 * - isEdit: bool
 * - onChange: fn(newVal)
 */
const DateFieldDisplay = ({ label, value, isEdit, onChange = () => {} }) => {
  // Convert DD-MM-YYYY format to YYYY-MM-DD for HTML5 date input
  const formatDateForInput = (dateStr) => {
    if (!dateStr || dateStr === "—") return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    
    // Convert DD-MM-YYYY to YYYY-MM-DD
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return "";
  };

  // Convert YYYY-MM-DD back to DD-MM-YYYY for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "—";
    
    // If in YYYY-MM-DD format, convert to DD-MM-YYYY
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }
    
    return dateStr;
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value; // YYYY-MM-DD format
    // Convert back to DD-MM-YYYY format for storage
    if (inputDate) {
      const [year, month, day] = inputDate.split("-");
      onChange(`${day}-${month}-${year}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-2">
      <dt className="font-medium text-slate-700 text-sm">{label}</dt>
      <dd>
        {!isEdit ? (
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">
            {formatDateForDisplay(value)}
          </div>
        ) : (
          <input 
            type="date" 
            value={formatDateForInput(value)} 
            onChange={handleDateChange} 
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        )}
      </dd>
    </div>
  );
};

export default JobDetailsPage;