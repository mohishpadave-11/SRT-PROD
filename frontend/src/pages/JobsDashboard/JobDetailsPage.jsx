import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Eye, Upload, Trash2, Home, FileText, LogOut, Search, User } from "lucide-react";
import logo from '../../assets/srtship-logo.png';

const DEFAULT_DOC_TITLES = ["Invoice", "PackingList", "BL", "Insurance", "COO"];

const JobDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }

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
        mode: "Air", // Air | Sea
        service: "Import", // Import | Export
        containerNo: "11",
        sobDate: "22-11-25",
        deliveredDate: "25-11-25",
        blNo: "1234",
        vesselType: "Vessel", // Vessel | Flight
        vesselNo: "",
        flightNo: "",
        vesselNoDisplay: "VES-111",
        flightNoDisplay: "FL-222",
        eta: "10",
        volume: "100",
        blDate: "25-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf" },
          { id: 2, name: "PackingList.pdf" },
          { id: 3, name: "BL.pdf" },
          { id: 4, name: "Insurance.pdf" },
          { id: 5, name: "COO.pdf" }
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
        mode: "Sea",
        service: "Export",
        containerNo: "45",
        sobDate: "25-11-25",
        deliveredDate: "27-11-25",
        blNo: "5678",
        vesselType: "Vessel",
        vesselNo: "VES-123",
        flightNo: "",
        eta: "5",
        volume: "200",
        blDate: "22-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf" },
          { id: 2, name: "PackingList.pdf" }
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
        mode: "Sea",
        service: "Export",
        containerNo: "9",
        sobDate: "18-11-25",
        deliveredDate: "20-11-25",
        blNo: "9999",
        vesselType: "Flight",
        vesselNo: "",
        flightNo: "FL-777",
        eta: "3",
        volume: "150",
        blDate: "18-11-25",
        documents: [
          { id: 1, name: "Invoice.pdf" },
          { id: 2, name: "BL.pdf" },
          { id: 3, name: "Insurance.pdf" }
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
        mode: "Sea",
        service: "Export",
        containerNo: "—",
        sobDate: "—",
        deliveredDate: "—",
        blNo: "—",
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
      <div className="h-screen bg-gray-50 w-full flex flex-col overflow-hidden">
        <div className="p-8">
          <h1 className="text-xl font-semibold text-red-600">Job Not Found</h1>
        </div>
      </div>
    );
  }

  // Normalize documents: ensure 5 constant document rows per job.
  const normalizeDocs = (rawDocs) => {
    const result = DEFAULT_DOC_TITLES.map((title, idx) => {
      const existing = rawDocs?.find((d) => {
        if (!d || !d.name) return false;
        return d.name.toLowerCase().includes(title.toLowerCase());
      });
      return {
        id: idx + 1,
        title,
        fileName: existing ? existing.name : null
      };
    });

    const unmatched = (rawDocs || []).filter(d => {
      return !result.some(r => r.fileName && r.fileName === d.name);
    });

    let j = 0;
    for (let i = 0; i < result.length && j < unmatched.length; i++) {
      if (!result[i].fileName) {
        result[i].fileName = unmatched[j].name;
        j++;
      }
    }

    return result;
  };

  // Local editable state (start with original job's values)
  const [jobState, setJobState] = useState({ ...originalJob });
  const [docs, setDocs] = useState(() => normalizeDocs(originalJob.documents || []));
  // initialize edit mode from navigation state (JobsDashboard passes { state: { edit: true } })
  const [isEdit, setIsEdit] = useState(Boolean(location?.state?.edit));

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
    setDocs(normalizeDocs(originalJob.documents || []));
    setIsEdit(false);
  };

  // Documents logic (updated)
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

  // Delete only removes the file content, not the document row.
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

  // Header upload: put into first empty doc or replace first
  const handleHeaderUpload = (file) => {
    if (!file) return;
    const firstEmpty = docs.find(d => !d.fileName);
    if (!firstEmpty) {
      setDocs((d) => d.map((x, idx) => idx === 0 ? { ...x, fileName: file.name } : x));
    } else {
      setDocs((d) => d.map(x => x.id === firstEmpty.id ? { ...x, fileName: file.name } : x));
    }
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
          <div className="flex flex-col min-h-screen bg-gray-100 text-slate-700">
            <main className="flex-grow">
          <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">

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

            {/* DETAILS CARD */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
              <div className="p-4 sm:p-6 md:p-8">
                {/* Mobile: Single column, Desktop: Two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 text-sm">
                  {/* LEFT COLUMN */}
                  <div className="space-y-4 sm:space-y-6">
                    <FieldDisplay label="Exporter Name" value={jobState.exporterName} isEdit={isEdit} onChange={(v) => handleChange("exporterName", v)} />
                    <FieldDisplay label="Exporter Address" value={jobState.exporterAddress} isEdit={isEdit} onChange={(v) => handleChange("exporterAddress", v)} />
                    <FieldDisplay label="Port Of Loading" value={jobState.portOfLoading} isEdit={isEdit} onChange={(v) => handleChange("portOfLoading", v)} />

                    {/* Type of Mode dropdown */}
                    <div className="space-y-2">
                      <dt className="font-medium text-slate-700 text-sm">Type of Mode</dt>
                      <dd>
                        {!isEdit ? (
                          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">{jobState.mode}</div>
                        ) : (
                          <select value={jobState.mode} onChange={(e) => handleChange("mode", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Air">Air</option>
                            <option value="Sea">Sea</option>
                          </select>
                        )}
                      </dd>
                    </div>

                    <FieldDisplay label="Container No" value={jobState.containerNo} isEdit={isEdit} onChange={(v) => handleChange("containerNo", v)} />
                    <DateFieldDisplay label="SOB Date" value={jobState.sobDate} isEdit={isEdit} onChange={(v) => handleChange("sobDate", v)} />
                    <DateFieldDisplay label="Delivered on Date" value={jobState.deliveredDate} isEdit={isEdit} onChange={(v) => handleChange("deliveredDate", v)} />
                    <FieldDisplay label="BL No" value={jobState.blNo} isEdit={isEdit} onChange={(v) => handleChange("blNo", v)} />
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-4 sm:space-y-6">
                    <FieldDisplay label="Consignee Name" value={jobState.consigneeName} isEdit={isEdit} onChange={(v) => handleChange("consigneeName", v)} />
                    <FieldDisplay label="Consignee Address" value={jobState.consigneeAddress} isEdit={isEdit} onChange={(v) => handleChange("consigneeAddress", v)} />
                    <FieldDisplay label="Port Of Discharge" value={jobState.portOfDischarge} isEdit={isEdit} onChange={(v) => handleChange("portOfDischarge", v)} />

                    {/* Service dropdown (Import / Export) */}
                    <div className="space-y-2">
                      <dt className="font-medium text-slate-700 text-sm">Service</dt>
                      <dd>
                        {!isEdit ? (
                          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">{jobState.service}</div>
                        ) : (
                          <select value={jobState.service} onChange={(e) => handleChange("service", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Import">Import</option>
                            <option value="Export">Export</option>
                          </select>
                        )}
                      </dd>
                    </div>

                    {/* Vessel / Flight */}
                    <div className="space-y-2">
                      <dt className="font-medium text-slate-700 text-sm">Vessel / Flight</dt>
                      <dd>
                        {!isEdit ? (
                          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">
                            {jobState.vesselType === "Vessel"
                              ? jobState.vesselNo || jobState.vesselNoDisplay
                              : jobState.flightNo || jobState.flightNoDisplay}
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select value={jobState.vesselType} onChange={(e) => handleChange("vesselType", e.target.value)} className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option value="Vessel">Vessel</option>
                              <option value="Flight">Flight</option>
                            </select>

                            {jobState.vesselType === "Vessel" ? (
                              <input value={jobState.vesselNo} onChange={(e) => handleChange("vesselNo", e.target.value)} placeholder="Vessel No" className="flex-1 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            ) : (
                              <input value={jobState.flightNo} onChange={(e) => handleChange("flightNo", e.target.value)} placeholder="Flight No" className="flex-1 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            )}
                          </div>
                        )}
                      </dd>
                    </div>

                    <FieldDisplay label="ETA" value={jobState.eta} isEdit={isEdit} onChange={(v) => handleChange("eta", v)} />
                    <FieldDisplay label="Volume" value={jobState.volume} isEdit={isEdit} onChange={(v) => handleChange("volume", v)} />
                    <DateFieldDisplay label="BL Date" value={jobState.blDate} isEdit={isEdit} onChange={(v) => handleChange("blDate", v)} />
                  </div>
                </div>
              </div>
            </div>

            {/* DOCUMENTS BOX (NEW CARD BELOW DETAILS) */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Documents</h3>
                </div>

                <div className="overflow-x-auto bg-white border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 w-24">Serial No</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Document Name</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 w-56">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(docs.length ? docs : []).map((doc, idx) => (
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
            </div>

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