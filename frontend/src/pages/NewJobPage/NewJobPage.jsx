import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Ship, Plane, FileText, Users, Package, Anchor, Save, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import Toast

// --- API Services ---
import { createJobAPI, updateJobAPI } from '../../services/jobService';

// --- 2. Import Document Service ---
import { 
  uploadDocumentAPI 
} from '../../services/documentService';

// --- 3. Import Company Service ---
import { createCompanyAPI } from '../../services/companyService';

import Loading from '../../components/ui/Loading';

import DashboardLayout from '../../components/layout/DashboardLayout';
import CompanyDropdown from '../../components/form/CompanyDropdown';
import DocumentExplorer from '../../components/dashboard/DocumentExplorer';
// PdfViewerModal import removed
import FormInput from '../../components/form/FormInput';
import FormSelect from '../../components/form/FormSelect';
import JobFormSection from '../../components/form/JobFormSection';
import useJobForm from '../../hooks/useJobForm';
import useDocumentActions from '../../hooks/useDocumentActions';

const NewJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL for edit mode
  
  const [activeTab, setActiveTab] = useState('details');
  
  // Check if we're in edit mode
  const isEditMode = Boolean(id);
  
  // Use the custom hook
  const {
    form,
    setForm,
    handleChange,
    loading,
    setLoading,
    loadingDocs,
    setLoadingDocs,
    error,
    setError,
    documents,
    setDocuments,
    companies,
    loadDocuments
  } = useJobForm(id, isEditMode);

  // Use document actions hook
  const { handleDelete, handleDownload, handlePreview } = useDocumentActions();

  // Load documents when switching to documents tab
  useEffect(() => {
    if (isEditMode && activeTab === 'documents') {
      loadDocuments();
    }
  }, [isEditMode, activeTab]);

  // --- 3. Document Handlers (Staging + Upload) ---

  const handleFileUpload = async (files, documentType) => {
    const fileArray = Array.from(files);

    if (isEditMode) {
      try {
        for (const file of fileArray) {
          await uploadDocumentAPI(id, documentType, file);
        }
        toast.success(`Successfully uploaded ${fileArray.length} document(s)`);
        loadDocuments(); 
      } catch (err) {
        console.error(err);
        toast.error("Upload failed. Please check your connection.");
      }
    } else {
      const pendingDocs = fileArray.map((file, index) => ({
        id: `pending-${Date.now()}-${index}`, 
        name: `${documentType}.${file.name.split('.').pop()}`,
        type: 'document',
        docType: documentType,
        size: (file.size / 1024).toFixed(1) + ' KB',
        dateModified: 'Pending Upload',
        isPending: true, 
        fileObj: file 
      }));

      setDocuments(prev => [...prev, ...pendingDocs]);
      toast.success("Documents staged. Click 'Create Job' to save.");
    }
  }

  // Document handlers using the hook
  const handleDeleteDocument = (e, documentId, documentName) => {
    e.stopPropagation();
    
    const docToDelete = documents.find(d => d.id === documentId);

    if (docToDelete?.isPending) {
      // Local delete for pending documents
      handleDelete(documentId, documentName, () => {
        setDocuments(prev => prev.filter(d => d.id !== documentId));
      });
    } else {
      // Backend delete for saved documents
      handleDelete(documentId, documentName, loadDocuments);
    }
  };

  const handleDownloadDocument = (e, documentName, documentId) => {
    if (e) e.stopPropagation();
    
    const doc = documents.find(d => d.id === documentId || d.name === documentName);
    const docId = documentId || doc?.id;

    if (doc?.isPending) {
      toast.error("Save the job first to download this document.");
      return;
    }

    if (!docId) return;
    handleDownload(docId, documentName);
  };

  const handlePreviewDocument = (document) => {
    if (document.isPending) {
        toast.error("Save the job first to preview this document.");
        return;
    }
    handlePreview(document.id);
  };

  const handleDocumentClick = (document) => {
      handlePreviewDocument(document);
  };

  // --- 4. Submit Handler (Create/Update Job) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.jobNo) {
      setError("Job Number is required");
      toast.error("Job Number is required");
      window.scrollTo(0, 0); 
      return;
    }
    
    setLoading(true);

    try {
        const backendPayload = {
            job_number: form.jobNo,
            status: form.status,
            job_date: form.date,
            exporter_name: form.exporterName,
            exporter_address: form.exporterAddress,
            consignee_name: form.consigneeName,
            consignee_address: form.consigneeAddress,
            notify_party: form.notifyParty,
            final_destination: form.finalDestination,
            port_of_loading: form.portOfLoading,
            port_of_discharge: form.portOfDischarge,
            service_type: form.service,
            shipment_type: form.shipmentType,
            transport_mode: form.mode,
            volume: form.volume ? parseFloat(form.volume) : null,
            container_no: form.containerNo,
            eta: form.eta || null,
            delivered_date: form.deliveredDate || null,
            invoice_no: form.invoiceNo,
            invoice_date: form.invoiceDate || null,
            bill_of_entry_no: form.billOfEntryNo,
            bill_of_entry_date: form.billOfEntryDate || null,
            bl_no: form.blNo,
            bl_date: form.blDate || null,
            sob_date: form.sobDate || null,
            shipping_bill_no: form.shippingBillNo,
            vessel_flight_type: form.vesselType === 'Vessel' ? 'Vessel No' : 'Flight No',
            vessel_flight_name: form.vesselType === 'Vessel' ? form.vesselNo : form.flightNo
        };

        if (isEditMode) {
          await updateJobAPI(id, backendPayload);
          navigate("/jobs-dashboard", { state: { message: "Job updated successfully!", refresh: true } });
        } else {
          const newJob = await createJobAPI(backendPayload);
          const newJobId = newJob.id || newJob.data?.id;

          if (!newJobId) throw new Error("Job created but ID missing. Cannot upload docs.");

          const pendingDocs = documents.filter(d => d.isPending);
          
          if (pendingDocs.length > 0) {
            for (const doc of pendingDocs) {
              await uploadDocumentAPI(newJobId, doc.docType, doc.fileObj);
            }
          }

          navigate("/dashboard", { state: { message: "Job created successfully!", refresh: true } });
        }

    } catch (err) {
        console.error(err);
        const errMsg = typeof err === 'string' ? err : `Failed to save job. ${err.message || ''}`;
        setError(errMsg);
        toast.error("Failed to save job. Please check errors.");
        window.scrollTo(0, 0);
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* ✅ Add Toaster */}
      <Toaster position="top-right" />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading variant="page" size="lg" text="Loading job data..." />
        </div>
      ) : (
      <div className="max-w-screen-2xl mx-auto text-slate-700">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto sm:mx-0">
               <Package className="w-8 h-8" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {isEditMode ? 'Edit Job' : 'Create New Job'}
              </h1>
              <p className="text-base sm:text-sm text-slate-500">
                {isEditMode ? `Job No: ${form.jobNo}` : 'Fill in the details to create a new shipping job'}
              </p>
            </div>
          </div>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}

        {/* Tabs */}
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
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Documents
              {!isEditMode && documents.length > 0 && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {documents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-slate-200 border-t-0 mb-6">
          <div className="p-4 sm:p-6 md:p-8">
            
            {/* Details Tab */}
            <div className={activeTab === 'details' ? 'block' : 'hidden'}>
              <form id="jobForm" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Shipment & Route Section */}
                  <div className="xl:col-span-2">
                    <JobFormSection title="Shipment & Route" icon={Ship}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          type="number"
                          step="0.01"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
                          type="date"
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
                            companies={companies}
                            isEdit={true} 
                            onChange={(name, address) => {
                              if (name === form.consigneeName) {
                                toast.error("Exporter and Consignee cannot be the same company.");
                                return;
                              }
                              handleChange("exporterName", name);
                              if(address) handleChange("exporterAddress", address);
                            }}
                            onAddNew={async (name, address) => {
                              try {
                                const newCompany = await createCompanyAPI({ name, address });
                                setCompanies(prev => [...prev, newCompany]);
                                toast.success("Company created!");
                              } catch (err) {
                                toast.error("Failed to create company");
                              }
                            }}
                            placeholder="Select exporter..."
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
                            companies={companies}
                            isEdit={true} 
                            onChange={(name, address) => {
                              if (name === form.exporterName) {
                                toast.error("Exporter and Consignee cannot be the same company.");
                                return;
                              }
                              handleChange("consigneeName", name);
                              if(address) handleChange("consigneeAddress", address);
                            }}
                            onAddNew={async (name, address) => {
                              try {
                                const newCompany = await createCompanyAPI({ name, address });
                                setCompanies(prev => [...prev, newCompany]);
                                toast.success("Company created!");
                              } catch (err) {
                                toast.error("Failed to create company");
                              }
                            }}
                            placeholder="Select importer..."
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

                {/* Row 2 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Documentation References Section */}
                  <div className="xl:col-span-2">
                    <JobFormSection title="Documentation References" icon={FileText}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Job Details + Status */}
                  <div className="xl:col-span-1">
                    <JobFormSection title="Job Details" icon={Package} className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                      <div className="space-y-4">
                        
                        {/* --- NEW STATUS FIELD (Always Visible) --- */}
                        <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">JOB STATUS *</span>
                            <select 
                                value={form.status} 
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <FormInput
                          label="JOB NO *"
                          value={form.jobNo || ""}
                          onChange={(e) => handleChange("jobNo", e.target.value)}
                          placeholder="Enter job number"
                        />
                        <FormInput
                          label="JOB DATE"
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
              </form>
            </div>

            {/* Documents Tab */}
            <div className={activeTab === 'documents' ? 'block' : 'hidden'}>
              <div className="-m-4 sm:-m-6 md:-m-8 p-4 sm:p-6 md:p-8">
                <DocumentExplorer
                  documents={documents}
                  currentFolder={{ id: id || 'temp', jobNo: form.jobNo || 'New Job', type: 'folder' }}
                  isLoading={loadingDocs}
                  onDocumentClick={handleDocumentClick}
                  onUpload={handleFileUpload}
                  onDelete={handleDeleteDocument}
                  onDownload={handleDownloadDocument}
                  allowUpload={true}
                  title={isEditMode ? "Job Documents" : "Attach Documents"}
                  subtitle={isEditMode ? `Manage documents for ${form.jobNo}` : "Files will be uploaded when you click 'Create Job'"}
                  showStats={false}
                  showBreadcrumb={false}
                  documentTypes={[
                    'Commercial Invoice',
                    'Bill of Lading',
                    'Packing List',
                    'Certificate of Origin',
                    'Other'
                  ]}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end gap-3 pb-8">
          <button 
            type="button" 
            onClick={() => navigate("/dashboard")} 
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <Loading variant="button" size="sm" text={isEditMode ? 'Updating...' : 'Creating Job & Uploading...'} />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Job' : 'Create Job'}</span>
              </>
            )}
          </button>
        </div>

      </div>
      )}
    </DashboardLayout>
  );
};

export default NewJobPage;
