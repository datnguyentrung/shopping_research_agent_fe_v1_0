import { fakerVI as faker } from "@faker-js/faker";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current);
  return cells.map((x) => x.trim());
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeCSV(filePath, headers, data) {
  const rows = [headers.join(",")];

  for (const item of data) {
    const row = headers.map((header) => escapeCsvValue(item[header]));
    rows.push(row.join(","));
  }

  fs.writeFileSync(filePath, rows.join("\n"), "utf-8");
  console.log(`Da xuat file: ${filePath}`);
}

function readCategories(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const firstLineCells = parseCsvLine(lines[0]);
  const hasHeader = firstLineCells[0]?.toLowerCase() === "id";
  const startIndex = hasHeader ? 1 : 0;

  const categories = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const [id, name, parent_id, depth] = parseCsvLine(lines[i]);
    if (!id || id.toLowerCase() === "id") continue;
    categories.push({
      id,
      name: name || "",
      parent_id: parent_id || "",
      depth: Number(depth || 0),
    });
  }
  return categories;
}

function uniqueRandomWords(generator, size) {
  const set = new Set();
  while (set.size < size) {
    set.add(generator());
  }
  return [...set];
}

function createAttribute(name, options) {
  return {
    name,
    options: options.slice(0, 4).join(";"),
  };
}

function buildPriceOptionsByIndex(index) {
  const presets = [
    [300000, 600000, 900000],
    [500000, 800000, 1100000],
    [700000, 1000000, 1300000],
    [900000, 1200000, 1500000],
    [1000000, 1500000, 2000000],
    [1200000, 1700000, 2200000],
    [1500000, 2000000, 2500000],
    [2000000, 2500000, 3000000],
    [2500000, 3500000, 4500000],
  ];

  const [p1, p2, p3] = presets[index % presets.length];

  return [
    `Duoi ${p1.toLocaleString("vi-VN")} VND`,
    `Duoi ${p2.toLocaleString("vi-VN")} VND`,
    `Duoi ${p3.toLocaleString("vi-VN")} VND`,
    `Tren ${p3.toLocaleString("vi-VN")} VND`,
  ];
}

function buildAttributes(categories) {
  const fashionPriceCategoryNames = [
    "Costumes & Accessories",
    "Luggage & Travel Gear",
    "Men's Fashion",
    "Sport Specific Clothing",
    "Women's Fashion",
    "Girls' Fashion",
    "Boys' Fashion",
    "Novelty & More",
    "Baby Clothing & Shoes",
  ];

  const eligibleFashionCategories = categories.filter(
    (item) =>
      item.parent_id === "fashion" &&
      fashionPriceCategoryNames.includes(item.name),
  );

  const rawCatalog = [
    createAttribute(
      "Mau sac",
      uniqueRandomWords(() => faker.color.human(), 4),
    ),
    createAttribute("Kich co", ["S", "M", "L", "XL"]),
    createAttribute(
      "Chat lieu",
      uniqueRandomWords(() => faker.commerce.productMaterial(), 4),
    ),
    createAttribute("Kieu dang", [
      "Classic",
      "Slim Fit",
      "Regular Fit",
      "Oversize",
    ]),
    createAttribute(
      "Thuong hieu",
      uniqueRandomWords(() => faker.company.name(), 4),
    ),
    createAttribute("Hoa tiet", ["Tron", "Soc", "Cham bi", "In hinh"]),
    createAttribute("Mua su dung", ["Xuan", "Ha", "Thu", "Dong"]),
    createAttribute("Do ben", ["Co ban", "Kha", "Tot", "Rat tot"]),
    createAttribute("Do co gian", [
      "Khong gian",
      "Gian nhe",
      "Gian vua",
      "Gian cao",
    ]),
    createAttribute("Kieu co ao", ["Tron", "Tim", "Polo", "Cao"]),
    createAttribute("Do dai", ["Ngan", "Trung binh", "Dai", "Extra dai"]),
    createAttribute("Form dang", ["Om", "Vua", "Rong", "Relax"]),
    createAttribute("Phong cach", [
      "Cong so",
      "Duong pho",
      "The thao",
      "Du lich",
    ]),
    createAttribute("Tinh nang", [
      "Chong nuoc",
      "Chong UV",
      "Thoang khi",
      "Giu am",
    ]),
    createAttribute("Muc do giu nhiet", ["Nhe", "Vua", "Cao", "Rat cao"]),
    createAttribute("Loai khoa", [
      "Khoa keo",
      "Khoa bam",
      "Khoa so",
      "Khong khoa",
    ]),
    createAttribute("Dung tich", ["Nho", "Vua", "Lon", "Sieu lon"]),
    createAttribute("Kieu day deo", [
      "Day don",
      "Day doi",
      "Rut day",
      "Khong day",
    ]),
    createAttribute("Loai de", [
      "De mem",
      "De cao su",
      "De phang",
      "De chong truot",
    ]),
    createAttribute("Do cao got", ["Bet", "3 cm", "5 cm", "7 cm"]),
    createAttribute("Kich thuoc mat dong ho", [
      "32 mm",
      "36 mm",
      "40 mm",
      "44 mm",
    ]),
    createAttribute("Loai da quy", ["CZ", "Pearl", "Sapphire", "Diamond"]),
    createAttribute("Dip su dung", [
      "Hang ngay",
      "Di tiec",
      "Cong tac",
      "Van dong",
    ]),
  ];

  const priceAttributes = eligibleFashionCategories.map((category, index) =>
    createAttribute(
      `Muc gia uu tien - ${category.name}`,
      buildPriceOptionsByIndex(index),
    ),
  );

  const fullCatalog = [...priceAttributes, ...rawCatalog];

  const attributes = fullCatalog.map((item, index) => ({
    id: index + 1,
    name: item.name,
    options: item.options,
  }));

  const priceAttributeByCategoryId = new Map();
  for (const category of eligibleFashionCategories) {
    const found = attributes.find(
      (attr) => attr.name === `Muc gia uu tien - ${category.name}`,
    );
    if (found) {
      priceAttributeByCategoryId.set(category.id, found.id);
    }
  }

  return { attributes, priceAttributeByCategoryId };
}

