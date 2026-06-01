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
  const panel = document.getElementById("detailPanel");

  panel.innerHTML = `
    <h2>${company["Company Name"] || ""}</h2>

    <p><strong>Website:</strong> 
      <a href="${company["Website"] || "#"}" target="_blank">
        ${company["Website"] || ""}
      </a>
    </p>

    <label>Priority Score</label>
    <select id="editPriority">
      <option value=""></option>
      <option value="5" ${company["Priority Score"] == "5" ? "selected" : ""}>5</option>
      <option value="4" ${company["Priority Score"] == "4" ? "selected" : ""}>4</option>
      <option value="3" ${company["Priority Score"] == "3" ? "selected" : ""}>3</option>
      <option value="2" ${company["Priority Score"] == "2" ? "selected" : ""}>2</option>
      <option value="1" ${company["Priority Score"] == "1" ? "selected" : ""}>1</option>
    </select>

    <label>PE Backed</label>
    <select id="editPE">
      <option value=""></option>
      <option value="Yes" ${company["PE Backed"] == "Yes" ? "selected" : ""}>Yes</option>
      <option value="No" ${company["PE Backed"] == "No" ? "selected" : ""}>No</option>
      <option value="Unknown" ${company["PE Backed"] == "Unknown" ? "selected" : ""}>Unknown</option>
    </select>

    <label>Lead Status</label>
    <select id="editStatus">
      <option>New</option>
      <option ${company["Lead Status"] == "Researching" ? "selected" : ""}>Researching</option>
      <option ${company["Lead Status"] == "Ready for Outreach" ? "selected" : ""}>Ready for Outreach</option>
      <option ${company["Lead Status"] == "Contacted" ? "selected" : ""}>Contacted</option>
      <option ${company["Lead Status"] == "Follow-Up" ? "selected" : ""}>Follow-Up</option>
      <option ${company["Lead Status"] == "Meeting Set" ? "selected" : ""}>Meeting Set</option>
      <option ${company["Lead Status"] == "Not a Fit" ? "selected" : ""}>Not a Fit</option>
      <option ${company["Lead Status"] == "Do Not Contact" ? "selected" : ""}>Do Not Contact</option>
    </select>

    <label>Next Follow Up</label>
    <input id="editFollowUp" type="date" value="${formatDateForInput(company["Next Follow Up"])}">

    <label>Research Notes</label>
    <textarea id="editNotes">${company["Research Notes"] || ""}</textarea>

    <button onclick="saveCompany('${company["CompanyID"]}')">Save Changes</button>

    <p id="saveMessage"></p>
  `;
}

function formatDateForInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date)) return "";

  return date.toISOString().split("T")[0];
}

async function saveCompany(companyId) {
  const payload = {
    action: "updateCompany",
    CompanyID: companyId,
    "Priority Score": document.getElementById("editPriority").value,
    "PE Backed": document.getElementById("editPE").value,
    "Lead Status": document.getElementById("editStatus").value,
    "Next Follow Up": document.getElementById("editFollowUp").value,
    "Research Notes": document.getElementById("editNotes").value
  };

  const res = await fetch(COMPANIES_URL.replace("?action=companies", ""), {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const json = await res.json();

  if (json.success) {
    document.getElementById("saveMessage").innerText = "Saved successfully.";

    const company = companies.find(c => c.CompanyID === companyId);
    if (company) {
      company["Priority Score"] = payload["Priority Score"];
      company["PE Backed"] = payload["PE Backed"];
      company["Lead Status"] = payload["Lead Status"];
      company["Next Follow Up"] = payload["Next Follow Up"];
      company["Research Notes"] = payload["Research Notes"];
    }

    renderCompanies(companies);
    updateDashboard();
  } else {
    document.getElementById("saveMessage").innerText = "Save failed: " + json.message;
  }
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
