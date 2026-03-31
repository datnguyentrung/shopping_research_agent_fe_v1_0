import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "category.csv");
const outputPath = path.join(__dirname, "training_data.csv");

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  result.push(current);
  return result;
}

function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

function toSearchPhrase(categoryName) {
  return categoryName
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildSynonymHint(phrase) {
  const hints = {
    apparel: "clothes",
    shoes: "footwear",
    furniture: "home furnishings",
    food: "meal options",
    toys: "play items",
    tools: "equipment",
    bedding: "bed linens",
    lighting: "lamps",
    supplies: "accessories",
  };

  for (const [key, synonym] of Object.entries(hints)) {
    if (phrase.includes(key)) {
      return synonym;
    }
  }

  return `related ${phrase}`;
}

function generateQueries(categoryName) {
  const phrase = toSearchPhrase(categoryName);
  const synonym = buildSynonymHint(phrase);

  const templates = [
    `${phrase}`,
    `${phrase} online`,
    `best ${phrase} for daily use`,
    `affordable ${phrase} with good reviews`,
    `where can I buy ${phrase}?`,
    `I need durable ${phrase} for long-term use`,
    `top-rated ${phrase} and ${synonym}`,
    `premium ${phrase} for gift ideas`,
    `compare ${phrase} options for beginners`,
    `what are popular ${phrase} choices right now?`,
  ];

  return Array.from(new Set(templates)).slice(0, 10);
}

function parseCategoryCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("category.csv has no data rows.");
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const idIndex = headers.indexOf("id");
  const nameIndex = headers.indexOf("name");

  if (idIndex === -1 || nameIndex === -1) {
    throw new Error("category.csv must contain 'id' and 'name' columns.");
  }

  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const id = (cols[idIndex] ?? "").trim();
    const name = (cols[nameIndex] ?? "").trim();

    if (!id || !name) {
      continue;
    }

    rows.push({ id, name });
  }

  return rows;
}

function buildTrainingDataRows(categories) {
  const rows = [
    ["category_id", "category_name", "query_index", "search_query"],
  ];

  for (const category of categories) {
    const queries = generateQueries(category.name);
    queries.forEach((query, idx) => {
      rows.push([category.id, category.name, String(idx + 1), query]);
    });
  }

  return rows;
}

function writeCsv(filePath, rows) {
  const csvText = rows
    .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
    .join("\n");

  fs.writeFileSync(filePath, `${csvText}\n`, "utf-8");
}

function main() {
  const categories = parseCategoryCsv(inputPath);
  const trainingRows = buildTrainingDataRows(categories);
  writeCsv(outputPath, trainingRows);

  console.log(
    `Generated ${trainingRows.length - 1} training rows from ${categories.length} categories.`,
  );
  console.log(`Output: ${outputPath}`);
}

main();
