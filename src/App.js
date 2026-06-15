import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [appNotice, setAppNotice] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [highlightMaintenance, setHighlightMaintenance] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [language, setLanguage] = useState("en");
const [hasLoadedBackend, setHasLoadedBackend] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notificationsEnabled") === "true";
  });

  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("properties");
    return saved ? JSON.parse(saved) : [
      { name: "Sempach", address: "Feldmatt 22" },
      { name: "Langnau", address: "Lenggenweg 12" },
      { name: "Hilterfingen", address: "Hüneggweg 15" },
      { name: "Aeschlen", address: "Chaletweg 9" },
      { name: "Traube", address: "Dorfstrasse 60" },
      { name: "Kundmatt", address: "Kundmatt 685" },
      { name: "Grenchen", address: "Allmendstrasse 5" },
      { name: "Eich", address: "Eggweid 3" },
    ];
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem("maintenanceAlerts");
    return saved ? JSON.parse(saved) : [];
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("documents");
    return saved ? JSON.parse(saved) : [
      { name: "Alpha Control", type: "SiNa / Electrical Inspection" },
      { name: "MegaOhm", type: "Electrical Inspection" },
      { name: "Frutiger-Zbinden", type: "Heating / Floor Heating" },
      { name: "Meier-Tobler", type: "Heating Service" },
      { name: "Jomos", type: "Fire Extinguisher" },
      { name: "Primus", type: "Fire Extinguisher" },
      { name: "Felix Weber", type: "Chimney Sweep" },
    ];
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("contacts");
    return saved ? JSON.parse(saved) : [
      { company: "Felix Weber", phone: "", email: "", website: "" },
      { company: "Frutiger-Zbinden", phone: "", email: "", website: "" },
      { company: "GT Estermann", phone: "", email: "", website: "" },
      { company: "Alpha Control", phone: "", email: "", website: "" },
      { company: "Meier-Tobler", phone: "", email: "", website: "" },
    ];
  });
const propertyNotes = [
  {
    property: "Hilterfingen",
    unit: "EG",
    date: "2024-09-23",
    note: "Hallway light: Breaker is on the 3rd floor. This was the entrance hall before the staircase was closed. The staircase can easily be reopened if the ground and first floors are used together.",
    noteDe: "Licht im Gang: Die Sicherung ist im 3. Stock. Früher war dies der Eingangsbereich, bevor das Treppenhaus geschlossen wurde. Das Treppenhaus kann einfach wieder geöffnet werden, wenn Erdgeschoss und 1. Stock zusammen genutzt werden.",
  },
  {
    property: "Hilterfingen",
    unit: "EG",
    date: "2024-09-23",
    note: "Basement humidity is high. Cutting back trees helps increase sunlight and reduce moisture.",
    noteDe: "Die Feuchtigkeit im Keller ist hoch. Das Zurückschneiden der Bäume hilft, mehr Sonnenlicht zu bekommen und die Feuchtigkeit zu reduzieren.",
  },
  {
    property: "Hilterfingen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Garden maintenance: Shrubs on the retaining wall at the north-east corner along the upper pathway around the house must be trimmed.",
    noteDe: "Gartenunterhalt: Die Sträucher an der Stützmauer bei der nordöstlichen Ecke entlang des oberen Weges ums Haus müssen geschnitten werden.",
  },
  {
    property: "Hilterfingen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Garages: Ground Floor #17 and First Floor #7 are in the shared garage. Second Floor has its own private garage.",
    noteDe: "Garagen: Erdgeschoss Nr. 17 und 1. Stock Nr. 7 sind in der gemeinsamen Garage. Der 2. Stock hat eine eigene private Garage.",
  },
  {
    property: "Aeschlen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Carpenter: Losli. Also handled wasp removal.",
    noteDe: "Schreiner: Losli. Hat auch die Wespenentfernung erledigt.",
  },
  {
    property: "Aeschlen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Heating system uses oil. Verify the age of the system.",
    noteDe: "Die Heizung läuft mit Öl. Das Alter der Anlage prüfen.",
  },
  {
    property: "Grenchen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Infrared panels: Each uses about 1,000 W. Approximately 7,000 W total used in the upper apartment. 12 panels installed (verify). Two wood stoves are also present.",
    noteDe: "Infrarot-Paneele: Jedes braucht etwa 1'000 W. In der oberen Wohnung werden insgesamt ungefähr 7'000 W genutzt. 12 Paneele sind installiert, bitte prüfen. Es gibt auch zwei Holzöfen.",
  },
  {
    property: "Grenchen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Kitchen infrared panel: Controller caught fire. It cannot be repaired, but the tenant does not need it.",
    noteDe: "Infrarot-Paneel in der Küche: Der Regler hat Feuer gefangen. Er kann nicht repariert werden, aber der Mieter braucht ihn nicht.",
  },
  {
    property: "Grenchen",
    unit: "Ganzes Haus",
    date: "2024-09-23",
    note: "Windows: Upper apartment windows are in good condition. Grey windows are not.",
    noteDe: "Fenster: Die Fenster der oberen Wohnung sind in gutem Zustand. Die grauen Fenster nicht.",
  },
  {
    property: "Allgemein",
    unit: "Ganzes Haus",
    date: "2024-11-06",
    note: "Bauknecht: Do not work with this company again. Their insurance and legal department are based in Germany, making claims difficult. Example: Traube water-damage case. Swiss insurers use a water-damage agreement that may cover replacement value even when the installer's insurance only covers depreciated value.",
    noteDe: "Bauknecht: Nicht mehr mit dieser Firma arbeiten. Ihre Versicherung und Rechtsabteilung sind in Deutschland, was Schadenfälle schwierig macht. Beispiel: Wasserschaden Traube. Schweizer Versicherungen nutzen eine Wasserschaden-Vereinbarung, die den Neuwert decken kann, auch wenn die Installateur-Versicherung nur den Zeitwert übernimmt.",
  },
  {
    property: "Traube",
    unit: "Ganzes Haus",
    date: "2025-01-29",
    note: "Discussion with Mr. Allemann: 6.5-room detached house (14 years old) approximately CHF 2,150/month. New 3.5-room apartment approximately CHF 1,200–1,300/month maximum.",
    noteDe: "Gespräch mit Herr Allemann: 6.5-Zimmer-Einfamilienhaus, 14 Jahre alt, ungefähr CHF 2'150 pro Monat. Neue 3.5-Zimmer-Wohnung ungefähr maximal CHF 1'200–1'300 pro Monat.",
  },
  {
    property: "Grenchen",
    unit: "Ganzes Haus",
    date: "2025-04-11",
    note: "Chimney sweep comes every year before first firing. No appointment needed; chimney sweep contacts owner. Tenant may clean stove pipe. FEUKO is not required for wood stoves, only for oil/gas burners.",
    noteDe: "Kaminfeger kommt jedes Jahr vor dem ersten Einfeuern. Kein Termin nötig; der Kaminfeger kontaktiert den Eigentümer. Der Mieter darf das Ofenrohr reinigen. FEUKO ist bei Holzöfen nicht nötig, nur bei Öl- oder Gasbrennern.",
  },
];
  useEffect(() => localStorage.setItem("properties", JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem("maintenanceAlerts", JSON.stringify(maintenance)), [maintenance]);
  useEffect(() => {
  fetch("https://martirent-backend-production.up.railway.app/maintenance")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setMaintenance(data);
        setHasLoadedBackend(true);
      }
    })
    .catch((error) => {
      console.error("Backend load failed:", error);
    });
}, []);

