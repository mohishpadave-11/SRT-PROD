// src/pages/NewJobPage.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, Upload, Trash2, Home, FileText, LogOut, Search, User } from "lucide-react";
import logo from '../../assets/srtship-logo.png';
import { addJob } from "../../lib/jobsStorage";

const DEFAULT_DOC_TITLES = ["Invoice", "PackingList", "BL", "Insurance", "COO"];

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <dt className="font-medium text-slate-700 text-sm">{label}</dt>
    <dd>{children}</dd>
  </div>
);

const NewJobPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }
  const [form, setForm] = useState({
    jobNo: "",
    date: "",
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
    mode: "Air",
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

  // Initialize documents state with default document titles
  const [docs, setDocs] = useState(() => 
    DEFAULT_DOC_TITLES.map((title, idx) => ({
      id: idx + 1,
      title,
      fileName: null
    }))
  );

  const handleChange = (field, value) => setForm((s) => ({ ...s, [field]: value }));

  // Document handlers
  const handleViewDoc = (doc) => {
    if (!doc.fileName) {
      alert("No file uploaded for this document.");
      return;
    }
    alert(`Viewing file: ${doc.fileName}`);
  };

  const handleReplaceFile = (docId, file) => {
    if (!file) return;
    setDocs((d) => d.map(x => x.id === docId ? { ...x, fileName: file.name } : x));
  };

  const handleDeleteFileOnly = (docId) => {
    const doc = docs.find(d => d.id === docId);
    if (!doc) return;
    if (!doc.fileName) {
      alert("No file to delete for this document.");
      return;
    }
    if (!confirm("Remove the file from this document? This will keep the document row but delete its file.")) return;

    setDocs((d) => d.map(x => x.id === docId ? { ...x, fileName: null } : x));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.jobNo || !form.exporterName) {
      alert("Please fill required fields: Job No and Exporter Name");
      return;
    }
    
    // Include documents in the job data
    const jobData = {
      ...form,
      documents: docs.filter(doc => doc.fileName).map(doc => ({
        id: doc.id,
        name: doc.fileName
      }))
    };
    
    addJob(jobData);
    alert("Job created successfully");
    navigate("/jobs-dashboard");
  };

  return (
    <div className="h-screen bg-gray-50 w-full flex flex-col overflow-hidden">
      {/* ---------- DESKTOP HEADER ---------- */}
      <header className="flex-shrink-0 z-50 w-full hidden md:block">
        <div className="bg-white shadow-lg h-20 w-full border-b-2 border-gray-100">
          <div className="flex items-center justify-between h-full px-4 max-w-none">
            <div
              onClick={goToDashboard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToDashboard() }}
              className="flex items-center cursor-pointer"
            >
              <img src={logo} alt="SRT Shipping" className="h-8 sm:h-12" />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Companies, Jobs, Parties"
                  className="pl-12 pr-6 py-3 border border-gray-300 rounded-lg w-96 focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              <button
                onClick={() => navigate('/jobs/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-semibold shadow-md"
              >
                <span className="text-lg">+</span>
                <span>NEW JOB</span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <button
                  onClick={() => navigate('/admin/profile')}
                  className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400"
                >
                  <User className="w-7 h-7 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- MOBILE HEADER ---------- */}
      <header className="md:hidden flex-shrink-0 z-50 bg-white shadow-sm h-16 w-full border-b border-gray-100">
        <div className="flex items-center justify-between h-full px-4">
          <div onClick={goToDashboard} className="cursor-pointer flex items-center">
            <img src={logo} className="h-8" alt="SRT Shipping" />
          </div>

          <div className="flex-1 px-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg w-full text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/jobs/new')}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
          >
            + New
          </button>
        </div>
      </header>

      {/* ---------- MAIN LAYOUT CONTAINER ---------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* ---------- DESKTOP SIDEBAR (extends full height) ---------- */}
        <aside className="hidden md:flex w-20 bg-white shadow-lg flex-col border-r-2 border-gray-100 flex-shrink-0 absolute left-0 top-20 bottom-0 z-30">
          <nav className="py-6 flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full flex flex-col items-center py-5 ${
                location.pathname === '/dashboard'
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              aria-label="Dashboard"
            >
              <Home className="w-7 h-7" />
            </button>

            <button
              onClick={() => navigate('/jobs-dashboard')}
              className={`w-full flex flex-col items-center py-5 ${
                location.pathname === '/jobs-dashboard'
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              aria-label="Jobs"
            >
              <FileText className="w-7 h-7" />
            </button>
          </nav>

          {/* Logout button at bottom of sidebar */}
          <div className="border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full flex flex-col items-center py-4 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </aside>

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <div className="flex-1 overflow-auto bg-gray-50 md:pb-0 pb-16 md:ml-20">
          <div className="flex flex-col min-h-screen bg-gray-100 text-slate-700 w-full">
            <main className="flex-grow w-full">
          <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Job</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DETAILS CARD */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg font-medium mb-6">Job Details</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Field label="Job No *">
                  <input 
                    value={form.jobNo} 
                    onChange={(e) => handleChange("jobNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter job number"
                  />
                </Field>

                <Field label="Date">
                  <input 
                    type="date" 
                    value={form.date} 
                    onChange={(e) => handleChange("date", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="Exporter Name *">
                  <input 
                    value={form.exporterName} 
                    onChange={(e) => handleChange("exporterName", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter exporter name"
                  />
                </Field>

                <Field label="Exporter Address">
                  <input 
                    value={form.exporterAddress} 
                    onChange={(e) => handleChange("exporterAddress", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter exporter address"
                  />
                </Field>

                <Field label="Consignee Name">
                  <input 
                    value={form.consigneeName} 
                    onChange={(e) => handleChange("consigneeName", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter consignee name"
                  />
                </Field>

                <Field label="Consignee Address">
                  <input 
                    value={form.consigneeAddress} 
                    onChange={(e) => handleChange("consigneeAddress", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter consignee address"
                  />
                </Field>

                <Field label="Invoice No">
                  <input 
                    value={form.invoiceNo} 
                    onChange={(e) => handleChange("invoiceNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter invoice number"
                  />
                </Field>

                <Field label="Invoice Date">
                  <input 
                    type="date" 
                    value={form.invoiceDate} 
                    onChange={(e) => handleChange("invoiceDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="Type of Shipment">
                  <select 
                    value={form.shipmentType} 
                    onChange={(e) => handleChange("shipmentType", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LCL">LCL (Less than Container Load)</option>
                    <option value="FCL">FCL (Full Container Load)</option>
                    <option value="Part of FCL">Part of FCL</option>
                  </select>
                </Field>

                <Field label="Port of Loading">
                  <input 
                    value={form.portOfLoading} 
                    onChange={(e) => handleChange("portOfLoading", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter port of loading"
                  />
                </Field>

                <Field label="Port of Discharge">
                  <input 
                    value={form.portOfDischarge} 
                    onChange={(e) => handleChange("portOfDischarge", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter port of discharge"
                  />
                </Field>

                <Field label="Type of Mode">
                  <select 
                    value={form.mode} 
                    onChange={(e) => handleChange("mode", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Air">Air</option>
                    <option value="Sea">Sea</option>
                  </select>
                </Field>

                <Field label="Service">
                  <select 
                    value={form.service} 
                    onChange={(e) => handleChange("service", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Import">Import</option>
                    <option value="Export">Export</option>
                  </select>
                </Field>

                <Field label="Container No">
                  <input 
                    value={form.containerNo} 
                    onChange={(e) => handleChange("containerNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter container number"
                  />
                </Field>

                <Field label="SOB Date">
                  <input 
                    type="date" 
                    value={form.sobDate} 
                    onChange={(e) => handleChange("sobDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="Vessel / Flight">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={form.vesselType} 
                      onChange={(e) => handleChange("vesselType", e.target.value)} 
                      className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Vessel">Vessel</option>
                      <option value="Flight">Flight</option>
                    </select>
                    {form.vesselType === "Vessel" ? (
                      <input 
                        value={form.vesselNo} 
                        onChange={(e) => handleChange("vesselNo", e.target.value)} 
                        placeholder="Vessel No" 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    ) : (
                      <input 
                        value={form.flightNo} 
                        onChange={(e) => handleChange("flightNo", e.target.value)} 
                        placeholder="Flight No" 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    )}
                  </div>
                </Field>

                <Field label="Shipping Bill No">
                  <input 
                    value={form.shippingBillNo} 
                    onChange={(e) => handleChange("shippingBillNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter shipping bill number"
                  />
                </Field>

                <Field label="Shipping Bill No Date">
                  <input 
                    type="date" 
                    value={form.shippingBillNoDate} 
                    onChange={(e) => handleChange("shippingBillNoDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="Bill of Entry No">
                  <input 
                    value={form.billOfEntryNo} 
                    onChange={(e) => handleChange("billOfEntryNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter bill of entry number"
                  />
                </Field>

                <Field label="Bill of Entry Date">
                  <input 
                    type="date" 
                    value={form.billOfEntryDate} 
                    onChange={(e) => handleChange("billOfEntryDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="ETA">
                  <input 
                    value={form.eta} 
                    onChange={(e) => handleChange("eta", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter ETA"
                  />
                </Field>

                <Field label="Volume">
                  <input 
                    value={form.volume} 
                    onChange={(e) => handleChange("volume", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter volume"
                  />
                </Field>

                <Field label="BL Date">
                  <input 
                    type="date" 
                    value={form.blDate} 
                    onChange={(e) => handleChange("blDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="Delivered On">
                  <input 
                    type="date" 
                    value={form.deliveredDate} 
                    onChange={(e) => handleChange("deliveredDate", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </Field>

                <Field label="BL No">
                  <input 
                    value={form.blNo} 
                    onChange={(e) => handleChange("blNo", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter BL number"
                  />
                </Field>

                <Field label="Final Destination">
                  <input 
                    value={form.finalDestination} 
                    onChange={(e) => handleChange("finalDestination", e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter final destination"
                  />
                </Field>
              </div>
            </div>

            {/* DOCUMENTS CARD */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Documents</h3>
              </div>

              <div className="overflow-x-auto bg-white border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 w-24">Serial No</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Document Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 w-56">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc, idx) => (
                      <tr key={doc.id} className="border-t">
                        <td className="px-4 py-3 text-sm text-slate-700">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          <div className="flex items-center justify-between">
                            <div className="break-words">{doc.fileName ?? doc.title}</div>
                            {!doc.fileName && <div className="text-sm italic text-slate-500">No file</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(doc)}
                              className={`px-2 py-1 rounded border hover:bg-gray-50 flex items-center gap-1 ${!doc.fileName ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={!doc.fileName}
                            >
                              <Eye className="w-4 h-4" /> View
                            </button>

                            <label className="px-2 py-1 rounded border hover:bg-gray-50 flex items-center gap-1 cursor-pointer overflow-hidden">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReplaceFile(doc.id, file);
                                }}
                              />
                              <Upload className="w-4 h-4" /> {doc.fileName ? "Replace" : "Upload"}
                            </label>

                            <button
                              type="button"
                              onClick={() => handleDeleteFileOnly(doc.id)}
                              className="px-2 py-1 rounded border text-red-600 hover:bg-red-50 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {docs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">No documents available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
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
          </div>
            </main>
          </div>
        </div>
      </div>

      {/* ---------- MOBILE BOTTOM NAV ---------- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-between items-center px-4 py-2 z-50">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-600">
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button onClick={() => navigate('/jobs-dashboard')} className="flex flex-col items-center text-gray-600">
          <FileText className="w-5 h-5" />
          <span className="text-xs">Jobs</span>
        </button>

        <button onClick={() => navigate('/admin/profile')} className="flex flex-col items-center text-gray-600">
          <User className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </button>

        <button onClick={handleLogout} className="flex flex-col items-center text-gray-600">
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default NewJobPage;