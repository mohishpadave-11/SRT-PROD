import { useState, useEffect } from 'react';
import { getJobByIdAPI } from '../services/jobService';
import { getCompaniesAPI } from '../services/companyService';
import { getJobDocumentsAPI } from '../services/documentService';

const useJobForm = (jobId = null, isEditMode = false) => {
  // Form state
  const [form, setForm] = useState(isEditMode ? null : {
    jobNo: "",
    status: "In Progress",
    date: new Date().toISOString().split('T')[0],
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

  // Loading states
  const [loading, setLoading] = useState(isEditMode);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState(null);

  // Related data
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Form handler
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Load companies
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompaniesAPI();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to load companies:", err);
        setCompanies([]); // Fallback to empty array to prevent crashes
      }
    };
    loadCompanies();
  }, []);

  // Load job data in edit mode
  useEffect(() => {
    if (!isEditMode || !jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobByIdAPI(jobId);
        setForm({
          id: data.id,
          jobNo: data.job_number || "",
          status: data.status || "In Progress",
          date: data.job_date ? new Date(data.job_date).toISOString().split('T')[0] : "",
          exporterName: data.exporter_name || "",
          exporterAddress: data.exporter_address || "",
          consigneeName: data.consignee_name || "",
          consigneeAddress: data.consignee_address || "",
          notifyParty: data.notify_party || "",
          portOfLoading: data.port_of_loading || "",
          portOfDischarge: data.port_of_discharge || "",
          finalDestination: data.final_destination || "",
          invoiceNo: data.invoice_no || "",
          invoiceDate: data.invoice_date ? new Date(data.invoice_date).toISOString().split('T')[0] : "",
          shipmentType: data.shipment_type || "LCL",
          mode: data.transport_mode || "Sea",
          service: data.service_type || "Import",
          containerNo: data.container_no || "",
          sobDate: data.sob_date ? new Date(data.sob_date).toISOString().split('T')[0] : "",
          deliveredDate: data.delivered_date ? new Date(data.delivered_date).toISOString().split('T')[0] : "",
          blNo: data.bl_no || "",
          shippingBillNo: data.shipping_bill_no || "",
          shippingBillNoDate: data.shipping_bill_no_date ? new Date(data.shipping_bill_no_date).toISOString().split('T')[0] : "",
          billOfEntryNo: data.bill_of_entry_no || "",
          billOfEntryDate: data.bill_of_entry_date ? new Date(data.bill_of_entry_date).toISOString().split('T')[0] : "",
          vesselType: data.vessel_flight_type === 'Flight No' ? "Flight" : "Vessel",
          vesselNo: data.vessel_flight_name || "",
          flightNo: data.vessel_flight_name || "",
          eta: data.eta || "",
          volume: data.volume || "",
          blDate: data.bl_date ? new Date(data.bl_date).toISOString().split('T')[0] : "",
        });
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isEditMode]);

  // Load documents
  const loadDocuments = async () => {
    if (!jobId) return;
    
    try {
      setLoadingDocs(true);
      const docs = await getJobDocumentsAPI(jobId);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Load documents when jobId changes
  useEffect(() => {
    if (jobId) {
      loadDocuments();
    }
  }, [jobId]);

  return {
    // Form state
    form,
    setForm,
    handleChange,
    
    // Loading states
    loading,
    setLoading,
    loadingDocs,
    setLoadingDocs,
    error,
    setError,
    
    // Related data
    documents,
    setDocuments,
    companies,
    setCompanies,
    
    // Utilities
    loadDocuments,
  };
};

export default useJobForm;