useEffect(() => {
  if (!hasLoadedBackend) return;

  fetch("https://martirent-backend-production.up.railway.app/maintenance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(maintenance),
  }).catch((error) => {
    console.error("Backend sync failed:", error);
  });
}, [maintenance, hasLoadedBackend]);
  useEffect(() => localStorage.setItem("documents", JSON.stringify(documents)), [documents]);
  useEffect(() => localStorage.setItem("contacts", JSON.stringify(contacts)), [contacts]);
useEffect(() => {
  const content = document.querySelector(".content");

  const handleScroll = () => {
    if (!content) return;
    setShowHeader(content.scrollTop < 50);
  };

  content?.addEventListener("scroll", handleScroll);

  return () => {
    content?.removeEventListener("scroll", handleScroll);
  };
}, []);
useEffect(() => {
  if (!highlightMaintenance) return;
  if (tab !== "maintenance") return;

  setTimeout(() => {
    const el = document.getElementById(highlightMaintenance);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      el.classList.add("flashCard");

      setTimeout(() => {
  el.classList.remove("flashCard");
  setHighlightMaintenance(null);
}, 1800);
    }
  }, 200);
}, [highlightMaintenance, tab]);
const text = {
  en: {
    propertyNameQuestion: "Property name?",
addressQuestion: "Address?",
maintenanceTypeQuestion: "Maintenance type?",
companyQuestion: "Company?",
lastDoneQuestion: "Last done date (YYYY-MM-DD)?",
intervalQuestion: "Interval in years?",
warningDaysQuestion: "Warn how many days before due?",
documentNameQuestion: "Document / company name?",
typeNotesQuestion: "Type / notes?",
phoneQuestion: "Phone?",
emailQuestion: "Email?",
websiteQuestion: "Website?",
deletePropertyConfirm: "Are you sure you want to delete this property?",
deleteMaintenanceConfirm: "Are you sure you want to delete this maintenance item?",
deleteDocumentConfirm: "Are you sure you want to delete this document?",
deleteContactConfirm: "Are you sure you want to delete this contact?",
completeMaintenanceConfirm: "Mark this maintenance as complete? This will update the Last Done date to today.",
    appSubtitle: "Swiss Property Manager",
dashboard: "Home Page",
    welcome: "Welcome to MartiRent",
    description: "Manage properties, maintenance, contacts, and documents in one place.",
    properties: "Properties",
    maintenance: "Maintenance",
    overdue: "Overdue",
    needsAttention: "Needs Attention",
    quickActions: "Quick Actions",
    backup: "Backup",
    exportBackup: "Export Backup",
    restoreBackup: "Restore Backup",
    switchLanguage: "Deutsch",
    calendar: "Calendar",
documents: "Documents",
contacts: "Contacts",
home: "Home",
props: "Properties",
maint: "Maintenance",
search: "Search...",
add: "Add",
edit: "Edit",
delete: "Delete",
complete: "Complete",
viewDetails: "View Details",
propertyDetails: "Property Details",
address: "Address",
maintenanceItems: "Maintenance items",
linkedDocuments: "Linked documents",
lastDone: "Last done",
nextDue: "Next due",
status: "Status",
company: "Company",
phone: "Phone",
email: "Email",
website: "Website",
noMaintenance: "No maintenance linked to this property.",
noNotes: "No notes for this property.",
notes: "Notes",
unit: "Unit",
date: "Date",
back: "Back",
everythingGood: "Everything looks good.",
searchResults: "Search Results",
noPropertiesFound: "No properties found.",
noMaintenanceFound: "No maintenance found.",
noContactsFound: "No contacts found.",
noDocumentsFound: "No documents found.",
  },
  de: {
    propertyNameQuestion: "Name der Immobilie?",
addressQuestion: "Adresse?",
maintenanceTypeQuestion: "Unterhaltsart?",
companyQuestion: "Firma?",
lastDoneQuestion: "Zuletzt erledigt (YYYY-MM-DD)?",
intervalQuestion: "Intervall in Jahren?",
warningDaysQuestion: "Wie viele Tage vorher warnen?",
documentNameQuestion: "Dokument / Firmenname?",
typeNotesQuestion: "Typ / Notizen?",
phoneQuestion: "Telefon?",
emailQuestion: "E-Mail?",
websiteQuestion: "Webseite?",
deletePropertyConfirm: "Möchtest du diese Immobilie wirklich löschen?",
deleteMaintenanceConfirm: "Möchtest du diesen Unterhalt wirklich löschen?",
deleteDocumentConfirm: "Möchtest du dieses Dokument wirklich löschen?",
deleteContactConfirm: "Möchtest du diesen Kontakt wirklich löschen?",
completeMaintenanceConfirm: "Diesen Unterhalt als erledigt markieren? Das Datum wird auf heute gesetzt.",
appSubtitle: "Schweizer Immobilienverwaltung",   
dashboard: "Startseite",
    welcome: "Willkommen bei MartiRent",
    description: "Verwalte Immobilien, Unterhalt, Kontakte und Dokumente an einem Ort.",

    properties: "Immobilien",
    maintenance: "Unterhalt",
    overdue: "Überfällig",
    needsAttention: "Benötigt Aufmerksamkeit",
    quickActions: "Schnellzugriff",
    backup: "Sicherung",
    exportBackup: "Sicherung exportieren",
    restoreBackup: "Sicherung wiederherstellen",
    switchLanguage: "English",
    calendar: "Kalender",
documents: "Dokumente",
contacts: "Kontakte",
home: "Start",
props: "Immobilien",
maint: "Unterhalt",
search: "Suchen...",
add: "Hinzufügen",
edit: "Bearbeiten",
delete: "Löschen",
complete: "Erledigt",
viewDetails: "Details anzeigen",
propertyDetails: "Immobilien-Details",
address: "Adresse",
maintenanceItems: "Unterhaltsarbeiten",
linkedDocuments: "Verknüpfte Dokumente",
lastDone: "Zuletzt erledigt",
nextDue: "Nächster Termin",
status: "Status",
company: "Firma",
phone: "Telefon",
email: "E-Mail",
website: "Webseite",
noMaintenance: "Kein Unterhalt mit dieser Immobilie verknüpft.",
noNotes: "Keine Notizen für diese Immobilie.",
notes: "Notizen",
unit: "Einheit",
date: "Datum",
back: "Zurück",
everythingGood: "Alles sieht gut aus.",
searchResults: "Suchergebnisse",
noPropertiesFound: "Keine Immobilien gefunden.",
noMaintenanceFound: "Kein Unterhalt gefunden.",
noContactsFound: "Keine Kontakte gefunden.",
noDocumentsFound: "Keine Dokumente gefunden.",
  },
};

