const API_URL = "https://script.google.com/macros/s/AKfycbzqNiR_lC14CTdodOJb_0JvYUl-1e9PN9Ukj8W8f5Cc0Xo1Tph2LYfbcd2QyDh5cp92mw/exec?action=companies";

let companies = [];

async function loadCompanies() {
  const res = await fetch(API_URL);
  const json = await res.json();

  if (!json.success) {
    alert("Failed to load companies: " + json.message);
console.log(json);
    return;
  }

  companies = json.data;
  renderCompanies(companies);
  updateDashboard();
}

function renderCompanies(data) {
  const tbody = document.getElementById("companyTable");
  tbody.innerHTML = "";

  data.forEach(company => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${company["Company Name"] || ""}</td>
      <td>${company["Total Locations"] || ""}</td>
      <td>${company["Priority Score"] || ""}</td>
      <td>${company["PE Backed"] || ""}</td>
      <td><span class="badge">${company["Lead Status"] || ""}</span></td>
      <td>${company["Next Follow Up"] || ""}</td>
    `;

    tr.addEventListener("click", () => showCompany(company));
    tbody.appendChild(tr);
  });
}

function showCompany(company) {
  const panel = document.getElementById("detailPanel");

  panel.innerHTML = `
    <h2>${company["Company Name"] || ""}</h2>
    <p><strong>Website:</strong> <a href="${company["Website"]}" target="_blank">${company["Website"] || ""}</a></p>
    <p><strong>Total Locations:</strong> ${company["Total Locations"] || ""}</p>
    <p><strong>Priority Score:</strong> ${company["Priority Score"] || ""}</p>
    <p><strong>PE Backed:</strong> ${company["PE Backed"] || ""}</p>
    <p><strong>PE Firm:</strong> ${company["PE Firm"] || ""}</p>
    <p><strong>Subscription Program:</strong> ${company["Subscription Program"] || ""}</p>
    <p><strong>Growth Markets:</strong> ${company["Growth Markets"] || ""}</p>
    <p><strong>Lead Status:</strong> ${company["Lead Status"] || ""}</p>
    <p><strong>Next Follow Up:</strong> ${company["Next Follow Up"] || ""}</p>
    <p><strong>Research Notes:</strong><br>${company["Research Notes"] || ""}</p>
  `;
}

function updateDashboard() {
  document.getElementById("companyCount").innerText = companies.length;

  const locations = companies.reduce(
    (total, company) => total + Number(company["Total Locations"] || 0),
    0
  );

  document.getElementById("locationCount").innerText = locations;

  const pe = companies.filter(company =>
    String(company["PE Backed"] || "").toLowerCase() === "yes"
  ).length;

  document.getElementById("peCount").innerText = pe;

  const today = new Date();

  const due = companies.filter(company => {
    if (!company["Next Follow Up"]) return false;
    return new Date(company["Next Follow Up"]) <= today;
  }).length;

  document.getElementById("followupCount").innerText = due;
}

function applyFilters() {
  const search = document.getElementById("searchBox").value.toLowerCase();
  const priority = document.getElementById("priorityFilter").value;
  const status = document.getElementById("statusFilter").value;

  const filtered = companies.filter(company => {
    const matchSearch = String(company["Company Name"] || "")
      .toLowerCase()
      .includes(search);

    const matchPriority =
      !priority || String(company["Priority Score"] || "") === priority;

    const matchStatus =
      !status || String(company["Lead Status"] || "") === status;

    return matchSearch && matchPriority && matchStatus;
  });

  renderCompanies(filtered);
}

document.getElementById("searchBox").addEventListener("input", applyFilters);
document.getElementById("priorityFilter").addEventListener("change", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);

async function loadCompanies() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();

    console.log("API_URL:", API_URL);
    console.log("Raw API response:", text);

    const json = JSON.parse(text);

    if (!json.success) {
      alert("Failed to load companies: " + json.message);
      return;
    }

    companies = json.data;
    renderCompanies(companies);
    updateDashboard();

  } catch (error) {
    console.error("Load error:", error);
    alert("Companies failed to load. Check Console for Raw API response.");
  }
}
