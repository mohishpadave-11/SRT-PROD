/**
 * dashboardStats.js
 * Contains logic to process raw Job data into chart-ready formats.
 */

// --- 1. COMPREHENSIVE COUNTRY MAPPING (Name -> ISO Numeric Code) ---
// These codes (840, 156, etc.) match the 'world-atlas' topology used by react-simple-maps.
const COUNTRY_ISO_MAP = {
  // --- North America ---
  'usa': '840', 'united states': '840', 'america': '840', 'us': '840',
  'canada': '124',
  'mexico': '484',

  // --- Asia ---
  'china': '156', 'cn': '156',
  'india': '356', 'in': '356',
  'japan': '392', 'jp': '392',
  'south korea': '410', 'korea': '410', 'kr': '410',
  'indonesia': '360', 'id': '360',
  'vietnam': '704', 'vn': '704',
  'thailand': '764', 'th': '764',
  'malaysia': '458', 'my': '458',
  'singapore': '702', 'sg': '702',
  'philippines': '608', 'ph': '608',
  'taiwan': '158', 'tw': '158',
  'hong kong': '344', 'hk': '344',
  'bangladesh': '050', 'bd': '050',
  'pakistan': '586', 'pk': '586',
  'sri lanka': '144', 'lk': '144',

  // --- Middle East ---
  'saudi arabia': '682', 'saudi': '682', 'sa': '682',
  'uae': '784', 'united arab emirates': '784', 'dubai': '784', 'abu dhabi': '784',
  'turkey': '792', 'tr': '792',
  'israel': '376', 'il': '376',
  'egypt': '818', 'eg': '818',
  'qatar': '634', 'qa': '634',
  'kuwait': '414', 'kw': '414',
  'oman': '512', 'om': '512',

  // --- Europe ---
  'germany': '276', 'de': '276',
  'united kingdom': '826', 'uk': '826', 'great britain': '826', 'england': '826',
  'france': '250', 'fr': '250',
  'italy': '380', 'it': '380',
  'spain': '724', 'es': '724',
  'netherlands': '528', 'holland': '528', 'nl': '528',
  'belgium': '056', 'be': '056',
  'switzerland': '756', 'ch': '756',
  'poland': '616', 'pl': '616',
  'sweden': '752', 'se': '752',
  'norway': '578', 'no': '578',
  'denmark': '208', 'dk': '208',
  'finland': '246', 'fi': '246',
  'ireland': '372', 'ie': '372',
  'russia': '643', 'ru': '643',
  'greece': '300', 'gr': '300',
  'portugal': '620', 'pt': '620',

  // --- South America ---
  'brazil': '076', 'br': '076',
  'argentina': '032', 'ar': '032',
  'chile': '152', 'cl': '152',
  'colombia': '170', 'co': '170',
  'peru': '604', 'pe': '604',

  // --- Oceania ---
  'australia': '036', 'au': '036',
  'new zealand': '554', 'nz': '554',

  // --- Africa ---
  'south africa': '710', 'za': '710',
  'nigeria': '566', 'ng': '566',
  'kenya': '404', 'ke': '404',
  'morocco': '504', 'ma': '504',
  'congo': '180', 'dr congo': '180'
};

// --- Helper to extract ISO Code from a string ---
const getCountryCode = (locationString) => {
  if (!locationString) return null;
  const lowerLoc = locationString.toLowerCase().trim();

  // 1. Check for exact matches first (faster)
  if (COUNTRY_ISO_MAP[lowerLoc]) return COUNTRY_ISO_MAP[lowerLoc];

  // 2. Check if the string *contains* a country name
  // Example: "New York, USA" contains "usa" -> returns '840'
  const foundKey = Object.keys(COUNTRY_ISO_MAP).find(key => lowerLoc.includes(key));
  
  return foundKey ? COUNTRY_ISO_MAP[foundKey] : null;
};


// --- 2. Calculate Top 5 Parties (Notify Party) ---
export const calculateTop5Parties = (jobs) => {
  const counts = {};

  jobs.forEach(job => {
    // Normalize names to prevent duplicates like "Company A" vs "company a"
    const rawName = job.notify_party || "Unknown";
    const party = rawName.trim(); 
    counts[party] = (counts[party] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, jobs: count }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);
};


// --- 3. Calculate Map Data (Using Final Destination) ---
export const calculateMapData = (jobs) => {
  const jobsByCountry = {};

  jobs.forEach(job => {
    // ✅ PRIORITY 1: Check 'Final Destination' (e.g., "New York, USA")
    let isoCode = getCountryCode(job.final_destination);

    // ✅ PRIORITY 2: If fail, check 'Port of Discharge' (e.g., "Shanghai")
    if (!isoCode) {
      isoCode = getCountryCode(job.port_of_discharge);
    }

    if (isoCode) {
      jobsByCountry[isoCode] = (jobsByCountry[isoCode] || 0) + 1;
    }
  });

  return jobsByCountry;
};


// --- 4. Calculate Jobs Created (Chart Data) ---
export const calculateJobsCreated = (jobs) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  // Initial 4 weeks structure
  const weeks = [
    { name: 'Week 1', lastMonth: 0, thisMonth: 0 },
    { name: 'Week 2', lastMonth: 0, thisMonth: 0 },
    { name: 'Week 3', lastMonth: 0, thisMonth: 0 },
    { name: 'Week 4', lastMonth: 0, thisMonth: 0 },
  ];

  jobs.forEach(job => {
    const date = new Date(job.job_date || job.createdAt);
    const month = date.getMonth();
    const day = date.getDate();

    // Map day 1-31 to index 0-3 (roughly)
    const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);

    if (month === currentMonth) {
      thisMonthTotal++;
      weeks[weekIndex].thisMonth += 1;
    } else if (month === lastMonth) {
      lastMonthTotal++;
      weeks[weekIndex].lastMonth += 1;
    }
  });

  return {
    chartData: weeks,
    totals: { thisMonth: thisMonthTotal, lastMonth: lastMonthTotal }
  };
};


// --- 5. Calculate Daily Jobs for Selected Month ---
export const calculateDailyJobs = (jobs, selectedMonthShortName) => {
  // Convert 'Jan' to 0, 'Feb' to 1, etc.
  const monthIndex = new Date(`${selectedMonthShortName} 1, 2000`).getMonth();
  
  // Get correct days in month for current year
  const daysInMonth = new Date(new Date().getFullYear(), monthIndex + 1, 0).getDate();

  // Create array [1..31]
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    name: (i + 1).toString(),
    day: i + 1,
    jobs: 0
  }));

  jobs.forEach(job => {
    const date = new Date(job.job_date || job.createdAt);
    // Check if job is in the selected month
    if (date.getMonth() === monthIndex) {
      const day = date.getDate();
      if (dailyData[day - 1]) {
        dailyData[day - 1].jobs += 1;
      }
    }
  });

  return dailyData;
};


// --- 6. Calculate Total Counts (Stats Cards) ---
export const calculateTotalCounts = (jobs) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  let thisMonthCount = 0;
  let lastMonthCount = 0;

  jobs.forEach(job => {
    const date = new Date(job.job_date || job.createdAt);
    const month = date.getMonth();

    if (month === currentMonth) thisMonthCount++;
    if (month === lastMonth) lastMonthCount++;
  });

  return { thisMonth: thisMonthCount, lastMonth: lastMonthCount };
};