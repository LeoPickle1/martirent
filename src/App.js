import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";
import { importedContacts } from "./contactsData";
const maintenanceExtraNotes = {
  "Sempach|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle am 10.10.2024 durch Elektro-Team Eich. SiNa Bericht pendent.",
    en: "SiNa: Periodic electrical inspection on 10 Oct 2024 by Elektro-Team Eich. SiNa report pending.",
  },

  "Langnau|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle alle 5 Jahre. Letzte Kontrolle 26.07.2025 durch MegaOhm.",
    en: "SiNa: Periodic electrical inspection every 5 years. Last inspection on 26 Jul 2025 by MegaOhm.",
  },
  "Langnau|FUEKO": {
    de: "FEUKO: Alle 2 Jahre. Kaminfeger Hiltbrunner, letzte Kontrolle 10.03.2025.",
    en: "FEUKO: Every 2 years. Chimney sweep Hiltbrunner, last inspection on 10 Mar 2025.",
  },
  "Langnau|Fire Extinguisher": {
    de: "Feuerlöscher: Jährlich durch Jomos. Letzte Kontrolle 07.05.2024. Mieter organisiert und bezahlt die Kontrollen. Kopien der Rapporte gehen an Marti.",
    en: "Fire extinguisher: Yearly by Jomos. Last inspection on 7 May 2024. Tenant organizes and pays for the inspections. Copies of reports go to Marti.",
  },
  "Langnau|Chimney Sweep": {
    de: "Kaminfeger: Jährlich durch Kaminfeger Hiltbrunner. Letzte Kontrolle 14.05.2025. Haus hat Cheminee, Kaminfeger fragen.",
    en: "Chimney sweep: Yearly by chimney sweep Hiltbrunner. Last inspection on 14 May 2025. House has a fireplace, ask chimney sweep.",
  },
  "Langnau|Tank Inspection": {
    de: "Tankrevision: Tank fällig 27.02.2026.",
    en: "Tank inspection: Tank due on 27 Feb 2026.",
  },
  "Langnau|Tank Leak Indicator": {
    de: "Leckanzeige: Fällig 27.02.2026. Intervall 2 Jahre.",
    en: "Leak indicator: Due on 27 Feb 2026. Interval 2 years.",
  },
  "Langnau|Heating Service": {
    de: "Heizung: Öl, 17 kW. Brenner Oertli 2015, Kessel Six Madun 1994. Jährlicher Service durch Meier-Tobler, letzter Service 17.02.2026.",
    en: "Heating: Oil, 17 kW. Burner Oertli 2015, boiler Six Madun 1994. Yearly service by Meier-Tobler, last service on 17 Feb 2026.",
  },

  "Hilterfingen|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle 16.11.2009 durch EM Electrocontrol AG. Schlusskontrolle 14.05.2019 durch EM Electrocontrol AG. Zahlenkombination: PLZ Hilterfingen 3652.",
    en: "SiNa: Periodic inspection on 16 Nov 2009 by EM Electrocontrol AG. Final inspection on 14 May 2019 by EM Electrocontrol AG. Code: Hilterfingen ZIP code 3652.",
  },
  "Hilterfingen|Heat Pump Check": {
    de: "Wärmepumpe: Liebi Swiss, 2018. Installation durch Frutiger-Zbinden. Bodenheizung in allen Wohnungen. Magnetabscheider eingebaut.",
    en: "Heat pump: Liebi Swiss, 2018. Installed by Frutiger-Zbinden. Floor heating in all apartments. Magnet separator installed.",
  },
  "Hilterfingen|Magnet Separator Cleaning": {
    de: "Magnetabscheider reinigen und Wasser auffüllen. Bis 2025 nie gemacht. Jährlich durch FZAG. 05.12.2025 gemacht, nächster Termin mit FZAG für Sep. 2026 geplant.",
    en: "Clean magnet separator and refill water. Never done before 2025. Yearly by FZAG. Done on 5 Dec 2025, next appointment planned with FZAG for Sep 2026.",
  },
  "Hilterfingen|Floor Heating Flush": {
    de: "Bodenheizung spülen: Alle 6–7 Jahre. Geplant 26.06.2026 durch Frutiger-Zbinden.",
    en: "Flush floor heating: Every 6–7 years. Planned for 26 Jun 2026 by Frutiger-Zbinden.",
  },
  "Hilterfingen|Boiler Descaling": {
    de: "Warmwasser: Individuell in jeder Wohnung. Letzte Entkalkung 18.03.2018. Geplant 26.06.2028. Loosli gefragt 11.2025.",
    en: "Hot water: Individual in each apartment. Last descaling on 18 Mar 2018. Planned for 26 Jun 2028. Loosli asked in Nov 2025.",
  },
  "Hilterfingen|Garden": {
    de: "Garten: 2x Herbst und 1x Frühling. 2025-10 erledigt. Gesamter Garten inkl. Bäume entfernen: 12.02.2025.",
    en: "Garden: Twice in autumn and once in spring. Done in Oct 2025. Entire garden including tree removal: 12 Feb 2025.",
  },
  "Hilterfingen|Drain Tile": {
    de: "Sickerleitung: Alle 5–8 Jahre. Letzte Kontrolle 14.03.2025.",
    en: "Drain tile: Every 5–8 years. Last inspection on 14 Mar 2025.",
  },
  "Hilterfingen|Gravity Lines (Sewer)": {
    de: "Grundleitungen/Schmutzwasser: 5 Jahre. Letzte Kontrolle 14.03.2025.",
    en: "Main sewer/wastewater lines: 5 years. Last inspection on 14 Mar 2025.",
  },

  "Aeschlen|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle alle 5 Jahre. Letzte Kontrolle 10.08.2025 durch Megaohm.",
    en: "SiNa: Periodic electrical inspection every 5 years. Last inspection on 10 Aug 2025 by Megaohm.",
  },
  "Aeschlen|FUEKO": {
    de: "FEUKO: Alle 2 Jahre. Markus Joss, eventuell neu Hirschi. Letzte Kontrolle 18.03.2025.",
    en: "FEUKO: Every 2 years. Markus Joss, possibly Hirschi in future. Last inspection on 18 Mar 2025.",
  },
  "Aeschlen|Chimney Sweep": {
    de: "Kaminfeger: Jährlich durch Hirschi Kaminfeger. Letzte Kontrolle 24.04.2025.",
    en: "Chimney sweep: Yearly by Hirschi chimney sweep. Last inspection on 24 Apr 2025.",
  },
  "Aeschlen|Tank Inspection": {
    de: "Tankrevision: Letzte Revision 07.05.2022 durch Migrol AG Zürich.",
    en: "Tank inspection: Last inspection on 7 May 2022 by Migrol AG Zurich.",
  },
  "Aeschlen|Heating Service": {
    de: "Heizung: Öl, 22 kW. Brenner Six Madun 2016, Kessel Six Madun 1997. Jährlich durch Meier-Tobler, letzter Service 10.12.2024.",
    en: "Heating: Oil, 22 kW. Burner Six Madun 2016, boiler Six Madun 1997. Yearly by Meier-Tobler, last service on 10 Dec 2024.",
  },
  "Aeschlen|Garden": {
    de: "Garten: Macht der Mieter, aber Sträucher und Bäume müssen ca. alle 3 Jahre geschnitten werden.",
    en: "Garden: Tenant handles it, but shrubs and trees must be cut about every 3 years.",
  },
  "Aeschlen|Fire Extinguisher": {
    de: "Feuerlöscher: Letzte Kontrolle 04.10.2024 durch Primus. Nigg nach Dokumenten gefragt / in Unterhalt gelistet.",
    en: "Fire extinguisher: Last inspection on 4 Oct 2024 by Primus. Nigg asked for documents / listed in maintenance.",
  },

  "Traube|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle 25.06.2008. Letzte PK gemäss Primeo 2010. Nächste Kontrolle 2030. Heizmann fand es nicht im System.",
    en: "SiNa: Periodic inspection on 25 Jun 2008. Last periodic inspection according to Primeo was 2010. Next inspection 2030. Heizmann did not find it in the system.",
  },
  "Traube|FUEKO": {
    de: "FEUKO: Schlusskontrolle 22.12.2016 durch ESH / Heizman Elektro Controlling.",
    en: "FEUKO: Final inspection on 22 Dec 2016 by ESH / Heizman Elektro Controlling.",
  },
  "Traube|Fire Extinguisher": {
    de: "Feuerlöscher: Jährlich durch Primus. Letzte Kontrolle 04.10.2024. 2025 noch mit MIKO abklären.",
    en: "Fire extinguisher: Yearly by Primus. Last inspection on 4 Oct 2024. 2025 still needs follow-up with MIKO.",
  },
  "Traube|Chimney Sweep": {
    de: "Kaminfeger: 11.09.2024 durch Fürst Kaminfeger.",
    en: "Chimney sweep: 11 Sep 2024 by Fürst chimney sweep.",
  },
  "Traube|Tank Inspection": {
    de: "Tankrevision: Letzte Revision 26.10.2023 durch Suter Joerin.",
    en: "Tank inspection: Last inspection on 26 Oct 2023 by Suter Joerin.",
  },
  "Traube|Heating Service": {
    de: "Heizung: Öl, 34 kW. Brenner ELCO VE1.34 2020, Kessel Cuenod Unon 2-34, 2003. Jährlich durch ELCO, letzter Service 02.09.2024.",
    en: "Heating: Oil, 34 kW. Burner ELCO VE1.34 2020, boiler Cuenod Unon 2-34, 2003. Yearly by ELCO, last service on 2 Sep 2024.",
  },
  "Traube|Boiler Descaling": {
    de: "Boiler: Daniel Meier Juni 2025: 2 Boiler. Kleiner Boiler in der Heizung speist den grossen Elektroboiler. Nie entkalkt. A. Borer Alexander beauftragen.",
    en: "Boiler: Daniel Meier June 2025: 2 boilers. Small boiler in heating system feeds the large electric boiler. Never descaled. Assign A. Borer Alexander.",
  },
  "Traube|Drain Tile": {
    de: "Sickerleitung: Schacht zwischen Haus und Berg. Prüfen, ob dort eine Sickerleitung existiert.",
    en: "Drain tile: Shaft between house and hill. Check whether a drain tile exists there.",
  },

  "Kundmatt|SiNa Inspection": {
    de: "SiNa: Letzte PK 25.06.2008. Heizmann Elektro Controlling. Schlusskontrolle 30.09.2015 durch Nowecom. Weitere SK 26.01.2024 durch Hasler + Reinle AG.",
    en: "SiNa: Last periodic inspection on 25 Jun 2008. Heizmann Elektro Controlling. Final inspection on 30 Sep 2015 by Nowecom. Additional final inspection on 26 Jan 2024 by Hasler + Reinle AG.",
  },
  "Kundmatt|Boiler Descaling": {
    de: "Boiler: Hat Boiler, letztes Mal vor 2022. Muss 2025 gemacht werden.",
    en: "Boiler: Has boiler, last done before 2022. Must be done in 2025.",
  },
  "Kundmatt|Drain Tile": {
    de: "Sickerleitung: Keine Sickerleitung. Keine Probleme gemäss Email Spiess 02.06.2025.",
    en: "Drain tile: No drain tile. No problems according to Spiess email on 2 Jun 2025.",
  },
  "Kundmatt|Garden": {
    de: "Garten/Nussbaum: Alle 2 Jahre. 2025-03 zurückgeschnitten und Totholz entfernt. Schnittstellen bis 2 cm überwachsen problemlos, grössere Schnittstellen faulen.",
    en: "Garden/walnut tree: Every 2 years. Cut back in Mar 2025 and dead wood removed. Cuts up to 2 cm heal well, larger cuts rot.",
  },
  "Kundmatt|Heating Service": {
    de: "Heizung: IR Panel. Info zur Heizung von Frau Spiess am 09.03.2025.",
    en: "Heating: IR panel. Heating information from Mrs. Spiess on 9 Mar 2025.",
  },

  "Grenchen|SiNa Inspection": {
    de: "SiNa: 20 Jahre. Letzte Kontrolle 20.07.2025 durch Alpha Control.",
    en: "SiNa: 20 years. Last inspection on 20 Jul 2025 by Alpha Control.",
  },
  "Grenchen|Chimney Sweep": {
    de: "Kaminfeger: 07.10.2024 durch Felix Weber. Schwedenofen. Kaminfeger fragen.",
    en: "Chimney sweep: 7 Oct 2024 by Felix Weber. Swedish stove. Ask chimney sweep.",
  },
  "Grenchen|Heating Service": {
    de: "Heizung: Holz / IR Panel.",
    en: "Heating: Wood / infrared panels.",
  },
  "Grenchen|Boiler Descaling OG": {
    de: "OG Boiler: Selbes Modell wie im UG. Alle 4–5 Jahre, erstes Mal nach 4 Jahren. Installiert 21.11.2024.",
    en: "Upper-floor boiler: Same model as basement. Every 4–5 years, first time after 4 years. Installed on 21 Nov 2024.",
  },
  "Grenchen|Boiler Descaling": {
    de: "UG Boiler: Alle 5 Jahre. Zuletzt 11.01.2024.",
    en: "Basement boiler: Every 5 years. Last done on 11 Jan 2024.",
  },
  "Grenchen|Drain Tile": {
    de: "Sickerleitung: Hat keine Sickerleitung. Keine Probleme gemäss Dellsperger vor Ort am 26.05.2025.",
    en: "Drain tile: No drain tile. No problems according to Dellsperger on-site visit on 26 May 2025.",
  },
  "Grenchen|Garden": {
    de: "Garten: Macht der Mieter. Linde alle 2 Jahre schneiden. Letzter Termin 17.02.2026. Check in 2028 gemäss Email Mosimann 19.02.2026.",
    en: "Garden: Tenant handles it. Linden tree to be cut every 2 years. Last appointment 17 Feb 2026. Check in 2028 according to Mosimann email on 19 Feb 2026.",
  },
  "Grenchen|Water Pump Filter": {
    de: "Wasserpumpe: Filter periodisch reinigen. Macht der Mieter.",
    en: "Water pump: Clean filter periodically. Tenant handles it.",
  },

  "Eich|SiNa Inspection": {
    de: "SiNa: Periodische Kontrolle 23.11.2010, 20 Jahre. Ausbau PV-Anlage: 06.02.2025 durch Sicuro.",
    en: "SiNa: Periodic inspection on 23 Nov 2010, 20 years. PV system expansion: 6 Feb 2025 by Sicuro.",
  },
  "Eich|FUEKO": {
    de: "FEUKO: Alle 2 Jahre, Lukas Stirnimann. Letzter Eintrag 18.06.2025.",
    en: "FEUKO: Every 2 years, Lukas Stirnimann. Last entry 18 Jun 2025.",
  },
  "Eich|Chimney Sweep": {
    de: "Kaminfeger: 01.07.2021 durch Lukas Stirnimann. 2025 geplant für 18. Juni.",
    en: "Chimney sweep: 1 Jul 2021 by Lukas Stirnimann. Planned for 18 June 2025.",
  },
  "Eich|Heat Pump Check": {
    de: "Wärmepumpe: Stiebel-Eltron 2020. Installation durch GT Estermann. Servicevertrag 590 CHF/Jahr. Laut Estermann Techniker Daniel Zumbühl gibt es keine Verschleissteile. Bei Ausfall kann auf Notbetrieb mit Strom umgestellt werden.",
    en: "Heat pump: Stiebel-Eltron 2020. Installed by GT Estermann. Service contract CHF 590/year. According to Estermann technician Daniel Zumbühl, there are no wear parts. In case of failure, it can be switched to emergency electric operation.",
  },
  "Eich|Boiler Descaling": {
    de: "Boiler: Kombiboiler für Heizung und Warmwasser. Boiler alle 5 Jahre. Am 13.04.2026 gemacht.",
    en: "Boiler: Combined boiler for heating and hot water. Boiler every 5 years. Done on 13 Apr 2026.",
  },
  "Eich|Magnet Separator Cleaning": {
    de: "Magnetabscheider: Neu 2022. Letzter Eintrag 05.09.2025. Letztes Spülen unklar.",
    en: "Magnet separator: New in 2022. Last entry 5 Sep 2025. Last flushing unclear.",
  },
  "Eich|Garden": {
    de: "Herbst-Checkliste: Wasser im Garten und Schopf abstellen, Geranien schneiden und in Bastelraum stellen, Fässer leeren, Vorhänge Terrasse in Tankraum, Holz bestellen, Wohnmobil einpacken, Nummern abgeben, WC-Türe offen lassen und Trocknungsgerät installieren.",
    en: "Autumn checklist: Turn off water in garden and shed, cut geraniums and place in hobby room, empty barrels, store terrace curtains in tank room, order wood, pack camper van, return plates, leave toilet door open and install dehumidifier.",
  },
};
export default function App() {
 
  const [tab, setTab] = useState("home");
  const maintenanceTypes = [
  "Ash Inspection",
  "Chimney Sweep",
  "Furnace Inspection",
  "Heating Service",
  "Fire Extinguisher",
  "Garden",
  "FUEKO",
  "Roof Inspection",
  "SiNa Inspection",
  "Tank Inspection",
  "Boiler",
  "Heat Pump Check",
  "Boiler Descaling OG",
  "Drain Tile",
  "Floor Heating Flush",
  "Gravity Lines (Sewer)",
  "Gutter and Downspout",
  "Magnet Separator Cleaning",
  "Tank Leak Indicator",
  "Boiler Descaling",
].sort();
const maintenanceTypeNamesDe = {
  "Ash Inspection": "Aschekontrolle",
  "Boiler": "Boiler",
  "Boiler Descaling": "Boiler entkalken",
  "Boiler Descaling OG": "Boiler entkalken OG",
  "Chimney Sweep": "Kaminfeger",
  "Drain Tile": "Sickerleitung",
  "Fire Extinguisher": "Feuerlöscher",
  "Floor Heating Flush": "Bodenheizung spülen",
  "FUEKO": "FEUKO",
  "Furnace Inspection": "Heizungsprüfung",
  "Garden": "Garten",
  "Gravity Lines (Sewer)": "Abwasserleitungen",
  "Gutter and Downspout": "Dachrinne und Fallrohr",
  "Heat Pump Check": "Wärmepumpen-Kontrolle",
  "Heating Service": "Heizungsservice",
  "Magnet Separator Cleaning": "Magnetabscheider reinigen",
  "Roof Inspection": "Dachkontrolle",
  "SiNa Inspection": "SiNa-Kontrolle",
  "Tank Inspection": "Tankprüfung",
  "Tank Leak Indicator": "Tank-Leckanzeige",
};

const getMaintenanceTypeName = (type) => {
  if (language === "de") {
    return maintenanceTypeNamesDe[type] || type;
  }

  return type;
};
  const [offlineNotice, setOfflineNotice] = useState(false);
  const [search, setSearch] = useState("");
  const [maintenanceFilter, setMaintenanceFilter] = useState("all");
  const [maintenanceFormOpen, setMaintenanceFormOpen] = useState(false);
const [editingMaintenanceIndex, setEditingMaintenanceIndex] = useState(null);
const [maintenanceForm, setMaintenanceForm] = useState({
  property: "",
  type: "",
  company: "",
  lastDone: "",
  intervalYears: "",
  warningDays: "",
  sendEmail: false,
  notesEn: "",
  notesDe: "",
  historyText: "",
});
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
const [editingPropertyIndex, setEditingPropertyIndex] = useState(null);
const [propertyForm, setPropertyForm] = useState({
  name: "",
  address: "",
});

  const [contactFormOpen, setContactFormOpen] = useState(false);
const [editingContactIndex, setEditingContactIndex] = useState(null);
const [contactForm, setContactForm] = useState({
  company: "",
  phone: "",
  email: "",
  website: "",
});
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [appNotice, setAppNotice] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [highlightMaintenance, setHighlightMaintenance] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [language, setLanguage] = useState("en");
const [hasLoadedBackend, setHasLoadedBackend] = useState(false);
const [hasLoadedPropertiesBackend, setHasLoadedPropertiesBackend] = useState(false);

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
  const savedContacts = saved ? JSON.parse(saved) : [];

  const allContacts = [...savedContacts, ...importedContacts];
  const seen = new Set();

  return allContacts.filter((contact) => {
    const key = `${contact.company || ""}|${contact.person || ""}|${contact.email || ""}|${contact.phone || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
      console.log("Loaded maintenance from backend:", data);

      if (Array.isArray(data) && data.length > 0) {
        setMaintenance(data);
        localStorage.setItem("maintenanceAlerts", JSON.stringify(data));
      }

      setHasLoadedBackend(true);
    })
    .catch((error) => {
      console.error("Backend load failed:", error);
      setHasLoadedBackend(true);
    });
}, []);


useEffect(() => {
  const loadContactsFromBackend = () => {
    fetch("https://martirent-backend-production.up.railway.app/contacts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded contacts from backend:", data);

        if (Array.isArray(data) && data.length > 0) {
          setContacts(data);
          localStorage.setItem("savedContacts", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Contacts backend load failed:", error);
      });
  };

  loadContactsFromBackend();

  const interval = setInterval(loadContactsFromBackend, 10000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const loadPropertiesFromBackend = () => {
    fetch("https://martirent-backend-production.up.railway.app/properties")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded properties from backend:", data);

        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
          localStorage.setItem("properties", JSON.stringify(data));
        }

        setHasLoadedPropertiesBackend(true);
      })
      .catch((error) => {
        console.error("Properties backend load failed:", error);
        setHasLoadedPropertiesBackend(true);
      });
  };

  loadPropertiesFromBackend();

  const interval = setInterval(loadPropertiesFromBackend, 10000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  if (!hasLoadedBackend) return;

  // Do not let an empty phone/app wipe the database
  if (!Array.isArray(maintenance) || maintenance.length === 0) {
    console.log("Skipped backend sync because maintenance is empty");
    return;
  }

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

useEffect(() => {
  if (!hasLoadedBackend) return;

  if (!Array.isArray(contacts) || contacts.length === 0) {
    console.log("Skipped contacts sync because contacts is empty");
    return;
  }

  fetch("https://martirent-backend-production.up.railway.app/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contacts),
  }).catch((error) => {
    console.error("Contacts backend sync failed:", error);
  });
}, [contacts, hasLoadedBackend]);

useEffect(() => {
  if (!hasLoadedPropertiesBackend) return;

  if (!Array.isArray(properties) || properties.length === 0) {
    console.log("Skipped properties sync because properties is empty");
    return;
  }

  fetch("https://martirent-backend-production.up.railway.app/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(properties),
  }).catch((error) => {
    console.error("Properties backend sync failed:", error);
  });
}, [properties, hasLoadedPropertiesBackend]);
  useEffect(() => localStorage.setItem("documents", JSON.stringify(documents)), [documents]);
  useEffect(() => {
  if (!hasLoadedBackend) return;

  setMaintenance((current) =>
    current.map((item) => {
      const extra = maintenanceExtraNotes[`${item.property}|${item.type}`];

      if (!extra) return item;

      return {
        ...item,
        notesEn: item.notesEn || extra.en,
        notesDe: item.notesDe || extra.de,
      };
    })
  );
}, [hasLoadedBackend]);
  useEffect(() => localStorage.setItem("contacts", JSON.stringify(contacts)), [contacts]);
  

 useEffect(() => {
  if (!navigator.onLine) {
    setOfflineNotice(true);

    setTimeout(() => {
      setOfflineNotice(false);
    }, 2000);
  }

  const handleOffline = () => {
    setOfflineNotice(true);

    setTimeout(() => {
      setOfflineNotice(false);
    }, 2000);
  };

  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("offline", handleOffline);
  };
}, []);
useEffect(() => {
  if (!navigator.onLine) {
    setOfflineNotice(true);

    setTimeout(() => {
      setOfflineNotice(false);
    }, 2000);
  }

  const handleOffline = () => {
    setOfflineNotice(true);

    setTimeout(() => {
      setOfflineNotice(false);
    }, 2000);
  };

  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("offline", handleOffline);
  };
}, []);
  useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  }
}, []);
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
const formatDateDisplay = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString + "T00:00:00");

  if (Number.isNaN(date.getTime())) return dateString;

  const locale = language === "de" ? "de-CH" : "en-GB";

  return date
    .toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "")
    .replace(/ /g, "-");
};
  const addYears = (date, years) => {
  const d = new Date(date + "T00:00:00");

  const interval = Number(years);
  if (Number.isNaN(interval)) return date;

  const monthsToAdd = Math.round(interval * 12);

  d.setMonth(d.getMonth() + monthsToAdd);

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
  const findCompanyContact = (companyName) => {
  if (!companyName) return null;

  const companyNameLower = companyName.toLowerCase();

  return contacts.find((contact) => {
    const contactCompany = (contact.company || "").toLowerCase();

    return (
      contactCompany.includes(companyNameLower) ||
      companyNameLower.includes(contactCompany)
    );
  });
};
  const findCompanyEmail = (companyName) => {
  if (!companyName) return "";

  const companyNameLower = companyName.toLowerCase();

  const match = contacts.find((contact) => {
    const contactCompany = (contact.company || "").toLowerCase();

    return (
      contactCompany.includes(companyNameLower) ||
      companyNameLower.includes(contactCompany)
    );
  });

  if (!match || !match.email) return "";

  return match.email.split(" / ")[0];
};
const sendReminderEmail = async (
  toEmail,
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
        to_email: toEmail,
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
  if (!item.sendEmail) return;
  if (!reminderDays.includes(item.days)) return;

  const companyEmail = findCompanyEmail(item.company);
  if (!companyEmail) return;

    const emailId = `${item.property}-${item.type}-${item.nextDue}-${item.days}`;

    const sentEmails = JSON.parse(
      localStorage.getItem("sentReminderEmails") || "[]"
    );

    if (sentEmails.includes(emailId)) return;

    sendReminderEmail(
  companyEmail,
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
  const attentionItems = overdue
  .sort((a, b) => a.days - b.days)
  .slice(0, 5);

  const allAttentionItems = [...overdue, ...dueSoon].sort((a, b) => a.days - b.days);
  const maintenancePageItems = filteredItems.filter((m) => {
  if (maintenanceFilter === "all") return true;
  if (maintenanceFilter === "overdue") return m.status === "overdue";
  if (maintenanceFilter === "dueSoon") return m.status === "warning";
  if (maintenanceFilter === "future") return m.status === "future";
  return true;
});
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

  const addProperty = () => {
  setEditingPropertyIndex(null);
  setPropertyForm({
    name: "",
    address: "",
  });
  setPropertyFormOpen(true);
};

  const editProperty = (index) => {
  const current = properties[index];

  setEditingPropertyIndex(index);
  setPropertyForm({
    name: current.name || "",
    address: current.address || "",
  });
  setPropertyFormOpen(true);
};
const savePropertyForm = () => {
  if (!propertyForm.name || !propertyForm.address) return;

  if (editingPropertyIndex === null) {
    setProperties((prev) => [...prev, propertyForm]);
  } else {
    const updated = [...properties];
    updated[editingPropertyIndex] = propertyForm;
    setProperties(updated);
  }

  setPropertyFormOpen(false);
  setEditingPropertyIndex(null);
  setPropertyForm({
    name: "",
    address: "",
  });
};

const cancelPropertyForm = () => {
  setPropertyFormOpen(false);
  setEditingPropertyIndex(null);
  setPropertyForm({
    name: "",
    address: "",
  });
};
  const deleteProperty = (index) => {
  const confirmDelete = window.confirm(t.deletePropertyConfirm);
  if (!confirmDelete) return;

  setProperties((prev) => prev.filter((_, i) => i !== index));
};

const addMaintenance = () => {
  setEditingMaintenanceIndex(null);

  setMaintenanceForm({
    property: "",
    type: "",
    company: "",
    lastDone: "",
    intervalYears: "",
    warningDays: "",
    notesEn: "",
    notesDe: "",
    historyText: "",
    sendEmail: false,
  });

  setMaintenanceFormOpen(true);
};
const editMaintenance = (index) => {
  const current = maintenance[index];

  setEditingMaintenanceIndex(index);
 const historyDates = Array.from(
  new Set([...(current.history || []), current.lastDone].filter(Boolean))
);

setMaintenanceForm({
  property: current.property || "",
  type: current.type || "",
  company: current.company || "",
  lastDone: current.lastDone || "",
  intervalYears: current.intervalYears || "",
  warningDays: current.warningDays || "",
  sendEmail: current.sendEmail || false,
  notesEn: current.notesEn || "",
  notesDe: current.notesDe || current.notes || "",
  historyText: historyDates.join("\n"),
});
  setMaintenanceFormOpen(true);
};
const saveMaintenanceForm = () => {
  if (
    !maintenanceForm.property ||
    !maintenanceForm.type ||
    !maintenanceForm.company ||
    !maintenanceForm.lastDone ||
    !maintenanceForm.intervalYears ||
    !maintenanceForm.warningDays
  ) {
    return;
  }

 const history = maintenanceForm.historyText
  .split("\n")
  .map((date) => date.trim())
  .filter(Boolean);

const savedMaintenance = {
  property: maintenanceForm.property,
  type: maintenanceForm.type,
  company: maintenanceForm.company,
  lastDone: maintenanceForm.lastDone,
  intervalYears: maintenanceForm.intervalYears,
  warningDays: maintenanceForm.warningDays,
  sendEmail: maintenanceForm.sendEmail,
  notesEn: maintenanceForm.notesEn,
  notesDe: maintenanceForm.notesDe,
  history,
};

if (editingMaintenanceIndex === null) {
  setMaintenance((prev) => [...prev, savedMaintenance]);
} else {
  const updated = [...maintenance];

  updated[editingMaintenanceIndex] = {
    ...updated[editingMaintenanceIndex],
    ...savedMaintenance,
  };

  setMaintenance(updated);
}

  setMaintenanceFormOpen(false);
  setEditingMaintenanceIndex(null);
  setMaintenanceForm({
  property: "",
  type: "",
  company: "",
  lastDone: "",
  intervalYears: "",
  warningDays: "",
  sendEmail: false,
  notesEn: "",
notesDe: "",
  historyText: "",
});
};

const cancelMaintenanceForm = () => {
  setMaintenanceFormOpen(false);
  setEditingMaintenanceIndex(null);
  setMaintenanceForm({
  property: "",
  type: "",
  company: "",
  lastDone: "",
  intervalYears: "",
  warningDays: "",
  sendEmail: false,
  notesEn: "",
notesDe: "",
  historyText: "",
});
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


 

 
  

  const addContact = () => {
  setEditingContactIndex(null);
  setContactForm({
    company: "",
    phone: "",
    email: "",
    website: "",
  });
  setContactFormOpen(true);
};
  const editContact = (index) => {
  const current = contacts[index];

  setEditingContactIndex(index);
  setContactForm({
    company: current.company || "",
    phone: current.phone || "",
    email: current.email || "",
    website: current.website || "",
  });
  setContactFormOpen(true);
};
const saveContactForm = () => {
  if (!contactForm.company) return;

  if (editingContactIndex === null) {
    setContacts((prev) => [...prev, contactForm]);
  } else {
    const updated = [...contacts];
    updated[editingContactIndex] = contactForm;
    setContacts(updated);
  }

  setContactFormOpen(false);
  setEditingContactIndex(null);
  setContactForm({
    company: "",
    phone: "",
    email: "",
    website: "",
  });
};

const cancelContactForm = () => {
  setContactFormOpen(false);
  setEditingContactIndex(null);
  setContactForm({
    company: "",
    phone: "",
    email: "",
    website: "",
  });
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
const safeIndex = originalIndex === -1 ? i : originalIndex;
  const maintenanceId = `maintenance-${m.property}-${m.type}-${m.company}-${m.nextDue}`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");
const historyDates = Array.from(
  new Set([...(m.history || []), m.lastDone].filter(Boolean))
).reverse();
const companyContact = findCompanyContact(m.company);
  return (
    <div className={`card ${m.status}`} id={maintenanceId} key={i}>
      <h3>{getMaintenanceTypeName(m.type)}</h3>
      <p><b>{t.properties}:</b> {m.property}</p>
      <p><b>{t.company}:</b> {m.company}</p>
      {companyContact &&
        (companyContact.phone || companyContact.email || companyContact.website) && (
          <div className="contactMiniBox">
            {companyContact.phone && (
              <p><b>{t.phone}:</b> {companyContact.phone}</p>
            )}

            {companyContact.email && (
              <p><b>{t.email}:</b> {companyContact.email}</p>
            )}

            {companyContact.website && (
              <p><b>{t.website}:</b> {companyContact.website}</p>
            )}
          </div>
        )}
      <>
        <p><b>{t.lastDone}:</b> {formatDateDisplay(m.lastDone)}</p>
        <p><b>{t.nextDue}:</b> {formatDateDisplay(m.nextDue)}</p>
        <p><b>{t.status}:</b> {m.days < 0 ? `${Math.abs(m.days)} days overdue` : `in ${m.days} days`}</p>
      </>
      
      {(language === "en" ? m.notesEn : m.notesDe || m.notes) && (
  <div className="historyBox">
    <p><b>{language === "en" ? "Notes" : "Notizen"}:</b></p>
    <p className="historyDate">
      {language === "en" ? m.notesEn : m.notesDe || m.notes}
    </p>
  </div>
)}
{m.history && m.history.length > 0 && (
  <div className="historyBox">
    <p><b>{language === "en" ? "History" : "Verlauf"}:</b></p>

    {m.history
      .slice()
      .reverse()
      .map((date, index) => (
        <p key={index} className="historyDate">
          ✅ {formatDateDisplay(date)}
        </p>
      ))}
  </div>
)}
<button className="primaryBtn" onClick={() => completeMaintenance(safeIndex)}>        ✓ {t.complete}
      </button>
      {tab === "maintenance" && (
  <>
    <button onClick={() => editMaintenance(safeIndex)}>
      {t.edit}
    </button>

    <button className="dangerBtn" onClick={() => deleteMaintenance(safeIndex)}>
      {t.delete}
    </button>
  </>
)}
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
    <div className="logoTitle">
  <h1>MartiRent</h1>
</div>
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
{offlineNotice && (
  <div className="offlineNotice">
    {language === "en" ? "You are offline" : "Du bist offline"}
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
{search ? (
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
  onClick={() => {
    const maintenanceId = `maintenance-${m.property}-${m.type}-${m.company}-${m.nextDue}`
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");

    setHighlightMaintenance(maintenanceId);
    setSearch("");
    setTab("maintenance");
  }}
  style={{ cursor: "pointer" }}
>
  🔧 {m.property}: {getMaintenanceTypeName(m.type)} — {m.company}
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
         onClick={() => {
  setSearch("");
  openTab("contacts");
}}
            style={{ cursor: "pointer" }}
          >
            📞 {c.company}
          </p>
        ))
      ) : (
        <p className="muted">{t.noContactsFound}</p>
      )}
    </div>

    
  </>
) : (
  <>


              <div className="heroCard">
                <h3>{t.welcome}</h3>
                <p>{t.description}</p>
              </div>

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

             

              

              <h3>{t.quickActions}</h3>

              <div className="quickGrid">
  <button onClick={() => openTab("properties")}>🏢 {t.properties}</button>
  <button onClick={openMaintenanceTab}>🔧 {t.maintenance}</button>
  <button onClick={() => openTab("calendar")}>📅 {t.calendar}</button>
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
</>
          )}
          
          {tab === "properties" && (
              !selectedProperty ? (
                <>
                  <div className="sectionTop">
                    <h2>{t.properties}</h2>
                    <button className="primaryBtn" onClick={addProperty}>+ {t.add}</button>
                  </div>
{propertyFormOpen && (
  <>
    <div className="formOverlay" onClick={cancelPropertyForm}></div>
    <div className="card formCard">
    <h3>
      {editingPropertyIndex === null ? `+ ${t.add}` : t.edit} {t.properties}
    </h3>

    <label>{t.properties}</label>
    <input
      className="formInput"
      value={propertyForm.name}
      onChange={(e) =>
        setPropertyForm({
          ...propertyForm,
          name: e.target.value,
        })
      }
      placeholder={t.propertyNameQuestion}
    />

    <label>{t.address}</label>
    <input
      className="formInput"
      value={propertyForm.address}
      onChange={(e) =>
        setPropertyForm({
          ...propertyForm,
          address: e.target.value,
        })
      }
      placeholder={t.addressQuestion}
    />

    <div className="formButtons">
      <button className="primaryBtn" onClick={savePropertyForm}>
        {editingPropertyIndex === null ? t.add : t.edit}
      </button>

      <button onClick={cancelPropertyForm}>
        {language === "en" ? "Cancel" : "Abbrechen"}
      </button>
    </div>
   </div>
  </>
)}
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
                      <p><b>{t.nextDue}:</b> {formatDateDisplay(t.nextDue)}</p>
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
      <p><b>{t.date}:</b> {formatDateDisplay(n.date)}</p>
      <p>{language === "en" ? n.note : n.noteDe}</p>
    </div>
  ))
) : (
  <p className="muted">{t.noNotes}</p>
)}
                </>
              ))}
{tab === "attention" && (
  <>
    <div className="sectionTop">
      <h2>{t.needsAttention}</h2>
    </div>

    <div className="card">
      <h3>{language === "en" ? "Overdue" : "Überfällig"}</h3>

      {overdue.length === 0 ? (
        <p className="muted">
          {language === "en"
            ? "No overdue maintenance."
            : "Kein überfälliger Unterhalt."}
        </p>
      ) : (
        overdue.map((m, i) => renderItem(m, i))
      )}
    </div>
  </>
)}
          {tab === "maintenance" && (
            <>
              <div className="sectionTop">
                <h2>{t.maintenance}</h2>
                <button className="primaryBtn" onClick={addMaintenance}>+ {t.add}</button>
              </div>
              <div className="filterRow">
  <button
    className={maintenanceFilter === "all" ? "activeFilter" : ""}
    onClick={() => setMaintenanceFilter("all")}
  >
    All
  </button>

  <button
    className={maintenanceFilter === "overdue" ? "activeFilter" : ""}
    onClick={() => setMaintenanceFilter("overdue")}
  >
    Overdue
  </button>

  <button
    className={maintenanceFilter === "dueSoon" ? "activeFilter" : ""}
    onClick={() => setMaintenanceFilter("dueSoon")}
  >
    Due Soon
  </button>

  <button
    className={maintenanceFilter === "future" ? "activeFilter" : ""}
    onClick={() => setMaintenanceFilter("future")}
  >
    Future
  </button>
</div>
{maintenanceFormOpen && (
  <>
    <div className="formOverlay" onClick={cancelMaintenanceForm}></div>
    <div className="card formCard">
    <h3>
      {editingMaintenanceIndex === null ? `+ ${t.add}` : t.edit} {t.maintenance}
    </h3>

    <label>{t.properties}</label>
    <select
      className="formInput"
      value={maintenanceForm.property}
      onChange={(e) =>
        setMaintenanceForm({
          ...maintenanceForm,
          property: e.target.value,
        })
      }
    >
      <option value="">{language === "en" ? "Choose property" : "Immobilie wählen"}</option>
      {properties.map((p, i) => (
        <option key={i} value={p.name}>
          {p.name}
        </option>
      ))}
    </select>

    <label>{language === "en" ? "Maintenance Type" : "Unterhaltsart"}</label>
    <select
  className="formInput"
  value={maintenanceForm.type}
  onChange={(e) =>
    setMaintenanceForm({
      ...maintenanceForm,
      type: e.target.value,
    })
  }
>
  <option value="">
    {language === "en" ? "Choose maintenance type" : "Unterhaltsart wählen"}
  </option>

  {maintenanceTypes.map((type, i) => (
    <option key={i} value={type}>
  {getMaintenanceTypeName(type)}
</option>
  ))}
</select>

    <label>{t.company}</label>
    <input
      className="formInput"
      value={maintenanceForm.company}
      onChange={(e) =>
        setMaintenanceForm({
          ...maintenanceForm,
          company: e.target.value,
        })
      }
      placeholder={t.companyQuestion}
    />

    <label>{t.lastDone}</label>
    <input
      className="formInput"
      type="date"
      value={maintenanceForm.lastDone}
      onChange={(e) =>
        setMaintenanceForm({
          ...maintenanceForm,
          lastDone: e.target.value,
        })
      }
    />

    <label>
  {language === "en"
    ? "Interval in years"
    : "Intervall in Jahren"}
</label>
    <input
  className="formInput"
  type="number"
  step="0.01"
  onWheel={(e) => e.target.blur()}
  value={maintenanceForm.intervalYears}
      onChange={(e) =>
        setMaintenanceForm({
          ...maintenanceForm,
          intervalYears: e.target.value,
        })
      }
      placeholder="0.5 = 6 months"
    />

    
<label>{language === "en" ? "Warning days before due" : "Tage vorher warnen"}</label>
<input
  className="formInput"
  type="number"
  onWheel={(e) => e.target.blur()}
  value={maintenanceForm.warningDays}
  onChange={(e) =>
    setMaintenanceForm({
      ...maintenanceForm,
      warningDays: e.target.value,
    })
  }
  placeholder="30"
/>
<label style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
  <input
    type="checkbox"
    checked={maintenanceForm.sendEmail}
    onChange={(e) =>
      setMaintenanceForm({
        ...maintenanceForm,
        sendEmail: e.target.checked,
      })
    }
  />
  
  {language === "en"
    ? "Send reminder email to company"
    : "Erinnerungs-E-Mail an Firma senden"}
</label>
<label>Notes English</label>
<textarea
  className="formInput"
  rows="4"
  value={maintenanceForm.notesEn}
  onChange={(e) =>
    setMaintenanceForm({
      ...maintenanceForm,
      notesEn: e.target.value,
    })
  }
  placeholder="Example: Every 2 years, together with chimney..."
/>

<label>Notizen Deutsch</label>
<textarea
  className="formInput"
  rows="4"
  value={maintenanceForm.notesDe}
  onChange={(e) =>
    setMaintenanceForm({
      ...maintenanceForm,
      notesDe: e.target.value,
    })
  }
  placeholder="Beispiel: Alle 2 Jahre, zusammen mit Kamin..."
/>
<label>{language === "en" ? "History dates" : "Verlauf-Daten"}</label>
<textarea
  className="formInput"
  rows="4"
  value={maintenanceForm.historyText}
  onChange={(e) =>
    setMaintenanceForm({
      ...maintenanceForm,
      historyText: e.target.value,
    })
  }
  placeholder={
    language === "en"
      ? "One date per line, example: 2024-05-10"
      : "Ein Datum pro Zeile, Beispiel: 2024-05-10"
  }
/>
    <div className="formButtons">
      <button className="primaryBtn" onClick={saveMaintenanceForm}>
        {editingMaintenanceIndex === null ? t.add : t.edit}
      </button>

      <button onClick={cancelMaintenanceForm}>
        {language === "en" ? "Cancel" : "Abbrechen"}
      </button>
    </div>
    </div>
  </>
)}
             {maintenancePageItems.map(renderItem)}
            </>
          )}

          {tab === "calendar" && (
            <>
              <h2>{t.calendar}</h2>

              <div className="monthHeader">
                <button onClick={() => setCalendarOffset(calendarOffset - 12)}>«</button>
                <button onClick={() => setCalendarOffset(calendarOffset - 1)}>‹</button>
             <strong>
  {calendarDate.toLocaleString(language === "de" ? "de-CH" : "en-GB", {
    month: "long",
  })}{" "}
  {year}
</strong>
                <button onClick={() => setCalendarOffset(calendarOffset + 1)}>›</button>
                <button onClick={() => setCalendarOffset(calendarOffset + 12)}>»</button>
              </div>

              <div className="calendarGridBig">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
  <div key={i} className="dayNameBig">{d}</div>
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
  {m.property}: {getMaintenanceTypeName(m.type)}
</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "contacts" && (
            <div className="contactsPage">
              <div className="sectionTop">
                <h2>{t.contacts}</h2>
                <button className="primaryBtn" onClick={addContact}>
                  + {t.add}
                </button>
              </div>

              {contactFormOpen && (
                <>
                  <div className="formOverlay" onClick={cancelContactForm}></div>
                  <div className="card formCard">
                    <h3>
                      {editingContactIndex === null ? `+ ${t.add}` : t.edit} {t.contacts}
                    </h3>

                    <label>{t.company}</label>
                    <input
                      className="formInput"
                      value={contactForm.company}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          company: e.target.value,
                        })
                      }
                      placeholder={t.companyQuestion}
                    />

                    <label>{t.phone}</label>
                    <input
                      className="formInput"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder={t.phoneQuestion}
                    />

                    <label>{t.email}</label>
                    <input
                      className="formInput"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      placeholder={t.emailQuestion}
                    />

                    <label>{t.website}</label>
                    <input
                      className="formInput"
                      value={contactForm.website}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          website: e.target.value,
                        })
                      }
                      placeholder={t.websiteQuestion}
                    />

                    <div className="formButtons">
                      <button className="primaryBtn" onClick={saveContactForm}>
                        {editingContactIndex === null ? t.add : t.edit}
                      </button>

                      <button onClick={cancelContactForm}>
                        {language === "en" ? "Cancel" : "Abbrechen"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {filteredContacts.map((c, i) => {
                const originalIndex = contacts.indexOf(c);

                return (
                  <div className="card contactCard" key={i}>
                    <h3>{c.company}</h3>
                    <p className="contactLine"><b>{t.phone}:</b> <span>{c.phone || "-"}</span></p>
                    <p className="contactLine"><b>{t.email}:</b> <span>{c.email || "-"}</span></p>
                    <p className="contactLine"><b>{t.website}:</b> <span>{c.website || "-"}</span></p>

                    <div className="contactActions">
                      <button onClick={() => editContact(originalIndex)}>
                        {t.edit}
                      </button>

                      <button className="dangerBtn" onClick={() => deleteContact(originalIndex)}>
                        {t.delete}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

<div className="nav">  <button className={tab === "home" ? "active" : ""} onClick={() => openTab("home")}>
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

</div>
      </div>
    </div>
  );
}