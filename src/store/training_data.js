import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultInputPath = path.join(__dirname, "category_missing.csv");
const defaultOutputPath = path.join(__dirname, "training_data.csv");
const defaultAdditionalOutputPath = path.join(
  __dirname,
  "additional_training_data.csv",
);
const DEFAULT_QUERY_COUNT = 120;
const DEFAULT_ADDITIONAL_QUERY_COUNT = 140;
const MIN_QUERY_COUNT = 100;

const QUERY_INTENTS = [
  "generic",
  "purchase",
  "comparison",
  "budget",
  "premium",
  "problem-solving",
  "gift",
  "reviews",
];

const INTENT_TEMPLATES = {
  generic: [
    "{phrase}",
    "{phrase} online",
    "popular {phrase} options",
    "{phrase} for everyday use",
  ],
  purchase: [
    "where can I buy {phrase}?",
    "best place to buy {phrase} online",
    "trusted stores for {phrase}",
    "{phrase} near me with delivery",
  ],
  comparison: [
    "compare {phrase} options for beginners",
    "{phrase} vs {synonym}",
    "best {phrase} brands compared",
    "{phrase} buying guide comparison",
  ],
  budget: [
    "affordable {phrase} with good reviews",
    "budget {phrase} under good value",
    "cheap but durable {phrase}",
    "discount {phrase} deals today",
  ],
  premium: [
    "premium {phrase} for gift ideas",
    "high-end {phrase} worth buying",
    "luxury {phrase} recommendations",
    "top-rated premium {phrase}",
  ],
  "problem-solving": [
    "I need durable {phrase} for long-term use",
    "what {phrase} lasts the longest?",
    "best {phrase} for heavy use",
    "reliable {phrase} for daily workload",
  ],
  gift: [
    "gift ideas: {phrase}",
    "best {phrase} to gift family",
    "thoughtful {phrase} gifts",
    "seasonal gift {phrase} picks",
  ],
  reviews: [
    "top-rated {phrase} and {synonym}",
    "what are popular {phrase} choices right now?",
    "best reviewed {phrase} this year",
    "customer favorite {phrase} products",
  ],
};

const CATEGORY_HINTS = {
  apparel: ["clothes", "outfit", "wear"],
  shoes: ["footwear", "sneakers", "sandals"],
  furniture: ["home furnishings", "tables", "chairs"],
  food: ["meal options", "groceries", "snacks"],
  toys: ["play items", "kids toys", "games"],
  tools: ["equipment", "hardware", "kits"],
  bedding: ["bed linens", "comforter", "sheets"],
  lighting: ["lamps", "light fixtures", "bulbs"],
  supplies: ["accessories", "essentials", "consumables"],
  beauty: ["cosmetics", "skincare", "makeup"],
  electronics: ["gadgets", "devices", "tech"],
  kitchen: ["cookware", "kitchenware", "utensils"],
};

const BUYER_SEGMENTS = [
  "beginners",
  "professionals",
  "students",
  "families",
  "small businesses",
  "daily users",
  "first-time buyers",
  "enthusiasts",
];

const USE_CASES = [
  "daily use",
  "long-term use",
  "heavy use",
  "home use",
  "work use",
  "travel",
  "small spaces",
  "weekend activities",
  "quick replacement",
  "beginner setup",
  "gift planning",
  "seasonal needs",
];

const QUALITY_SIGNALS = [
  "good reviews",
  "high durability",
  "trusted quality",
  "best warranty",
  "top customer ratings",
  "reliable performance",
  "long lifespan",
  "easy maintenance",
];

const PRICE_INTENTS = [
  "budget",
  "affordable",
  "mid-range",
  "value for money",
  "premium",
  "high-end",
  "discount",
  "best price",
];

const SHOP_CHANNELS = [
  "online",
  "near me",
  "with fast delivery",
  "from trusted stores",
  "from official sellers",
  "in local shops",
];

const OCCASIONS = [
  "for birthdays",
  "for holidays",
  "for back-to-school",
  "for year-end sales",
  "for weekend shopping",
  "for special events",
];

function createRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickOne(items, rng) {
  if (items.length === 0) {
    return "";
  }
  const idx = Math.floor(rng() * items.length);
  return items[idx];
}

