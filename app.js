const COMPANIES_URL = "https://script.google.com/macros/s/AKfycbzqNiR_lC14CTdodOJb_0JvYUl-1e9PN9Ukj8W8f5Cc0Xo1Tph2LYfbcd2QyDh5cp92mw/exec?action=companies";

let companies = [];

async function loadCompanies() {
  try {
    const res = await fetch(COMPANIES_URL);
    const json = await res.json();

    companies = json.data || [];
    renderCompanies(companies);
    updateDashboard();
  } catch (err) {
    alert("Companies failed to load.");
  }
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
  document.getElementById("detailPanel").innerHTML = `
    <h2>${company["Company Name"] || ""}</h2>
    <p><strong>Website:</strong> <a href="${company["Website"] || "#"}" target="_blank">${company["Website"] || ""}</a></p>
    <p><strong>Total Locations:</strong> ${company["Total Locations"] || ""}</p>
    <p><strong>Priority Score:</strong> ${company["Priority Score"] || ""}</p>
    <p><strong>PE Backed:</strong> ${company["PE Backed"] || ""}</p>
    <p><strong>Lead Status:</strong> ${company["Lead Status"] || ""}</p>
    <p><strong>Next Follow Up:</strong> ${company["Next Follow Up"] || ""}</p>
    <p><strong>Research Notes:</strong><br>${company["Research Notes"] || ""}</p>
  `;
}

function updateDashboard() {
  document.getElementById("companyCount").innerText = companies.length;
  document.getElementById("locationCount").innerText =
    companies.reduce((sum, c) => sum + Number(c["Total Locations"] || 0), 0);
  document.getElementById("peCount").innerText =
    companies.filter(c => String(c["PE Backed"] || "").toLowerCase() === "yes").length;
  document.getElementById("followupCount").innerText =
    companies.filter(c => c["Next Follow Up"]).length;
}

function applyFilters() {
  const search = document.getElementById("searchBox").value.toLowerCase();
  const priority = document.getElementById("priorityFilter").value;
  const status = document.getElementById("statusFilter").value;

  renderCompanies(companies.filter(c =>
    String(c["Company Name"] || "").toLowerCase().includes(search) &&
    (!priority || String(c["Priority Score"] || "") === priority) &&
    (!status || String(c["Lead Status"] || "") === status)
  ));
}

document.getElementById("searchBox").addEventListener("input", applyFilters);
document.getElementById("priorityFilter").addEventListener("change", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);

loadCompanies();
