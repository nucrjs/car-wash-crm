const API_URL = "https://script.google.com/macros/s/AKfycbzqNiR_lC14CTdodOJb_0JvYUl-1e9PN9Ukj8W8f5Cc0Xo1Tph2LYfbcd2QyDh5cp92mw/exec";

let companies = [];

async function loadCompanies() {
  const res = await fetch(`${API_URL}?action=companies`);
  const json = await res.json();

  if (!json.success) {
    alert("Failed to load companies");
    return;
  }

  companies = json.data;
  renderCompanies(companies);
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

document.getElementById("searchBox").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();

  const filtered = companies.filter(c =>
    String(c["Company Name"] || "").toLowerCase().includes(term)
  );

  renderCompanies(filtered);
});

loadCompanies();