function shuffle(items, rng) {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function normalizeQuery(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function parseCsv(text) {
  const rows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") {
        i += 1;
      }

      currentRow.push(currentCell);
      const hasValue = currentRow.some((cell) => cell.trim().length > 0);
      if (hasValue) {
        rows.push(currentRow);
      }

      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += ch;
  }

  currentRow.push(currentCell);
  const hasTailValue = currentRow.some((cell) => cell.trim().length > 0);
  if (hasTailValue) {
    rows.push(currentRow);
  }

  if (inQuotes) {
    throw new Error("CSV parse error: unclosed quoted field detected.");
  }

  return rows;
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
    .replace(/[()\[\]{}]/g, " ")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildSynonymHints(phrase) {
  for (const [key, synonyms] of Object.entries(CATEGORY_HINTS)) {
    if (phrase.includes(key)) {
      return synonyms;
    }
  }

  return [`related ${phrase}`, `${phrase} products`, `${phrase} items`];
}

function materializeTemplate(template, values) {
  return template
    .replaceAll("{phrase}", values.phrase)
    .replaceAll("{synonym}", values.synonym)
    .replaceAll("{secondarySynonym}", values.secondarySynonym)
    .replace(/\s+/g, " ")
    .trim();
}

function generateQueries(categoryName, desiredCount, seedBase) {
  const phrase = toSearchPhrase(categoryName);
  const synonyms = buildSynonymHints(phrase);

  const rng = createRng(hashString(`${seedBase}::${phrase}`));
  const useCases = shuffle(USE_CASES, rng);
  const qualitySignals = shuffle(QUALITY_SIGNALS, rng);
  const buyerSegments = shuffle(BUYER_SEGMENTS, rng);
  const priceIntents = shuffle(PRICE_INTENTS, rng);
  const channels = shuffle(SHOP_CHANNELS, rng);
  const occasions = shuffle(OCCASIONS, rng);
  const intentOrder = shuffle(QUERY_INTENTS, rng);

  const queries = [];
  const seen = new Set();

  const materializeAndPush = (intent, template) => {
    const synonym = pickOne(synonyms, rng);
    const secondarySynonym = pickOne(synonyms, rng);
    const query = materializeTemplate(template, {
      phrase,
      synonym,
      secondarySynonym,
    });

    const key = normalizeQuery(query);
    if (key.length === 0 || seen.has(key)) {
      return false;
    }

    seen.add(key);
    queries.push({ query, intent });
    return true;
  };

  const stopIfEnough = () => queries.length >= desiredCount;

  for (const intent of intentOrder) {
    const templates = shuffle(INTENT_TEMPLATES[intent] || [], rng);
    for (const template of templates) {
      materializeAndPush(intent, template);
      if (stopIfEnough()) {
        return queries;
      }
    }
  }

  for (const price of priceIntents) {
    for (const useCase of useCases) {
      materializeAndPush("budget", `${price} ${phrase} for ${useCase}`);
      if (stopIfEnough()) {
        return queries;
      }
    }
  }

  for (const channel of channels) {
    for (const segment of buyerSegments) {
      materializeAndPush(
        "purchase",
        `best ${phrase} ${channel} for ${segment}`,
      );
      materializeAndPush(
        "purchase",
        `where to buy ${phrase} ${channel} for ${segment}`,
      );
      if (stopIfEnough()) {
        return queries;
      }
    }
  }

  for (const quality of qualitySignals) {
    for (const useCase of useCases) {
      materializeAndPush("reviews", `${phrase} with ${quality} for ${useCase}`);
      materializeAndPush(
        "comparison",
        `compare ${phrase} with ${quality} for ${useCase}`,
      );
      if (stopIfEnough()) {
        return queries;
      }
    }
  }

  for (const synonym of synonyms) {
    for (const occasion of occasions) {
      materializeAndPush("gift", `${phrase} and ${synonym} ${occasion}`);
      materializeAndPush(
        "premium",
        `premium ${phrase} and ${synonym} ${occasion}`,
      );
      if (stopIfEnough()) {
        return queries;
      }
    }
  }

  let fallbackIndex = 1;
  while (queries.length < desiredCount) {
    const useCase = useCases[fallbackIndex % useCases.length];
    const channel = channels[fallbackIndex % channels.length];
    const price = priceIntents[fallbackIndex % priceIntents.length];
    materializeAndPush(
      "generic",
      `${phrase} ${channel} ${price} options for ${useCase}`,
    );
    fallbackIndex += 1;
    if (fallbackIndex > desiredCount * 12) {
      break;
    }
  }

  return queries;
}

function parseCategoryCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const records = parseCsv(raw);

  if (records.length < 2) {
    throw new Error("category.csv has no data rows.");
  }

  const headers = records[0].map((h) => h.trim().toLowerCase());
  const idIndex = headers.indexOf("id");
  const nameIndex = headers.indexOf("name");

  if (idIndex === -1 || nameIndex === -1) {
    throw new Error("category.csv must contain 'id' and 'name' columns.");
  }

  const rows = [];
  let skippedRows = 0;
  const dedupe = new Set();

  for (let i = 1; i < records.length; i += 1) {
    const cols = records[i];
    const id = (cols[idIndex] ?? "").trim();
    const name = (cols[nameIndex] ?? "").trim();

    if (!id || !name) {
      skippedRows += 1;
      continue;
    }

    const dedupeKey = `${id}::${name.toLowerCase()}`;
    if (dedupe.has(dedupeKey)) {
      skippedRows += 1;
      continue;
    }
    dedupe.add(dedupeKey);

    rows.push({ id, name });
  }

  return { rows, skippedRows };
}

