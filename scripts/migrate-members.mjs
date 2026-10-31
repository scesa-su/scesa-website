// Turns a CSV export of the old Google Form responses into a clean CSV for the Members tab.
//
//   node scripts/migrate-members.mjs responses.csv members-clean.csv
//
// Then in the sheet: File → Import → Upload → Insert new sheet(s), check the rows, and copy them under the
// Members header. Prints counts only, never member data. Both CSVs are git-ignored (*.csv); delete them after.
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { MEMBER_COLUMNS, newReference, normalisePhone } from "../src/data/models/memberSchema.ts";

// The form had three versions, so one field can sit in several columns. Every header matching a field's
// pattern is tried in order and the first non-empty value wins. Adjust a pattern if a count looks wrong.
const FIELDS = {
  timestamp: /^timestamp$/i,
  fullName: /full\s*name|^\s*(your\s+)?names?\s*$/i,
  studentId: /admission|student\s*(id|number|no)|reg(istration)?\s*(no|number)/i,
  email: /e-?mail/i,
  phone: /phone|mobile|whats\s*app/i,
  course: /course|programme|program|degree/i,
  year: /year/i,
  communities: /communit|club|interest/i,
  mpesaCode: /m-?pesa|transaction|confirmation\s*code|payment\s*code/i,
};

/** RFC 4180 CSV: quoted fields, "" escapes, commas and newlines inside quotes. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") endField();
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endField();
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) {
    endField();
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim()));
}

const csvCell = (v) => (/[",\r\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
export const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";

const WORD_YEARS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };

function parseYear(raw) {
  const digit = /[1-5]/.exec(raw)?.[0];
  if (digit) return Number(digit);
  const word = /first|second|third|fourth|fifth/i.exec(raw)?.[0];
  return word ? WORD_YEARS[word.toLowerCase()] : "";
}

/** Google Forms timestamps ("10/31/2026 14:05:12", M/D/Y, Nairobi time) → ISO with +03:00; "" if unreadable. */
export function parseTimestamp(raw) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/.exec(raw.trim());
  if (!m) return "";
  const p = (n) => n.padStart(2, "0");
  return `${m[3]}-${p(m[1])}-${p(m[2])}T${p(m[4])}:${m[5]}:${m[6]}+03:00`;
}

/** Old responses (header row first) → clean member rows, one per student ID, keeping the newest. */
export function migrate(rows) {
  const [header, ...data] = rows;
  const columns = Object.fromEntries(
    Object.entries(FIELDS).map(([field, pattern]) => [
      field,
      header.flatMap((h, i) => (pattern.test(h) ? [i] : [])),
    ]),
  );
  const pick = (row, field) => columns[field].map((i) => row[i]?.trim() ?? "").find(Boolean) ?? "";

  const byStudent = new Map();
  let skipped = 0;
  for (const row of data) {
    const studentId = pick(row, "studentId").replace(/\s+/g, "");
    if (!/^\d{6}$/.test(studentId)) {
      skipped++;
      continue;
    }
    const createdAt = parseTimestamp(pick(row, "timestamp"));
    const previous = byStudent.get(studentId);
    // ISO strings with the same offset sort by time; a later row in the export wins a tie.
    if (previous && previous.createdAt > createdAt) continue;
    const phone = pick(row, "phone");
    byStudent.set(studentId, {
      reference: newReference(),
      full_name: pick(row, "fullName"),
      student_id: studentId,
      email: pick(row, "email").toLowerCase(),
      phone: normalisePhone(phone) ?? phone,
      course: pick(row, "course"),
      year: parseYear(pick(row, "year")),
      communities: pick(row, "communities")
        .split(/[,;]/)
        .map((c) => c.trim())
        .filter(Boolean)
        .join("; "),
      mpesa_code: pick(row, "mpesaCode").toUpperCase(),
      amount_kes: "",
      payment_status: "confirmed",
      confirmed_by: "legacy",
      confirmed_at: "",
      added_to_whatsapp: "TRUE",
      source: "google-form",
      created_at: createdAt,
      createdAt,
    });
  }

  const members = [...byStudent.values()];
  return {
    rows: [MEMBER_COLUMNS, ...members.map((m) => MEMBER_COLUMNS.map((c) => m[c]))],
    counts: { read: data.length, kept: members.length, duplicates: data.length - skipped - members.length, skipped },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: node scripts/migrate-members.mjs <responses.csv> <members-clean.csv>");
    process.exit(1);
  }
  const { rows, counts } = migrate(parseCsv(readFileSync(input, "utf8").replace(/^﻿/, "")));
  writeFileSync(output, toCsv(rows));
  console.log(
    `Read ${counts.read} responses: kept ${counts.kept}, dropped ${counts.duplicates} older duplicates, skipped ${counts.skipped} without a 6-digit student ID.`,
  );
}
