import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Plane, FileText, Users, MapPin, Calendar, Package, Anchor } from 'lucide-react';
import { addJob } from "../../lib/jobsStorage";
import DashboardLayout from '../../components/layout/DashboardLayout';
import CompanyDropdown from '../../components/form/CompanyDropdown';
import DocumentExplorer from '../../components/dashboard/DocumentExplorer';
import PdfViewerModal from '../../components/documentdashboardcomponents/PdfViewerModal';
import FormInput from '../../components/form/FormInput';
import FormSelect from '../../components/form/FormSelect';
import JobFormSection from '../../components/form/JobFormSection';
import { MOCK_EXPORTERS, MOCK_IMPORTERS, addExporter, addImporter } from '../../data/mockCompanies';

const NewJobPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [form, setForm] = useState({
    jobNo: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    exporterName: "",
    exporterAddress: "",
    consigneeName: "",
    consigneeAddress: "",
    notifyParty: "",
    portOfLoading: "",
    portOfDischarge: "",
    finalDestination: "",
    invoiceNo: "",
    invoiceDate: "",
    shipmentType: "LCL",
    mode: "Sea",
    service: "Import",
    containerNo: "",
    sobDate: "",
    deliveredDate: "",
    blNo: "",
    shippingBillNo: "",
    shippingBillNoDate: "",
    billOfEntryNo: "",
    billOfEntryDate: "",
    vesselType: "Vessel",
    vesselNo: "",
    flightNo: "",
    eta: "",
    volume: "",
    blDate: "",
  });

  // Mock documents for new job (empty initially)
  const [documents, setDocuments] = useState([]);
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [currentPdf, setCurrentPdf] = useState(null)

  const handleChange = (field, value) => setForm((s) => ({ ...s, [field]: value }));

  // Company management handlers
  const handleAddExporter = (name, address) => {
    const newExporter = addExporter(name, address)
    alert(`Added new exporter: ${newExporter.name}`)
  }

  const handleAddImporter = (name, address) => {
    const newImporter = addImporter(name, address)
    alert(`Added new importer: ${newImporter.name}`)
  }

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
    // Simulate adding documents to the new job
    const newDocs = files.map((file, index) => ({
      id: documents.length + index + 1,
      name: file.name,
      type: 'document',
      size: `${Math.round(file.size / 1024)}KB`,
      dateModified: new Date().toISOString().split('T')[0],
      customerName: form.exporterName || 'New Job'
    }))
    
    setDocuments(prev => [...prev, ...newDocs])
    alert(`Successfully uploaded ${files.length} document(s)`)
  }

  // Delete document handler
  const handleDeleteDocument = (e, documentId, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    if (confirm(`Are you sure you want to delete "${documentName}"?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      alert(`"${documentName}" has been deleted successfully.`)
    }
  }

  // Download document handler
  const handleDownloadDocument = (e, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    // Simulate download functionality
    alert(`Downloading "${documentName}"...`)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.jobNo || !form.exporterName) {
      alert("Please fill required fields: Job No and Exporter Name");
      return;
    }
    
    addJob(form);
    alert("Job created successfully");
    navigate("/jobs-dashboard");
  };

  return (
    <DashboardLayout>
      <div className="max-w-screen-2xl mx-auto text-slate-700">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              alt="New job avatar"
              className="h-20 w-20 sm:h-16 sm:w-16 rounded-full object-cover mx-auto sm:mx-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0hre0Uaf6H2wCErC9vAft-lROWVxGlf_umIjMCejov2x73TpT-74cqY5GA4QCtiasZeQziJPYQPSzc7IHcAi8aKV1MLHLwmLSI-R7Vvc3Oe9SNgsCrs4vwUeKHBaAsNT-lOeVyuERP9l864stXe9DJqBENCDKPX_J6PRztNTCFjWftCrz1_od3Dylay4cmKLFhYmk4WO4qhxjynz2ABreRfGj7qXO7BUWlvzKZI6KLEIcKxvm9Dks_4_UOAawHVGjViLaD1PZnC0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create New Job</h1>
              <p className="text-base sm:text-sm text-slate-500">Fill in the details to create a new shipping job</p>
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
              <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Row 1: Shipment & Route + Parties Involved */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Shipment & Route Section */}
                  <div className="xl:col-span-2">
                    <JobFormSection title="Shipment & Route" icon={Ship}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Port of Loading */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Anchor className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PORT OF LOADING</span>
                          </div>
                          <input 
                            value={form.portOfLoading || ""} 
                            onChange={(e) => handleChange("portOfLoading", e.target.value)} 
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Enter port of loading"
                          />
                        </div>

                        {/* Port of Discharge */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Anchor className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PORT OF DISCHARGE</span>
                          </div>
                          <input 
                            value={form.portOfDischarge || ""} 
                            onChange={(e) => handleChange("portOfDischarge", e.target.value)} 
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Enter port of discharge"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <FormSelect
                          label="SERVICE"
                          value={form.service}
                          onChange={(e) => handleChange("service", e.target.value)}
                          options={["Import", "Export"]}
                        />

                        <FormSelect
                          label="TYPE"
                          value={form.shipmentType}
                          onChange={(e) => handleChange("shipmentType", e.target.value)}
                          options={["LCL", "FCL", "Part of FCL"]}
                        />

                        <FormSelect
                          label="MODE"
                          value={form.mode}
                          onChange={(e) => handleChange("mode", e.target.value)}
                          options={["Sea", "Air"]}
                          icon={form.mode === 'Sea' ? <Ship className="w-4 h-4 text-blue-600" /> : <Plane className="w-4 h-4 text-blue-600" />}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <FormInput
                          label="VOLUME"
                          value={form.volume || ""}
                          onChange={(e) => handleChange("volume", e.target.value)}
                          placeholder="CBM"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {/* Vessel/Flight - Keep custom logic */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">VESSEL / FLIGHT</span>
                          <div className="flex gap-1 mt-1">
                            <select value={form.vesselType} onChange={(e) => handleChange("vesselType", e.target.value)} className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="Vessel">Vessel</option>
                              <option value="Flight">Flight</option>
                            </select>
                            {form.vesselType === "Vessel" ? (
                              <input value={form.vesselNo || ""} onChange={(e) => handleChange("vesselNo", e.target.value)} placeholder="Vessel No" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            ) : (
                              <input value={form.flightNo || ""} onChange={(e) => handleChange("flightNo", e.target.value)} placeholder="Flight No" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                          </div>
                        </div>

                        <FormInput
                          label="CONTAINER NO"
                          value={form.containerNo || ""}
                          onChange={(e) => handleChange("containerNo", e.target.value)}
                          placeholder="Container No"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />

                        <FormInput
                          label="ETA"
                          value={form.eta || ""}
                          onChange={(e) => handleChange("eta", e.target.value)}
                          placeholder="ETA"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />

                        <FormInput
                          label="DELIVERED"
                          type="date"
                          value={form.deliveredDate || ""}
                          onChange={(e) => handleChange("deliveredDate", e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />
                      </div>
                    </JobFormSection>
                  </div>

                  {/* Parties Involved */}
                  <div className="xl:col-span-1">
                    <JobFormSection title="Parties Involved" icon={Users} className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                      <div className="space-y-6">
                        {/* Exporter */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">EXPORTER NAME *</span>
                          <CompanyDropdown 
                            label="" 
                            value={form.exporterName} 
                            isEdit={true} 
                            onChange={(v) => handleChange("exporterName", v)}
                            companies={MOCK_EXPORTERS}
                            placeholder="Select exporter..."
                            onAddNew={handleAddExporter}
                          />
                          
                          <FormInput
                            label="EXPORTER ADDRESS"
                            type="textarea"
                            value={form.exporterAddress || ""}
                            onChange={(e) => handleChange("exporterAddress", e.target.value)}
                            placeholder="Enter exporter address"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                            rows={2}
                          />
                        </div>

                        {/* Consignee */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONSIGNEE NAME</span>
                          <CompanyDropdown 
                            label="" 
                            value={form.consigneeName} 
                            isEdit={true} 
                            onChange={(v) => handleChange("consigneeName", v)}
                            companies={MOCK_IMPORTERS}
                            placeholder="Select importer..."
                            onAddNew={handleAddImporter}
                          />
                          
                          <FormInput
                            label="CONSIGNEE ADDRESS"
                            type="textarea"
                            value={form.consigneeAddress || ""}
                            onChange={(e) => handleChange("consigneeAddress", e.target.value)}
                            placeholder="Enter consignee address"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </JobFormSection>
                  </div>
                </div>

                {/* Row 2: Documentation References + Job Details */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Documentation References Section */}
                  <div className="xl:col-span-2">
                    <JobFormSection title="Documentation References" icon={FileText}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Invoice Details */}
                        <div className="space-y-4">
                          <FormInput
                            label="INVOICE NO"
                            value={form.invoiceNo || ""}
                            onChange={(e) => handleChange("invoiceNo", e.target.value)}
                            placeholder="Enter invoice number"
                          />

                          <FormInput
                            label="BILL OF ENTRY NO"
                            value={form.billOfEntryNo || ""}
                            onChange={(e) => handleChange("billOfEntryNo", e.target.value)}
                            placeholder="Enter bill of entry number"
                          />

                          <FormInput
                            label="SOB DATE"
                            type="date"
                            value={form.sobDate || ""}
                            onChange={(e) => handleChange("sobDate", e.target.value)}
                          />
                        </div>

                        {/* BL and Shipping Details */}
                        <div className="space-y-4">
                          <FormInput
                            label="INVOICE DATE"
                            type="date"
                            value={form.invoiceDate || ""}
                            onChange={(e) => handleChange("invoiceDate", e.target.value)}
                          />

                          <FormInput
                            label="BL NO"
                            value={form.blNo || ""}
                            onChange={(e) => handleChange("blNo", e.target.value)}
                            placeholder="Enter BL number"
                          />

                          <FormInput
                            label="BL DATE"
                            type="date"
                            value={form.blDate || ""}
                            onChange={(e) => handleChange("blDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormInput
                          label="BILL OF ENTRY DATE"
                          type="date"
                          value={form.billOfEntryDate || ""}
                          onChange={(e) => handleChange("billOfEntryDate", e.target.value)}
                        />

                        <FormInput
                          label="SHIPPING BILL NO"
                          value={form.shippingBillNo || ""}
                          onChange={(e) => handleChange("shippingBillNo", e.target.value)}
                          placeholder="Enter shipping bill number"
                        />
                      </div>
                    </JobFormSection>
                  </div>

                  {/* Job Details */}
                  <div className="xl:col-span-1">
                    <JobFormSection title="Job Details" icon={Package} className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                      <div className="space-y-4">
                        <FormInput
                          label="JOB NO *"
                          value={form.jobNo || ""}
                          onChange={(e) => handleChange("jobNo", e.target.value)}
                          placeholder="Enter job number"
                        />

                        <FormInput
                          label="DATE"
                          type="date"
                          value={form.date || ""}
                          onChange={(e) => handleChange("date", e.target.value)}
                        />

                        <FormInput
                          label="NOTIFY PARTY"
                          value={form.notifyParty || ""}
                          onChange={(e) => handleChange("notifyParty", e.target.value)}
                          placeholder="Enter notify party"
                        />

                        <FormInput
                          label="FINAL DESTINATION"
                          value={form.finalDestination || ""}
                          onChange={(e) => handleChange("finalDestination", e.target.value)}
                          placeholder="Enter final destination"
                        />
                      </div>
                    </JobFormSection>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => navigate("/jobs-dashboard")} 
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Job
                </button>
              </div>
              </form>
            )}

            {activeTab === 'documents' && (
              <div className="-m-4 sm:-m-6 md:-m-8 p-4 sm:p-6 md:p-8">
                <DocumentExplorer
                  documents={documents}
                  currentFolder={{ jobNo: form.jobNo || 'New Job', type: 'folder' }}
                  isLoading={false}
                  onDocumentClick={handleDocumentClick}
                  onUpload={handleFileUpload}
                  onDelete={handleDeleteDocument}
                  onDownload={handleDownloadDocument}
                  allowUpload={true}
                  title="Job Documents"
                  subtitle={`Manage documents for ${form.jobNo ? `Job No ${form.jobNo}` : 'new job'}`}
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

export default NewJobPage;