function buildTrainingDataRows(categories, queryCount, seedBase) {
  const rows = [["category_id", "category_name", "search_query"]];
  const additionalRows = [
    [
      "category_id",
      "category_name",
      "query_index",
      "search_query",
      "intent",
      "source",
    ],
  ];
  const intentCounter = new Map();

  for (const category of categories) {
    const queries = generateQueries(category.name, queryCount, seedBase);
    queries.forEach(({ query, intent }, idx) => {
      rows.push([category.id, category.name, query]);
      additionalRows.push([
        category.id,
        category.name,
        String(idx + 1),
        query,
        intent,
        "training_data.js",
      ]);
      intentCounter.set(intent, (intentCounter.get(intent) || 0) + 1);
    });
  }

  return { rows, additionalRows, intentCounter };
}

function writeCsv(filePath, rows) {
  const csvText = rows
    .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
    .join("\n");

  fs.writeFileSync(filePath, `${csvText}\n`, "utf-8");
}

function parseCliArgs(argv) {
  const args = {
    input: defaultInputPath,
    output: defaultOutputPath,
    additionalOutput: defaultAdditionalOutputPath,
    queryCount: DEFAULT_QUERY_COUNT,
    additionalQueryCount: DEFAULT_ADDITIONAL_QUERY_COUNT,
    seed: 42,
  };

  for (const token of argv) {
    if (token.startsWith("--input=")) {
      args.input = path.resolve(token.slice("--input=".length));
      continue;
    }

    if (token.startsWith("--output=")) {
      args.output = path.resolve(token.slice("--output=".length));
      continue;
    }

    if (token.startsWith("--queries=")) {
      const parsed = Number.parseInt(token.slice("--queries=".length), 10);
      if (!Number.isInteger(parsed) || parsed < MIN_QUERY_COUNT) {
        throw new Error(`--queries must be an integer >= ${MIN_QUERY_COUNT}.`);
      }
      args.queryCount = parsed;
      continue;
    }

    if (token.startsWith("--additional-output=")) {
      args.additionalOutput = path.resolve(
        token.slice("--additional-output=".length),
      );
      continue;
    }

    if (token.startsWith("--additional-queries=")) {
      const parsed = Number.parseInt(
        token.slice("--additional-queries=".length),
        10,
      );
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error("--additional-queries must be a positive integer.");
      }
      args.additionalQueryCount = parsed;
      continue;
    }

    if (token.startsWith("--seed=")) {
      const parsed = Number.parseInt(token.slice("--seed=".length), 10);
      if (!Number.isInteger(parsed)) {
        throw new Error("--seed must be an integer.");
      }
      args.seed = parsed;
      continue;
    }

    if (token === "--help") {
      console.log(
        [
          "Usage: node training_data.js [--input=PATH] [--output=PATH] [--queries=N]",
          "       [--additional-output=PATH] [--additional-queries=N] [--seed=N]",
        ].join("\n"),
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function printStats(categories, trainingRows, skippedRows, intentCounter) {
  console.log(
    `Generated ${trainingRows.length - 1} training rows from ${categories.length} categories (>= ${MIN_QUERY_COUNT} queries/category target).`,
  );
  if (skippedRows > 0) {
    console.log(`Skipped ${skippedRows} invalid/duplicate rows from input.`);
  }

  const intents = Array.from(intentCounter.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  if (intents.length > 0) {
    console.log("Intent distribution:");
    for (const [intent, count] of intents) {
      console.log(`- ${intent}: ${count}`);
    }
  }
}

function main() {
  const args = parseCliArgs(process.argv.slice(2));

  if (!fs.existsSync(args.input)) {
    throw new Error(`Input CSV does not exist: ${args.input}`);
  }

  const { rows: categories, skippedRows } = parseCategoryCsv(args.input);
  const primarySeed = `${args.seed}::primary`;
  const additionalSeed = `${args.seed}::additional`;

  const {
    rows: trainingRows,
    additionalRows: detailedRows,
    intentCounter,
  } = buildTrainingDataRows(categories, args.queryCount, primarySeed);

  const {
    additionalRows: longTailRows,
    intentCounter: additionalIntentCounter,
  } = buildTrainingDataRows(
    categories,
    args.additionalQueryCount,
    additionalSeed,
  );

  writeCsv(args.output, trainingRows);
  writeCsv(args.additionalOutput, longTailRows);

  printStats(categories, trainingRows, skippedRows, intentCounter);
  console.log(`Output: ${args.output}`);
  console.log(`Additional Output: ${args.additionalOutput}`);

  if (detailedRows.length > 1) {
    const previewRows = [detailedRows[0], ...detailedRows.slice(1, 6)];
    const previewPath = args.additionalOutput.replace(
      /\.csv$/i,
      ".preview.csv",
    );
    writeCsv(previewPath, previewRows);
    console.log(`Preview Output: ${previewPath}`);
  }

  if (additionalIntentCounter.size > 0) {
    const total = Array.from(additionalIntentCounter.values()).reduce(
      (sum, item) => sum + item,
      0,
    );
    console.log(`Additional rows generated: ${total}`);
  }
}

main();