const t = text[language];
const todayText = new Date().toLocaleDateString(
  language === "en" ? "en-CA" : "de-CH",
  {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }
);
  const addYears = (date, years) => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + Number(years));
    return d.toISOString().split("T")[0];
  };

  const daysUntil = (date) => {
    const today = new Date();
    const target = new Date(date);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const items = maintenance
  .filter((m) => m.lastDone || m.nextDue)
  .map((m) => {
    const nextDue = m.nextDue || addYears(m.lastDone, m.intervalYears);
    const days = daysUntil(nextDue);
    const warningDays = Number(m.warningDays || 30);

    return {
      ...m,
      nextDue,
      days,
      warningDays,
      status:
        days < 0
          ? "overdue"
          : days <= warningDays
          ? "warning"
          : "future",
    };
  });
const sendReminderEmail = async (
  property,
  maintenance,
  company,
  dueDate,
  daysRemaining
) => {
  try {
    await emailjs.send(
      "service_se557qo",
      "template_ewxeb9s",
      {
        to_email: "martirent2026@gmail.com",
        property,
        maintenance,
        company,
        due_date: dueDate,
        days_remaining: daysRemaining,
      },
      "OjiM96plxa6axVPRc"
    );

    console.log("Email sent");
  } catch (error) {
    console.error("Email failed", error);
  }
};

useEffect(() => {
  const reminderDays = [365, 30, 7];

  items.forEach((item) => {
    if (!reminderDays.includes(item.days)) return;

    const emailId = `${item.property}-${item.type}-${item.nextDue}-${item.days}`;

    const sentEmails = JSON.parse(
      localStorage.getItem("sentReminderEmails") || "[]"
    );

    if (sentEmails.includes(emailId)) return;

    sendReminderEmail(
      item.property,
      item.type,
      item.company,
      item.nextDue,
      item.days
    );

    localStorage.setItem(
      "sentReminderEmails",
      JSON.stringify([...sentEmails, emailId])
    );
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [maintenance]);
  const filteredItems = items
  .filter((m) => {
    const s = search.toLowerCase();
    return (
      m.property.toLowerCase().includes(s) ||
      m.type.toLowerCase().includes(s) ||
      m.company.toLowerCase().includes(s)
    );
  })
  .sort((a, b) => {
    if (a.status === "overdue" && b.status !== "overdue") return -1;
    if (a.status !== "overdue" && b.status === "overdue") return 1;

    const propertyCompare = a.property.localeCompare(b.property);
    if (propertyCompare !== 0) return propertyCompare;

    return a.type.localeCompare(b.type);
  });
  const filteredProperties = properties
  .filter((p) => {
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.address.toLowerCase().includes(s);
  })
  .sort((a, b) => a.name.localeCompare(b.name));

  const filteredDocuments = documents
  .filter((d) => {
    const s = search.toLowerCase();
    return d.name.toLowerCase().includes(s) || d.type.toLowerCase().includes(s);
  })
  .sort((a, b) => a.name.localeCompare(b.name));

  const filteredContacts = contacts.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.company.toLowerCase().includes(s) ||
      c.phone.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.website.toLowerCase().includes(s)
    );
  });

  const overdue = filteredItems.filter((m) => m.status === "overdue");
  const dueSoon = filteredItems.filter((m) => m.status === "warning");
  const attentionItems = [...overdue, ...dueSoon].sort((a, b) => a.days - b.days);

  const today = new Date();
  const calendarDate = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendar = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (day) => {
    if (!day) return null;
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const enableNotifications = async () => {
  if (!("Notification" in window)) {
    alert("Notifications are not supported in this browser.");
    return;
  }

  if (!("serviceWorker" in navigator)) {
    alert("Service workers are not supported in this browser.");
    return;
  }

  if (!("PushManager" in window)) {
    alert("Push notifications are not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    setAppNotice("❌ Notifications blocked");
    setTimeout(() => setAppNotice(""), 3000);
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    const keyResponse = await fetch(
      "https://martirent-backend-production.up.railway.app/vapid-public-key"
    );

    const { publicKey } = await keyResponse.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch("https://martirent-backend-production.up.railway.app/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    setNotificationsEnabled(true);
    localStorage.setItem("notificationsEnabled", "true");

    setAppNotice("🔔 Phone notifications enabled");
    setTimeout(() => setAppNotice(""), 3000);
  } catch (error) {
    console.error(error);
    setAppNotice("❌ Notification setup failed");
    setTimeout(() => setAppNotice(""), 3000);
  }
};

  const addProperty = () => {
  const name = prompt(t.propertyNameQuestion);
  if (name === null) return;

  const address = prompt(t.addressQuestion);
  if (address === null) return;

  if (!name || !address) return;

  setProperties((prev) => [...prev, { name, address }]);
};

  const editProperty = (index) => {
  const current = properties[index];

  const name = prompt(t.propertyNameQuestion, current.name);
  if (name === null) return;

  const address = prompt(t.addressQuestion, current.address);
  if (address === null) return;

  if (!name || !address) return;

  const updated = [...properties];
  updated[index] = { name, address };
  setProperties(updated);
};
  const deleteProperty = (index) => {
  const confirmDelete = window.confirm(t.deletePropertyConfirm);
  if (!confirmDelete) return;

  setProperties((prev) => prev.filter((_, i) => i !== index));
};

const addMaintenance = () => {
  const property = prompt(t.propertyNameQuestion);
  if (property === null) return;

  const type = prompt(t.maintenanceTypeQuestion);
  if (type === null) return;

  const company = prompt(t.companyQuestion);
  if (company === null) return;

  const lastDone = prompt(t.lastDoneQuestion);
  if (lastDone === null) return;

  const intervalYears = prompt(t.intervalQuestion);
  if (intervalYears === null) return;

  const warningDays = prompt(t.warningDaysQuestion);
  if (warningDays === null) return;

  if (!property || !type || !company || !lastDone || !intervalYears || !warningDays) return;

  setMaintenance((prev) => [
    ...prev,
    { property, type, company, lastDone, intervalYears, warningDays },
  ]);
};
const editMaintenance = (index) => {
  const current = maintenance[index];

  const property = prompt(t.propertyNameQuestion, current.property);
  if (property === null) return;

  const type = prompt(t.maintenanceTypeQuestion, current.type);
  if (type === null) return;

  const company = prompt(t.companyQuestion, current.company);
  if (company === null) return;

  const lastDone = prompt(t.lastDoneQuestion, current.lastDone);
  if (lastDone === null) return;

  const intervalYears = prompt(t.intervalQuestion, current.intervalYears);
  if (intervalYears === null) return;

  const warningDays = prompt(t.warningDaysQuestion, current.warningDays);
  if (warningDays === null) return;

  if (!property || !type || !company || !lastDone || !intervalYears || !warningDays) return;

  const updated = [...maintenance];
  updated[index] = { property, type, company, lastDone, intervalYears, warningDays };
  setMaintenance(updated);
};
const completeMaintenance = (index) => {
  const confirmComplete = window.confirm(t.completeMaintenanceConfirm);
  if (!confirmComplete) return;

  const today = new Date().toISOString().split("T")[0];

  const updated = [...maintenance];

  const oldHistory = updated[index].history || [];

  updated[index] = {
    ...updated[index],
    lastDone: today,
    history: [...oldHistory, today],
  };

  setMaintenance(updated);

  setAppNotice("✅ Maintenance marked complete");

  setTimeout(() => {
    setAppNotice("");
  }, 3000);
};
const deleteMaintenance = (index) => {
  const confirmDelete = window.confirm(t.deleteMaintenanceConfirm);
  if (!confirmDelete) return;

  setMaintenance((prev) => prev.filter((_, i) => i !== index));
};


 

  const addDocument = () => {
  const name = prompt(t.documentNameQuestion);
  if (name === null) return;

  const type = prompt(t.typeNotesQuestion);
  if (type === null) return;

  if (!name || !type) return;

  setDocuments((prev) => [...prev, { name, type }]);
};

  const deleteDocument = (index) => {
  const confirmDelete = window.confirm(t.deleteDocumentConfirm);
  if (!confirmDelete) return;

  setDocuments((prev) => prev.filter((_, i) => i !== index));
};

  const addContact = () => {
    const company = prompt(t.companyQuestion);
    if (company === null) return;
    if (!company) return;

    const phone = prompt(t.phoneQuestion) || "";
    const email = prompt(t.emailQuestion) || "";
    const website = prompt(t.websiteQuestion) || "";

    setContacts((prev) => [...prev, { company, phone, email, website }]);
  };

  const editContact = (index) => {
    const current = contacts[index];

    const company = prompt(t.companyQuestion, current.company);
    if (company === null) return;
    if (!company) return;

    const phone = prompt(t.phoneQuestion, current.phone) || "";
    const email = prompt(t.emailQuestion, current.email) || "";
    const website = prompt(t.websiteQuestion, current.website) || "";

    const updated = [...contacts];
    updated[index] = { company, phone, email, website };
    setContacts(updated);
  };

  const deleteContact = (index) => {
    const confirmDelete = window.confirm(t.deleteContactConfirm);
    if (!confirmDelete) return;

    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const exportBackup = () => {
    const backup = {
      properties,
      maintenance,
      documents,
      contacts,
      notificationsEnabled,
      savedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "MartiRent-backup.json";
    a.click();

    URL.revokeObjectURL(url);

    setAppNotice("✅ Backup downloaded");
    setTimeout(() => setAppNotice(""), 3000);
  };

  const importBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (backup.properties) setProperties(backup.properties);
        if (backup.maintenance) setMaintenance(backup.maintenance);
        if (backup.documents) setDocuments(backup.documents);
        if (backup.contacts) setContacts(backup.contacts);

        if (backup.notificationsEnabled !== undefined) {
          setNotificationsEnabled(backup.notificationsEnabled);
          localStorage.setItem("notificationsEnabled", String(backup.notificationsEnabled));
        }

        setAppNotice("✅ Backup restored");
        setTimeout(() => setAppNotice(""), 3000);
      } catch {
        setAppNotice("❌ Invalid backup");
        setTimeout(() => setAppNotice(""), 3000);
      }
    };

    reader.readAsText(file);
  };

  const propertyMaintenance = selectedProperty
    ? items.filter((m) => m.property === selectedProperty.name)
    : [];

  const propertyDocuments = selectedProperty
  ? documents.filter((d) =>
      propertyMaintenance.some(
        (m) =>
          m.company.toLowerCase().includes(d.name.toLowerCase()) ||
          d.name.toLowerCase().includes(m.company.toLowerCase())
      )
    )
  : [];

const propertyNotesForSelected = selectedProperty
  ? propertyNotes.filter(
      (n) => n.property === selectedProperty.name || n.property === "Allgemein"
    )
  : [];
  const openTab = (newTab) => {
  setSearch("");
  setSelectedProperty(null);
  setHighlightMaintenance(null);
  setTab(newTab);

  setTimeout(() => {
    const content = document.querySelector(".content");
    if (content) {
      content.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, 50);
};
const openMaintenanceTab = () => {
  openTab("maintenance");
};
 const renderItem = (m, i) => {
  const originalIndex = maintenance.findIndex(
    (item) =>
      item.property === m.property &&
      item.type === m.type &&
      item.company === m.company &&
      item.lastDone === m.lastDone
  );

  const maintenanceId = `maintenance-${m.property}-${m.type}-${m.company}-${m.nextDue}`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");
const historyDates = Array.from(
  new Set([...(m.history || []), m.lastDone].filter(Boolean))
).reverse();
  return (
    <div className={`card ${m.status}`} id={maintenanceId} key={i}>
      <h3>{m.type}</h3>
      <p><b>{t.properties}:</b> {m.property}</p>
      <p><b>{t.company}:</b> {m.company}</p>
      <p><b>{t.lastDone}:</b> {m.lastDone}</p>
      <p><b>{t.nextDue}:</b> {m.nextDue}</p>
      <p><b>{t.status}:</b> {m.days < 0 ? `${Math.abs(m.days)} days overdue` : `in ${m.days} days`}</p>
{m.history && m.history.length > 0 && (
  <div className="historyBox">
    <p><b>{language === "en" ? "History" : "Verlauf"}:</b></p>

    {m.history
      .slice()
      .reverse()
      .map((date, index) => (
        <p key={index} className="historyDate">
          ✅ {date}
        </p>
      ))}
  </div>
)}
      <button className="primaryBtn" onClick={() => completeMaintenance(originalIndex)}>
        ✓ {t.complete}
      </button>

      <button onClick={() => editMaintenance(originalIndex)}>
        {t.edit}
      </button>

      <button className="dangerBtn" onClick={() => deleteMaintenance(originalIndex)}>
        {t.delete}
      </button>
    </div>
  );
};
 
  return (
    <div className="appShell">
      <div className="phone">
        <div
  className="header"
  style={{
    display: showHeader ? "block" : "none",
  }}
>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div>
    <p className="eyebrow">{t.appSubtitle}</p>
    <h1>MartiRent</h1>
  </div>

  <div
    style={{
      fontSize: "16px",
      fontWeight: "800",
      color: "white",
      textAlign: "right",
    }}
  >
    {todayText}
  </div>
</div>
        </div>

        <div className="content">
          
          {!selectedProperty && tab !== "calendar" && (
  <input
    className="search"
    placeholder={t.search}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
)}

          {appNotice && (
            <div className="card warning">
              <p>{appNotice}</p>
            </div>
          )}

          {tab === "home" && (
            <>
              <div className="sectionTop">
  <h2>{t.dashboard}</h2>

  <div style={{ textAlign: "right" }}>
    

    <button
      className="primaryBtn"
      onClick={() => setLanguage(language === "en" ? "de" : "en")}
    >
      🌐 {t.switchLanguage}
    </button>
  </div>
</div>
{search && (
  <>
<h3>{t.searchResults}</h3>
    <div className="card">
      <h3>{t.properties}</h3>
      {filteredProperties.length ? (
        filteredProperties.map((p, i) => (
          <p
            key={i}
            onClick={() => {
              setSelectedProperty(p);
              setSearch("");
setTab("properties");
            }}
            style={{ cursor: "pointer" }}
          >
            🏢 {p.name} — {p.address}
          </p>
        ))
      ) : (
        <p className="muted">{t.noPropertiesFound}</p>
      )}
    </div>

    <div className="card">
      <h3>{t.maintenance}</h3>
      {filteredItems.length ? (
        filteredItems.map((m, i) => (
          <p
            key={i}
           onClick={openMaintenanceTab}
            style={{ cursor: "pointer" }}
          >
            🔧 {m.property}: {m.type} — {m.company}
          </p>
        ))
      ) : (
        <p className="muted">{t.noMaintenanceFound}</p>
      )}
    </div>

    <div className="card">
      <h3>{t.contacts}</h3>
      {filteredContacts.length ? (
        filteredContacts.map((c, i) => (
          <p
            key={i}
            onClick={() => openTab("contacts")}
            style={{ cursor: "pointer" }}
          >
            📞 {c.company}
          </p>
        ))
      ) : (
        <p className="muted">{t.noContactsFound}</p>
      )}
    </div>

    <div className="card">
      <h3>{t.documents}</h3>
      {filteredDocuments.length ? (
        filteredDocuments.map((d, i) => (
          <p
            key={i}
            onClick={() => openTab("documents")}
            style={{ cursor: "pointer" }}
          >
            📄 {d.name} — {d.type}
          </p>
        ))
      ) : (
        <p className="muted">{t.noDocumentsFound}</p>
      )}
    </div>
  </>
)}


              <div className="heroCard">
                <h3>{t.welcome}</h3>
                <p>{t.description}</p>
              </div>

              {!notificationsEnabled && (
                <button className="primaryBtn fullBtn" onClick={enableNotifications}>
                  🔔 Enable Notifications
                </button>
              )}

              <div className="statsGrid statsGridTwo">
  <div
    className="statCard"
    onClick={() => setTab("properties")}
    style={{ cursor: "pointer" }}
  >
    <strong>{properties.length}</strong>
    <p>{t.properties}</p>
  </div>

  <div
    className="statCard"
    onClick={openMaintenanceTab}
    style={{ cursor: "pointer" }}
  >
    <strong>
      {maintenance.length}
      <span className="overdueSmall"> / {overdue.length}</span>
    </strong>
    <p>{t.maintenance}</p>
  </div>
</div>

              <h3>{t.needsAttention}</h3>

              <div className="card">
                {attentionItems.length === 0 ? (
                  <p className="muted">{t.everythingGood}</p>
                ) : (
                  attentionItems.map((m, i) => {
  const maintenanceId = `maintenance-${m.property}-${m.type}-${m.company}-${m.nextDue}`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  return (
    <button
      key={i}
      className="attentionBtn"
      onClick={() => {
        setSearch("");
        setHighlightMaintenance(maintenanceId);
        setTab("maintenance");
      }}
    >
      {m.status === "overdue" ? "🚨" : "⚠️"} {m.property}: {m.type}
    </button>
  );
})
                )}
              </div>

              <h3>{t.quickActions}</h3>

              <div className="quickGrid">
  <button onClick={() => openTab("properties")}>🏢 {t.properties}</button>
  <button onClick={openMaintenanceTab}>🔧 {t.maintenance}</button>
  <button onClick={() => openTab("calendar")}>📅 {t.calendar}</button>
  <button onClick={() => openTab("documents")}>📄 {t.documents}</button>
</div>

 <h3>{t.backup}</h3>

<div className="quickGrid">
  <button
  onClick={exportBackup}
  style={{
    color: "black",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  }}
>
  <span>💾</span>
  <span>{t.exportBackup}</span>
</button>

<button
  onClick={() => document.getElementById("backupInput").click()}
  style={{
    color: "black",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  }}
>
  <span>📂</span>
  <span>{t.restoreBackup}</span>
</button>

  <input
    id="backupInput"
    type="file"
    accept=".json"
    style={{ display: "none" }}
    onChange={importBackup}
  />
</div>
</>
          )}
          
          {tab === "properties" && (
              !selectedProperty ? (
                <>
                  <div className="sectionTop">
                    <h2>{t.properties}</h2>
                    <button className="primaryBtn" onClick={addProperty}>+ {t.add}</button>
                  </div>

                  {filteredProperties.map((p, i) => (
                    <div className="card" key={i}>
                      <h3>{p.name}</h3>
                      <p className="muted">{p.address}</p>
                      <button onClick={() => setSelectedProperty(p)}>{t.viewDetails}</button>
                      <button
  onClick={() =>
    editProperty(
      properties.findIndex(
        (property) =>
          property.name === p.name && property.address === p.address
      )
    )
  }
>
  {t.edit}
</button>

<button
  className="dangerBtn"
  onClick={() =>
    deleteProperty(
      properties.findIndex(
        (property) =>
          property.name === p.name && property.address === p.address
      )
    )
  }
>
  {t.delete}
</button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedProperty(null)}>← Back</button>
                  <h2>{selectedProperty.name}</h2>

                  <div className="card">
                    <h3>{t.propertyDetails}</h3>
                    <p><b>{t.address}:</b> {selectedProperty.address}</p>
                    <p><b>{t.maintenanceItems}:</b> {propertyMaintenance.length}</p>
                    <p><b>{t.linkedDocuments}:</b> {propertyDocuments.length}</p>
                  </div>

                  <h3>{t.maintenance}</h3>

                  {propertyMaintenance.length ? propertyMaintenance.map((m, i) => (
                    <div className={`card ${m.status}`} key={i}>
                      <h3>{m.type}</h3>
                      <p><b>{t.company}:</b> {m.company}</p>
                      <p><b>{t.lastDone}:</b> {m.lastDone}</p>
                      <p><b>{t.nextDue}:</b> {m.nextDue}</p>
                      <p><b>{t.status}:</b> {m.days < 0 ? `${Math.abs(m.days)} days overdue` : `in ${m.days} days`}</p>
                    </div>
                  )) : (
                    <p className="muted">{t.noMaintenance}</p>
                  )}
                  <h3>{t.notes}</h3>

{propertyNotesForSelected.length ? (
  propertyNotesForSelected.map((n, i) => (
    <div className="card" key={i}>
      <p><b>{t.unit}:</b> {n.unit}</p>
      <p><b>{t.date}:</b> {n.date}</p>
      <p>{language === "en" ? n.note : n.noteDe}</p>
    </div>
  ))
) : (
  <p className="muted">{t.noNotes}</p>
)}
                </>
              ))}

          {tab === "maintenance" && (
            <>
              <div className="sectionTop">
                <h2>{t.maintenance}</h2>
                <button className="primaryBtn" onClick={addMaintenance}>+ {t.add}</button>
              </div>

              {filteredItems.map(renderItem)}
            </>
          )}

          {tab === "calendar" && (
            <>
              <h2>{t.calendar}</h2>

              <div className="monthHeader">
                <button onClick={() => setCalendarOffset(calendarOffset - 12)}>«</button>
                <button onClick={() => setCalendarOffset(calendarOffset - 1)}>‹</button>
                <strong>{calendarDate.toLocaleString("default", { month: "long" })} {year}</strong>
                <button onClick={() => setCalendarOffset(calendarOffset + 1)}>›</button>
                <button onClick={() => setCalendarOffset(calendarOffset + 12)}>»</button>
              </div>

              <div className="calendarGridBig">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d} className="dayNameBig">{d}</div>
                ))}

                {calendar.map((day, i) => {
                  const date = formatDate(day);
                  const dayItems = items.filter((m) => m.nextDue === date);

                  return (
                    <div key={i} className="dayCellBig">
                      <div className="dayNumber">{day}</div>

                      {dayItems.map((m, j) => (
                        <div
  key={j}
  className="taskText"
  onClick={() => {
    const maintenanceId = `maintenance-${m.property}-${m.type}-${m.company}-${m.nextDue}`
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");

    setHighlightMaintenance(maintenanceId);
    setTab("maintenance");
  }}
  style={{ cursor: "pointer" }}
>
  {m.property}: {m.type}
</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "contacts" && (
  <>
    <div className="sectionTop">
      <h2>{t.contacts}</h2>
      <button className="primaryBtn" onClick={addContact}>
        + {t.add}
      </button>
    </div>

    {filteredContacts.map((c, i) => (
      <div className="card" key={i}>
        <h3>{c.company}</h3>
        <p><b>{t.phone}:</b> {c.phone || "-"}</p>
        <p><b>{t.email}:</b> {c.email || "-"}</p>
        <p><b>{t.website}:</b> {c.website || "-"}</p>

        <button onClick={() => editContact(i)}>
          {t.edit}
        </button>

        <button className="dangerBtn" onClick={() => deleteContact(i)}>
          {t.delete}
        </button>
      </div>
    ))}
  </>
)}

          {tab === "documents" && (
            <>
              <div className="sectionTop">
                <h2>{t.documents}</h2>
                <button className="primaryBtn" onClick={addDocument}>+ {t.add}</button>
              </div>

              {filteredDocuments.map((d, i) => (
                <div className="card" key={i}>
                  <h3>📄 {d.name}</h3>
                  <p className="muted">{d.type}</p>
                  <button className="dangerBtn" onClick={() => deleteDocument(i)}>{t.delete}</button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="nav navSix">
  <button className={tab === "home" ? "active" : ""} onClick={() => openTab("home")}>
    🏠<span>{t.home}</span>
  </button>

  <button className={tab === "properties" ? "active" : ""} onClick={() => openTab("properties")}>
    🏢<span>{t.props}</span>
  </button>

  <button className={tab === "maintenance" ? "active" : ""} onClick={openMaintenanceTab}>
    🔧<span>{t.maint}</span>
  </button>

  <button className={tab === "calendar" ? "active" : ""} onClick={() => openTab("calendar")}>
    📅<span>{t.calendar}</span>
  </button>

  <button className={tab === "contacts" ? "active" : ""} onClick={() => openTab("contacts")}>
    📞<span>{t.contacts}</span>
  </button>

  <button className={tab === "documents" ? "active" : ""} onClick={() => openTab("documents")}>
    📄<span>{t.documents}</span>
  </button>
</div>
      </div>
    </div>
  );
}