function chooseAttributeIdsByCategory(category) {
  const categoryName = category.name;
  const lowerName = categoryName.toLowerCase();

  const base = [
    "Mau sac",
    "Kich co",
    "Chat lieu",
    "Kieu dang",
    "Thuong hieu",
    "Phong cach",
    "Dip su dung",
  ];

  if (
    lowerName.includes("shoe") ||
    lowerName.includes("sneaker") ||
    lowerName.includes("boot") ||
    lowerName.includes("sandal")
  ) {
    return [
      ...base,
      "Loai de",
      "Do cao got",
      "Do ben",
      "Mua su dung",
      "Tinh nang",
    ];
  }

  if (
    lowerName.includes("watch") ||
    lowerName.includes("jewelry") ||
    lowerName.includes("ring") ||
    lowerName.includes("necklace") ||
    lowerName.includes("bracelet") ||
    lowerName.includes("earring")
  ) {
    return [
      ...base,
      "Loai da quy",
      "Kich thuoc mat dong ho",
      "Do ben",
      "Mua su dung",
    ];
  }

  if (
    lowerName.includes("bag") ||
    lowerName.includes("wallet") ||
    lowerName.includes("luggage") ||
    lowerName.includes("backpack")
  ) {
    return [
      ...base,
      "Dung tich",
      "Loai khoa",
      "Kieu day deo",
      "Tinh nang",
      "Do ben",
    ];
  }

  if (
    lowerName.includes("costume") ||
    lowerName.includes("novelty") ||
    lowerName.includes("cosplay")
  ) {
    return [...base, "Hoa tiet", "Do co gian", "Kieu co ao", "Mua su dung"];
  }

  return [
    ...base,
    "Hoa tiet",
    "Do co gian",
    "Form dang",
    "Mua su dung",
    "Tinh nang",
  ];
}

function buildCategoryAttributes(
  categories,
  attributes,
  priceAttributeByCategoryId,
) {
  const attributeIdsByName = new Map(
    attributes.map((item) => [item.name, item.id]),
  );

  const relations = [];
  let relId = 1;

  for (const category of categories) {
    const candidateAttrNames = chooseAttributeIdsByCategory(category);
    const candidateAttrIds = [...new Set(candidateAttrNames)]
      .map((name) => attributeIdsByName.get(name))
      .filter(Boolean);

    const min = Math.min(6, candidateAttrIds.length);
    const max = Math.min(10, candidateAttrIds.length);
    const attrCount = faker.number.int({ min, max });
    let selectedAttrIds = faker.helpers
      .shuffle(candidateAttrIds)
      .slice(0, attrCount);

    const categoryPriceAttrId = priceAttributeByCategoryId.get(category.id);
    if (categoryPriceAttrId) {
      if (!selectedAttrIds.includes(categoryPriceAttrId)) {
        selectedAttrIds = [
          categoryPriceAttrId,
          ...selectedAttrIds.slice(0, Math.max(0, attrCount - 1)),
        ];
      }
    }

    selectedAttrIds.forEach((attributeId, index) => {
      relations.push({
        id: relId,
        category_id: category.id,
        attribute_id: attributeId,
        is_core: index < 2 ? 1 : faker.datatype.boolean() ? 1 : 0,
      });
      relId += 1;
    });
  }

  return relations;
}

function main() {
  const inputArg = process.argv[2];
  const inputPath = inputArg
    ? path.resolve(process.cwd(), inputArg)
    : path.resolve(__dirname, "category_current.csv");

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Khong tim thay file input: ${inputPath}`);
  }

  const outputDir = path.dirname(inputPath);
  const categories = readCategories(inputPath);
  const { attributes, priceAttributeByCategoryId } =
    buildAttributes(categories);
  const categoryAttributes = buildCategoryAttributes(
    categories,
    attributes,
    priceAttributeByCategoryId,
  );

  const attributeCsv = path.join(outputDir, "attribute.csv");
  const categoryAttributeCsv = path.join(outputDir, "category_attribute.csv");
  const dataCsv = path.join(outputDir, "data.csv");

  writeCSV(attributeCsv, ["id", "name", "options"], attributes);
  writeCSV(
    categoryAttributeCsv,
    ["id", "category_id", "attribute_id", "is_core"],
    categoryAttributes,
  );

  const compatData = categoryAttributes.map((item) => ({
    ...item,
    is_core: item.is_core ? 1 : 0,
  }));

  writeCSV(
    dataCsv,
    ["id", "category_id", "attribute_id", "is_core"],
    compatData,
  );

  console.log(`Tong so category: ${categories.length}`);
  console.log(
    `Tong so quan he category_attribute: ${categoryAttributes.length}`,
  );
  console.log("Hoan thanh.");
}

try {
  main();
} catch (error) {
  console.error("Da xay ra loi:", error.message);
  console.log(
    "Cach dung: node src/store/fake_data.js <duong_dan_toi_file_csv_input_tuy_chon>",
  );
  process.exitCode = 1;
}
