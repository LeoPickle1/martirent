const XLSX = require("xlsx");
const fs = require("fs");

const workbook = XLSX.readFile("Kontakte.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// This makes row 1 become the real headers
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: "",
  range: 1,
});

const contacts = rows
  .filter((r) => r["Organization Name"] || r["First Name"] || r["Last Name"])
  .map((r) => {
    const firstName = r["First Name"] || "";
    const lastName = r["Last Name"] || "";
    const person = `${firstName} ${lastName}`.trim();

    return {
      company: r["Organization Name"] || person || "Unknown",
      person,
      title: r["Organization Title"] || "",
      phone: [r["Phone 1 - Value"], r["Phone 2 - Value"], r["Phone 3 - Value"]]
        .filter(Boolean)
        .join(" / "),
      email: [r["E-mail 1 - Value"], r["E-mail 2 - Value"], r["E-mail 3 - Value"]]
        .filter(Boolean)
        .join(" / "),
      website: [r["Website 1 - Value"], r["Website 2 - Value"]]
        .filter(Boolean)
        .join(" / "),
      address: r["Address 1 - Formatted"] || "",
      labels: r["Labels"] || "",
      notes: r["Notes"] || "",
    };
  });

const output = `export const importedContacts = ${JSON.stringify(contacts, null, 2)};\n`;

fs.writeFileSync("src/contactsData.js", output);

console.log(`Created src/contactsData.js with ${contacts.length} contacts`);