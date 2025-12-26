import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Ship, Plane, FileText, Users, Package, Anchor, AlertCircle, Save, X as XIcon, Trash2, Share2, Mail, MessageCircle, FileDown, Link as LinkIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import Toast Library

import DashboardLayout from '../../components/layout/DashboardLayout';
import DocumentExplorer from '../../components/dashboard/DocumentExplorer';
import CompanyDropdown from '../../components/form/CompanyDropdown';
import FormInput from '../../components/form/FormInput';
import FormSelect from '../../components/form/FormSelect';
import JobFormSection from '../../components/form/JobFormSection';
import useJobForm from '../../hooks/useJobForm';
import useDocumentActions from '../../hooks/useDocumentActions';
import Loading from '../../components/ui/Loading';

// --- API Services ---
import { updateJobAPI } from '../../services/jobService';
import { 
  uploadDocumentAPI, 
  getShareOptionsAPI // ✅ Imported Share API
} from '../../services/documentService';
import { createCompanyAPI } from '../../services/companyService';

// --- 🛠️ Notification Utility (Production Grade) ---
const notify = {
  success: (msg) => toast.success(msg, { style: { fontWeight: '500' } }),
  error: (msg) => toast.error(msg, { style: { fontWeight: '500' } }),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
  
  // 1. Confirm Delete Modal
  confirm: ({ title, message, confirmText = "Confirm", onConfirm, type = 'danger' }) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in zoom-in duration-200">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => toast.dismiss(t.id)}></div>
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative z-10 border border-gray-100 mx-4">
          <div className="flex flex-col gap-4 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {type === 'danger' ? <Trash2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
            <div className="flex gap-3 justify-center mt-2">
              <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => { toast.dismiss(t.id); onConfirm(); }} className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: Infinity, id: 'confirm-modal' });
  },

  // 2. Share Method Selection (Link vs Copy)
  shareSelection: (fileName, onSelect) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in zoom-in duration-200">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => toast.dismiss(t.id)}></div>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative z-10 mx-4 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Share Document</h3>
            <button onClick={() => toast.dismiss(t.id)}><XIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-2">How would you like to share <span className="font-medium text-gray-800">{fileName}</span>?</p>
            
            <button 
              onClick={() => { toast.dismiss(t.id); onSelect('link'); }}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Send Link</div>
                <div className="text-xs text-gray-500">Share URL via WhatsApp/Email</div>
              </div>
            </button>

            <button 
              onClick={() => { toast.dismiss(t.id); onSelect('copy'); }}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Send a Copy</div>
                <div className="text-xs text-gray-500">Share actual PDF file</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    ), { duration: Infinity, id: 'share-select-modal' });
  },

  // 3. Share Link List (WhatsApp/Gmail/Email)
  shareLinkList: (fileName, options) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in zoom-in duration-200">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => toast.dismiss(t.id)}></div>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative z-10 mx-4 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Send Link via</h3>
            <button onClick={() => toast.dismiss(t.id)}><XIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="p-2 grid grid-cols-1 gap-1">
            {options.map((opt) => (
              <a key={opt.id} href={opt.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group" onClick={() => toast.dismiss(t.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.id === 'whatsapp' ? 'bg-green-100 text-green-600' : opt.id === 'gmail' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {opt.id === 'whatsapp' ? <MessageCircle className="w-5 h-5" /> : opt.id === 'gmail' ? <Mail className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                </div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{opt.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    ), { duration: Infinity, id: 'share-link-modal' });
  }
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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
  } = useJobForm(id, true);

  // Use document actions hook
  const { handleDelete, handleDownload, handlePreview, handleShare } = useDocumentActions();

  // Local state for edit mode and active tab
  const [isEdit, setIsEdit] = useState(Boolean(location?.state?.edit));
  const [activeTab, setActiveTab] = useState('details');

  // Load documents when switching to documents tab
  useEffect(() => {
    if (activeTab === 'documents' && id) {
        loadDocuments();
    }
  }, [activeTab, id]);

  // --- Handlers ---

  const handleSave = async () => {
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
            vessel_flight_name: form.vesselType === 'Vessel' ? form.vesselNo : form.flightNo,
        };

        await updateJobAPI(id, backendPayload);
        notify.success("Job updated successfully!");
        setIsEdit(false);
    } catch (err) {
        console.error(err);
        notify.error("Failed to update job.");
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    window.location.reload(); 
  };

  // Document handlers using the hook
  const handlePreviewDocument = (document) => handlePreview(document.id);
  const handleDownloadDocument = (e, documentName, documentId) => {
    if (e) e.stopPropagation();
    const docId = documentId || documents.find(d => d.name === documentName)?.id;
    if (!docId) { 
        notify.error("Document ID missing");
        return; 
    }
    handleDownload(docId, documentName);
  };
  const handleShareDocument = (type, documentId, documentName) => handleShare(type, documentId, documentName);
  const handleDeleteDocument = (e, documentId, documentName) => {
    if (e) e.stopPropagation();
    handleDelete(documentId, documentName, loadDocuments);
  };

  const handleDocumentClick = (document) => {
      handlePreviewDocument(document);
  };

  const handleFileUpload = async (files, documentType) => {
    if (!id) return
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadDocumentAPI(id, documentType, files[i])
      }
      toast.success(`Successfully uploaded ${files.length} document(s)`)
      loadDocuments()
    } catch (e) { 
      toast.error("Upload failed") 
    }
  }

  if (loading) return (
    <DashboardLayout>
      <Loading variant="page" size="lg" />
    </DashboardLayout>
  );

  if (error || !form) return (
    <DashboardLayout>
      <div className="p-8 text-center text-red-600 flex flex-col items-center">
        <AlertCircle className="w-12 h-12 mb-2" />
        <h2 className="text-xl font-bold">Error Loading Job</h2>
        <p>{error || "Job not found"}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 underline">Back to Dashboard</button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* ✅ Global Toaster */}
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <div className="max-w-screen-2xl mx-auto text-slate-700">

            {/* HEADER SECTION */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto sm:mx-0">
                    <Package className="w-8 h-8" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Job No {form.jobNo}</h1>
                  <p className="text-base sm:text-sm text-slate-500">Datacircles Technologies</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                  {!isEdit ? (
                    <button 
                      onClick={() => setIsEdit(true)} 
                      className="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                      Edit Job
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSave} 
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button 
                        onClick={handleCancel} 
                        className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm transition-colors"
                      >
                        <XIcon className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
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
                
                {/* DETAILS TAB */}
                <div className={activeTab === 'details' ? 'block' : 'hidden'}>
                  <form>
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
                              {isEdit ? (
                                <input 
                                  value={form.portOfLoading || ""} 
                                  onChange={(e) => handleChange("portOfLoading", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  placeholder="Enter port of loading"
                                />
                              ) : (
                                <div className="text-gray-900 font-medium py-2">{form.portOfLoading || "—"}</div>
                              )}
                            </div>

                            {/* Port of Discharge */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Anchor className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PORT OF DISCHARGE</span>
                              </div>
                              {isEdit ? (
                                <input 
                                  value={form.portOfDischarge || ""} 
                                  onChange={(e) => handleChange("portOfDischarge", e.target.value)} 
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  placeholder="Enter port of discharge"
                                />
                              ) : (
                                <div className="text-gray-900 font-medium py-2">{form.portOfDischarge || "—"}</div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {isEdit ? (
                                <FormSelect
                                label="SERVICE"
                                value={form.service}
                                onChange={(e) => handleChange("service", e.target.value)}
                                options={["Import", "Export"]}
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">SERVICE</span>{form.service}</div>
                            )}

                            {isEdit ? (
                                <FormSelect
                                label="TYPE"
                                value={form.shipmentType}
                                onChange={(e) => handleChange("shipmentType", e.target.value)}
                                options={["LCL", "FCL", "Part of FCL"]}
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">TYPE</span>{form.shipmentType}</div>
                            )}

                            {isEdit ? (
                                <FormSelect
                                label="MODE"
                                value={form.mode}
                                onChange={(e) => handleChange("mode", e.target.value)}
                                options={["Sea", "Air"]}
                                icon={form.mode === 'Sea' ? <Ship className="w-4 h-4 text-blue-600" /> : <Plane className="w-4 h-4 text-blue-600" />}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">MODE</span>{form.mode}</div>
                            )}

                            {isEdit ? (
                                <FormInput
                                label="VOLUME"
                                value={form.volume || ""}
                                onChange={(e) => handleChange("volume", e.target.value)}
                                placeholder="CBM"
                                type="number"
                                step="0.01"
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">VOLUME</span>{form.volume} CBM</div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {/* Vessel/Flight */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">VESSEL / FLIGHT</span>
                              {isEdit ? (
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
                              ) : (
                                <div className="mt-1">{form.vesselType === 'Vessel' ? form.vesselNo : form.flightNo}</div>
                              )}
                            </div>

                            {isEdit ? (
                                <FormInput
                                label="CONTAINER NO"
                                value={form.containerNo || ""}
                                onChange={(e) => handleChange("containerNo", e.target.value)}
                                placeholder="Container No"
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">CONTAINER NO</span>{form.containerNo}</div>
                            )}

                            {isEdit ? (
                                <FormInput
                                label="ETA"
                                type="date"
                                value={form.eta || ""}
                                onChange={(e) => handleChange("eta", e.target.value)}
                                placeholder="ETA"
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">ETA</span>{form.eta}</div>
                            )}

                            {isEdit ? (
                                <FormInput
                                label="DELIVERED"
                                type="date"
                                value={form.deliveredDate || ""}
                                onChange={(e) => handleChange("deliveredDate", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            ) : (
                                <div><span className="text-xs text-gray-500 font-bold block mb-1">DELIVERED</span>{form.deliveredDate}</div>
                            )}
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
                              {isEdit ? (
                                <CompanyDropdown 
                                    label="" 
                                    value={form.exporterName} 
                                    companies={companies}
                                    isEdit={true} 
                                    onChange={(name, address) => {
                                    handleChange("exporterName", name);
                                    if(address) handleChange("exporterAddress", address);
                                    }}
                                    onAddNew={async (name, address) => {
                                    try {
                                        const newCompany = await createCompanyAPI({ name, address });
                                        setCompanies(prev => [...prev, newCompany]);
                                        notify.success("Company created!");
                                    } catch (err) {
                                        notify.error("Failed to create company");
                                    }
                                    }}
                                    placeholder="Select exporter..."
                                />
                              ) : (
                                <div className="font-medium mt-1">{form.exporterName}</div>
                              )}
                              
                              {isEdit ? (
                                <FormInput
                                    label="EXPORTER ADDRESS"
                                    type="textarea"
                                    value={form.exporterAddress || ""}
                                    onChange={(e) => handleChange("exporterAddress", e.target.value)}
                                    placeholder="Enter exporter address"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                                    rows={2}
                                />
                              ) : (
                                <div className="text-sm text-gray-600 mt-1">{form.exporterAddress}</div>
                              )}
                            </div>

                            {/* Consignee */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONSIGNEE NAME</span>
                              {isEdit ? (
                                <CompanyDropdown 
                                    label="" 
                                    value={form.consigneeName} 
                                    companies={companies}
                                    isEdit={true} 
                                    onChange={(name, address) => {
                                    handleChange("consigneeName", name);
                                    if(address) handleChange("consigneeAddress", address);
                                    }}
                                    onAddNew={async (name, address) => {
                                    try {
                                        const newCompany = await createCompanyAPI({ name, address });
                                        setCompanies(prev => [...prev, newCompany]);
                                        notify.success("Company created!");
                                    } catch (err) {
                                        notify.error("Failed to create company");
                                    }
                                    }}
                                    placeholder="Select importer..."
                                />
                              ) : (
                                <div className="font-medium mt-1">{form.consigneeName}</div>
                              )}
                              
                              {isEdit ? (
                                <FormInput
                                    label="CONSIGNEE ADDRESS"
                                    type="textarea"
                                    value={form.consigneeAddress || ""}
                                    onChange={(e) => handleChange("consigneeAddress", e.target.value)}
                                    placeholder="Enter consignee address"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                                    rows={2}
                                />
                              ) : (
                                <div className="text-sm text-gray-600 mt-1">{form.consigneeAddress}</div>
                              )}
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
                              {isEdit ? (
                                <FormInput
                                label="INVOICE NO"
                                value={form.invoiceNo || ""}
                                onChange={(e) => handleChange("invoiceNo", e.target.value)}
                                placeholder="Enter invoice number"
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">INVOICE NO</span>{form.invoiceNo}</div>)}

                              {isEdit ? (
                                <FormInput
                                label="BILL OF ENTRY NO"
                                value={form.billOfEntryNo || ""}
                                onChange={(e) => handleChange("billOfEntryNo", e.target.value)}
                                placeholder="Enter bill of entry number"
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">BILL OF ENTRY NO</span>{form.billOfEntryNo}</div>)}

                              {isEdit ? (
                                <FormInput
                                label="SOB DATE"
                                type="date"
                                value={form.sobDate || ""}
                                onChange={(e) => handleChange("sobDate", e.target.value)}
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">SOB DATE</span>{form.sobDate}</div>)}
                            </div>

                            {/* BL and Shipping Details */}
                            <div className="space-y-4">
                              {isEdit ? (
                                <FormInput
                                label="INVOICE DATE"
                                type="date"
                                value={form.invoiceDate || ""}
                                onChange={(e) => handleChange("invoiceDate", e.target.value)}
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">INVOICE DATE</span>{form.invoiceDate}</div>)}

                              {isEdit ? (
                                <FormInput
                                label="BL NO"
                                value={form.blNo || ""}
                                onChange={(e) => handleChange("blNo", e.target.value)}
                                placeholder="Enter BL number"
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">BL NO</span>{form.blNo}</div>)}

                              {isEdit ? (
                                <FormInput
                                label="BL DATE"
                                type="date"
                                value={form.blDate || ""}
                                onChange={(e) => handleChange("blDate", e.target.value)}
                                />
                              ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">BL DATE</span>{form.blDate}</div>)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {isEdit ? (
                                <FormInput
                                label="BILL OF ENTRY DATE"
                                type="date"
                                value={form.billOfEntryDate || ""}
                                onChange={(e) => handleChange("billOfEntryDate", e.target.value)}
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">BILL OF ENTRY DATE</span>{form.billOfEntryDate}</div>)}

                            {isEdit ? (
                                <FormInput
                                label="SHIPPING BILL NO"
                                value={form.shippingBillNo || ""}
                                onChange={(e) => handleChange("shippingBillNo", e.target.value)}
                                placeholder="Enter shipping bill number"
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">SHIPPING BILL NO</span>{form.shippingBillNo}</div>)}
                          </div>
                        </JobFormSection>
                      </div>

                      {/* Job Details + STATUS FIELD */}
                      <div className="xl:col-span-1">
                        <JobFormSection title="Job Details" icon={Package} className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                          <div className="space-y-4">
                            
                            {/* --- NEW STATUS FIELD (EDITABLE) --- */}
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">JOB STATUS *</span>
                                {isEdit ? (
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
                                ) : (
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                        form.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {form.status}
                                    </span>
                                )}
                            </div>

                            {isEdit ? (
                                <FormInput
                                label="JOB NO *"
                                value={form.jobNo || ""}
                                onChange={(e) => handleChange("jobNo", e.target.value)}
                                placeholder="Enter job number"
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">JOB NO</span>{form.jobNo}</div>)}

                            {isEdit ? (
                                <FormInput
                                label="JOB DATE"
                                type="date"
                                value={form.date || ""}
                                onChange={(e) => handleChange("date", e.target.value)}
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">JOB DATE</span>{form.date}</div>)}

                            {isEdit ? (
                                <FormInput
                                label="NOTIFY PARTY"
                                value={form.notifyParty || ""}
                                onChange={(e) => handleChange("notifyParty", e.target.value)}
                                placeholder="Enter notify party"
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">NOTIFY PARTY</span>{form.notifyParty}</div>)}

                            {isEdit ? (
                                <FormInput
                                label="FINAL DESTINATION"
                                value={form.finalDestination || ""}
                                onChange={(e) => handleChange("finalDestination", e.target.value)}
                                placeholder="Enter final destination"
                                />
                            ) : (<div><span className="text-xs text-gray-500 font-bold block mb-1">FINAL DESTINATION</span>{form.finalDestination}</div>)}
                          </div>
                        </JobFormSection>
                      </div>
                    </div>
                  </div>
                  </form>
                </div>

                {/* DOCUMENTS TAB */}
                <div className={activeTab === 'documents' ? 'block' : 'hidden'}>
                  <div className="-m-4 sm:-m-6 md:-m-8 p-4 sm:p-6 md:p-8">
                    {loadingDocs ? (
                        <Loading variant="inline" size="md" text="Loading documents..." />
                    ) : (
                        <DocumentExplorer
                          documents={documents}
                          currentFolder={{ id: id, jobNo: form.jobNo, type: 'folder' }}
                          isLoading={loadingDocs}
                          
                          // ✅ Updated Handlers Passed to Document Explorer
                          onDocumentClick={handleDocumentClick}
                          onUpload={handleFileUpload}
                          onDelete={handleDeleteDocument}
                          onDownload={handleDownloadDocument}
                          
                          // ✅ Added Share Functionality
                          onShare={handleShareDocument}
                          
                          allowUpload={true}
                          title="Job Documents"
                          subtitle={`Manage documents for Job No ${form.jobNo}`}
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
                    )}
                  </div>
                </div>

              </div>
            </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetailsPage;