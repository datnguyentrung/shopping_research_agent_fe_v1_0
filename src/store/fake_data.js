import { fakerVI as faker, fakerEN } from "@faker-js/faker"; // Dùng locale Tiếng Việt
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const taxonomyFilePath = path.join(__dirname, "taxonomy.en-US.txt");

// ==========================================
// 1. DATA KỊCH BẢN CHO BẢNG ATTRIBUTE
// ==========================================
const rawAttributes = [
  {
    name: "Màu sắc",
    options: faker.helpers.uniqueArray(faker.color.human, 10),
  },
  {
    name: "Chất liệu",
    options: faker.helpers.uniqueArray(faker.commerce.productMaterial, 10),
  },
  {
    name: "Kích cỡ Quần Áo",
    options: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  },
  { name: "Giới tính", options: ["Nam", "Nữ", "Unisex", "Trẻ em"] },
  {
    name: "Phong cách",
    options: ["Basic", "Casual", "Sport", "Street", "Vintage", "Luxury"],
  },
  { name: "Mùa sử dụng", options: ["Xuân", "Hè", "Thu", "Đông", "Quanh năm"] },
  {
    name: "Kiểu dáng",
    options: ["Slim fit", "Regular fit", "Loose fit", "Oversize"],
  },
  {
    name: "Chiều dài tay",
    options: ["Không tay", "Tay ngắn", "Tay lỡ", "Tay dài"],
  },
  {
    name: "Dung lượng RAM",
    options: ["4GB", "8GB", "16GB", "32GB", "64GB", "96GB", "128GB"],
  },
  {
    name: "Ổ cứng",
    options: [
      "128GB SSD",
      "256GB SSD",
      "512GB SSD",
      "1TB SSD",
      "2TB SSD",
      "4TB HDD",
    ],
  },
  {
    name: "Kích thước màn hình",
    options: [
      "6.1 inch",
      "10.9 inch",
      "13.3 inch",
      "14 inch",
      "15.6 inch",
      "24 inch",
      "27 inch",
    ],
  },
  { name: "Độ phân giải", options: ["HD", "Full HD", "2K", "4K", "5K", "8K"] },
  {
    name: "Tần số quét",
    options: ["60Hz", "75Hz", "90Hz", "120Hz", "144Hz", "240Hz"],
  },
  {
    name: "Hệ điều hành",
    options: ["Windows", "macOS", "Linux", "Android", "iOS", "Không có"],
  },
  {
    name: "CPU",
    options: [
      "Intel Core i5",
      "Intel Core i7",
      "Intel Core i9",
      "AMD Ryzen 5",
      "AMD Ryzen 7",
      "Apple M3",
    ],
  },
  {
    name: "GPU",
    options: [
      "Intel Iris",
      "NVIDIA RTX 4060",
      "NVIDIA RTX 4070",
      "AMD Radeon",
      "Apple GPU",
    ],
  },
  {
    name: "Loại kết nối",
    options: ["Bluetooth", "Wi-Fi", "USB-C", "Lightning", "3.5mm", "HDMI"],
  },
  {
    name: "Chuẩn Wi-Fi",
    options: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"],
  },
  { name: "Chuẩn Bluetooth", options: ["4.2", "5.0", "5.2", "5.3", "5.4"] },
  { name: "Loại pin", options: ["Li-ion", "Li-Po", "NiMH", "Không pin"] },
  {
    name: "Dung lượng pin",
    options: ["1000mAh", "3000mAh", "5000mAh", "10000mAh", "20000mAh"],
  },
  {
    name: "Công suất",
    options: ["5W", "10W", "20W", "45W", "65W", "120W", "200W"],
  },
  { name: "Điện áp", options: ["5V", "12V", "24V", "110V", "220V"] },
  { name: "Nhiên liệu", options: ["Xăng", "Dầu", "Điện", "Hybrid"] },
  { name: "Số chỗ", options: ["1", "2", "4", "5", "7", "9"] },
  { name: "Hộp số", options: ["Số sàn", "Số tự động", "CVT", "DCT"] },
  { name: "Dẫn động", options: ["FWD", "RWD", "AWD", "4WD"] },
  {
    name: "Tốc độ tối đa",
    options: ["30 km/h", "80 km/h", "120 km/h", "180 km/h", "250 km/h"],
  },
  {
    name: "Trọng tải",
    options: ["50kg", "100kg", "300kg", "500kg", "1 tấn", "3 tấn"],
  },
  { name: "Kích thước", options: ["Nhỏ", "Vừa", "Lớn", "Siêu lớn"] },
  {
    name: "Trọng lượng",
    options: ["< 1kg", "1-5kg", "5-20kg", "20-50kg", "> 50kg"],
  },
  {
    name: "Hình dạng",
    options: ["Tròn", "Vuông", "Chữ nhật", "Oval", "Đa giác"],
  },
  {
    name: "Hương vị (Thú cưng)",
    options: ["Bò", "Gà", "Cá hồi", "Cừu", "Vịt", "Thỏ"],
  },
  {
    name: "Độ tuổi thú cưng",
    options: ["Con non", "Trưởng thành", "Mọi lứa tuổi", "Già"],
  },
  {
    name: "Giống thú cưng",
    options: ["Chó nhỏ", "Chó lớn", "Mèo", "Cá", "Chim", "Gặm nhấm"],
  },
  {
    name: "Loại da phù hợp",
    options: ["Da dầu", "Da khô", "Da thường", "Da hỗn hợp", "Da nhạy cảm"],
  },
  {
    name: "Vấn đề da",
    options: ["Mụn", "Lão hóa", "Nám", "Thâm", "Thiếu ẩm", "Không mùi"],
  },
  { name: "SPF", options: ["SPF 15", "SPF 30", "SPF 50", "SPF 50+"] },
  {
    name: "Thành phần chính",
    options: [
      "Vitamin C",
      "Niacinamide",
      "Retinol",
      "Ceramide",
      "Hyaluronic Acid",
    ],
  },
  {
    name: "Loại tóc",
    options: ["Tóc dầu", "Tóc khô", "Tóc nhuộm", "Tóc xoăn", "Mọi loại tóc"],
  },
  {
    name: "Nhóm thực phẩm",
    options: ["Đồ khô", "Đồ tươi", "Đồ đông lạnh", "Đồ uống", "Gia vị"],
  },
  { name: "Khẩu phần", options: ["1 người", "2-3 người", "Gia đình", "Tiệc"] },
  {
    name: "Nguồn gốc",
    options: ["Việt Nam", "Nhật Bản", "Hàn Quốc", "Mỹ", "EU", "Úc"],
  },
  {
    name: "Thương hiệu",
    options: fakerEN.helpers.uniqueArray(() => fakerEN.company.name(), 12),
  },
  {
    name: "Bảo hành",
    options: [
      "Không",
      "3 tháng",
      "6 tháng",
      "12 tháng",
      "24 tháng",
      "36 tháng",
    ],
  },
  {
    name: "Xuất xứ",
    options: [
      "Việt Nam",
      "Trung Quốc",
      "Thái Lan",
      "Hàn Quốc",
      "Nhật Bản",
      "Mỹ",
    ],
  },
  {
    name: "Đối tượng sử dụng",
    options: ["Người lớn", "Trẻ em", "Người cao tuổi", "Mọi đối tượng"],
  },
  {
    name: "Điều kiện bảo quản",
    options: ["Nhiệt độ phòng", "Ngăn mát", "Ngăn đông", "Tránh ánh nắng"],
  },
  { name: "Số lượng gói", options: ["1", "2", "3", "5", "10", "20"] },
  {
    name: "Định lượng",
    options: ["100g", "250g", "500g", "1kg", "5kg", "10kg"],
  },
  { name: "Thể tích", options: ["100ml", "250ml", "500ml", "1L", "2L", "5L"] },
  { name: "Số ngăn", options: ["1", "2", "3", "4", "5+"] },
  {
    name: "Mức chống nước",
    options: ["Không", "IPX4", "IPX6", "IP67", "IP68"],
  },
  { name: "Năm sản xuất", options: ["2022", "2023", "2024", "2025", "2026"] },
  {
    name: "Ngôn ngữ",
    options: ["Tiếng Việt", "English", "Song ngữ", "Đa ngôn ngữ"],
  },
  {
    name: "Tình trạng",
    options: ["Mới", "Mở hộp", "Like new", "Đã qua sử dụng"],
  },
  {
    name: "Mục đích sử dụng",
    options: [
      "Cá nhân",
      "Gia đình",
      "Văn phòng",
      "Chuyên nghiệp",
      "Công nghiệp",
    ],
  },
  {
    name: "Dòng sản phẩm",
    options: ["Tiêu chuẩn", "Nâng cao", "Cao cấp", "Pro", "Ultra"],
  },
  { name: "Phiên bản", options: ["2022", "2023", "2024", "2025", "Mới nhất"] },
  {
    name: "Công nghệ nổi bật",
    options: ["AI", "Smart Sync", "Eco Mode", "Fast Charge", "Noise Canceling"],
  },
  {
    name: "Cổng kết nối",
    options: ["USB-A", "USB-C", "HDMI", "DisplayPort", "Ethernet", "TF Card"],
  },
  {
    name: "Tốc độ đọc",
    options: ["100MB/s", "500MB/s", "1GB/s", "3GB/s", "7GB/s"],
  },
  {
    name: "Tốc độ ghi",
    options: ["80MB/s", "300MB/s", "800MB/s", "2GB/s", "6GB/s"],
  },
  {
    name: "Độ sáng",
    options: ["250 nits", "300 nits", "400 nits", "600 nits", "1000 nits"],
  },
  { name: "Độ tương phản", options: ["1000:1", "1500:1", "3000:1", "5000:1"] },
  { name: "Tỉ lệ màn hình", options: ["16:9", "16:10", "21:9", "4:3"] },
  { name: "Góc nhìn", options: ["120 độ", "140 độ", "160 độ", "178 độ"] },
  {
    name: "Chuẩn âm thanh",
    options: ["Stereo", "Dolby Audio", "Dolby Atmos", "Hi-Res"],
  },
  { name: "Độ ồn", options: ["<20dB", "20-30dB", "30-40dB", ">40dB"] },
  {
    name: "Năng lượng tiêu thụ",
    options: ["<50W", "50-100W", "100-300W", ">300W"],
  },
  {
    name: "Chuẩn tiết kiệm điện",
    options: ["Energy Star", "5 sao", "Inverter", "Không"],
  },
  {
    name: "Khả năng chống va đập",
    options: ["Cơ bản", "MIL-STD-810H", "Chống sốc cao"],
  },
  { name: "Chứng nhận an toàn", options: ["CE", "FCC", "RoHS", "UL", "QCVN"] },
  {
    name: "Kích cỡ giày",
    options: ["35", "36", "37", "38", "39", "40", "41", "42", "43"],
  },
  { name: "Chiều cao gót", options: ["1cm", "3cm", "5cm", "7cm", "9cm"] },
  {
    name: "Loại cổ áo",
    options: ["Cổ tròn", "Cổ tim", "Cổ bẻ", "Cổ lọ", "Không cổ"],
  },
  { name: "Họa tiết", options: ["Trơn", "Sọc", "Caro", "Hoa", "In hình"] },
  {
    name: "Kiểu đóng gói",
    options: ["Túi", "Hộp giấy", "Hộp thiếc", "Chai", "Lon"],
  },
  { name: "Hàm lượng đường", options: ["0%", "Thấp", "Vừa", "Cao"] },
  { name: "Hàm lượng protein", options: ["5g", "10g", "20g", "30g"] },
  { name: "Hàm lượng chất béo", options: ["0g", "5g", "10g", "20g"] },
  { name: "Độ cồn", options: ["0%", "3%", "5%", "12%", "40%"] },
  {
    name: "Hạn sử dụng",
    options: ["7 ngày", "30 ngày", "6 tháng", "12 tháng", "24 tháng"],
  },
  {
    name: "Môi trường sử dụng",
    options: ["Trong nhà", "Ngoài trời", "Cả hai", "Công trường"],
  },
  { name: "Chống tia UV", options: ["UPF 15", "UPF 30", "UPF 50+", "Không"] },
  {
    name: "Thời gian sạc",
    options: ["30 phút", "1 giờ", "2 giờ", "4 giờ", "8 giờ"],
  },
  {
    name: "Thời gian sử dụng",
    options: ["2 giờ", "5 giờ", "10 giờ", "20 giờ", "48 giờ"],
  },
  { name: "Số cổng", options: ["1", "2", "3", "4", "6", "8"] },
  { name: "Độ dài dây", options: ["0.5m", "1m", "1.5m", "2m", "3m"] },
  {
    name: "Loại bảo mật",
    options: ["Vân tay", "Face ID", "Mã PIN", "Mã cơ", "RFID"],
  },
  {
    name: "Loại cảm biến",
    options: ["Nhiệt độ", "Độ ẩm", "Ánh sáng", "Áp suất", "Chuyển động"],
  },
  { name: "Độ chính xác cảm biến", options: ["±0.1", "±0.5", "±1.0", "±2.0"] },
  { name: "Chuẩn chống bụi", options: ["IP5X", "IP6X", "Không"] },
  {
    name: "Khối lượng đóng gói",
    options: ["250g", "500g", "1kg", "2kg", "5kg"],
  },
  {
    name: "Loại giấy",
    options: ["Bìa cứng", "Glossy", "Matte", "Tái chế", "Couche"],
  },
  { name: "Số trang", options: ["32", "64", "128", "256", "512"] },
  {
    name: "Độ tuổi khuyến nghị",
    options: ["0-3", "4-6", "7-12", "13-18", "18+"],
  },
];

const attributesData = rawAttributes.map((attr, index) => ({
  id: index + 1,
  name: attr.name,
  options: attr.options,
}));

const attributeIdByName = new Map(
  attributesData.map((attr) => [attr.name, attr.id]),
);

const ATTRIBUTE_NAME_EN = {
  "Màu sắc": "Color",
  "Chất liệu": "Material",
  "Kích cỡ Quần Áo": "Apparel Size",
  "Giới tính": "Gender",
  "Phong cách": "Style",
  "Mùa sử dụng": "Season",
  "Kiểu dáng": "Fit Type",
  "Chiều dài tay": "Sleeve Length",
  "Dung lượng RAM": "RAM Capacity",
  "Ổ cứng": "Storage",
  "Kích thước màn hình": "Screen Size",
  "Độ phân giải": "Resolution",
  "Tần số quét": "Refresh Rate",
  "Hệ điều hành": "Operating System",
  "Loại kết nối": "Connection Type",
  "Chuẩn Wi-Fi": "Wi-Fi Standard",
  "Chuẩn Bluetooth": "Bluetooth Standard",
  "Loại pin": "Battery Type",
  "Dung lượng pin": "Battery Capacity",
  "Công suất": "Power",
  "Điện áp": "Voltage",
  "Nhiên liệu": "Fuel Type",
  "Số chỗ": "Seat Count",
  "Hộp số": "Transmission",
  "Dẫn động": "Drivetrain",
  "Tốc độ tối đa": "Top Speed",
  "Trọng tải": "Payload",
  "Kích thước": "Size",
  "Trọng lượng": "Weight",
  "Hình dạng": "Shape",
  "Hương vị (Thú cưng)": "Pet Flavor",
  "Độ tuổi thú cưng": "Pet Age Group",
  "Giống thú cưng": "Pet Breed Group",
  "Loại da phù hợp": "Suitable Skin Type",
  "Vấn đề da": "Skin Concern",
  "Thành phần chính": "Key Ingredient",
  "Loại tóc": "Hair Type",
  "Nhóm thực phẩm": "Food Group",
  "Khẩu phần": "Serving Size",
  "Nguồn gốc": "Origin",
  "Thương hiệu": "Brand",
  "Bảo hành": "Warranty",
  "Xuất xứ": "Made In",
  "Đối tượng sử dụng": "Target User",
  "Điều kiện bảo quản": "Storage Condition",
  "Số lượng gói": "Pack Quantity",
  "Định lượng": "Net Weight",
  "Thể tích": "Volume",
  "Số ngăn": "Compartment Count",
  "Mức chống nước": "Water Resistance",
  "Năm sản xuất": "Production Year",
  "Ngôn ngữ": "Language",
  "Tình trạng": "Condition",
  "Mục đích sử dụng": "Use Case",
  "Dòng sản phẩm": "Product Line",
  "Phiên bản": "Version",
  "Công nghệ nổi bật": "Key Technology",
  "Cổng kết nối": "Port Type",
  "Tốc độ đọc": "Read Speed",
  "Tốc độ ghi": "Write Speed",
  "Độ sáng": "Brightness",
  "Độ tương phản": "Contrast Ratio",
  "Tỉ lệ màn hình": "Aspect Ratio",
  "Góc nhìn": "Viewing Angle",
  "Chuẩn âm thanh": "Audio Standard",
  "Độ ồn": "Noise Level",
  "Năng lượng tiêu thụ": "Power Consumption",
  "Chuẩn tiết kiệm điện": "Energy Saving Standard",
  "Khả năng chống va đập": "Shock Resistance",
  "Chứng nhận an toàn": "Safety Certification",
  "Kích cỡ giày": "Shoe Size",
  "Chiều cao gót": "Heel Height",
  "Loại cổ áo": "Collar Type",
  "Họa tiết": "Pattern",
  "Kiểu đóng gói": "Packaging Type",
  "Hàm lượng đường": "Sugar Content",
  "Hàm lượng protein": "Protein Content",
  "Hàm lượng chất béo": "Fat Content",
  "Độ cồn": "Alcohol Content",
  "Hạn sử dụng": "Shelf Life",
  "Môi trường sử dụng": "Usage Environment",
  "Chống tia UV": "UV Protection",
  "Thời gian sạc": "Charging Time",
  "Thời gian sử dụng": "Battery Life",
  "Số cổng": "Port Count",
  "Độ dài dây": "Cable Length",
  "Loại bảo mật": "Security Type",
  "Loại cảm biến": "Sensor Type",
  "Độ chính xác cảm biến": "Sensor Accuracy",
  "Chuẩn chống bụi": "Dust Resistance",
  "Khối lượng đóng gói": "Package Weight",
  "Loại giấy": "Paper Type",
  "Số trang": "Page Count",
  "Độ tuổi khuyến nghị": "Recommended Age",
};

const OPTION_EN = {
  Nam: "Male",
  Nữ: "Female",
  "Trẻ em": "Kids",
  Xuân: "Spring",
  Hè: "Summer",
  Thu: "Autumn",
  Đông: "Winter",
  "Quanh năm": "All Season",
  "Không tay": "Sleeveless",
  "Tay ngắn": "Short Sleeve",
  "Tay lỡ": "Half Sleeve",
  "Tay dài": "Long Sleeve",
  "Không có": "None",
  Xăng: "Gasoline",
  Dầu: "Diesel",
  Điện: "Electric",
  "Số sàn": "Manual",
  "Số tự động": "Automatic",
  Nhỏ: "Small",
  Vừa: "Medium",
  Lớn: "Large",
  "Siêu lớn": "Extra Large",
  Tròn: "Round",
  Vuông: "Square",
  "Chữ nhật": "Rectangle",
  "Đa giác": "Polygon",
  Bò: "Beef",
  Gà: "Chicken",
  "Cá hồi": "Salmon",
  Cừu: "Lamb",
  Vịt: "Duck",
  Thỏ: "Rabbit",
  "Con non": "Young",
  "Trưởng thành": "Adult",
  "Mọi lứa tuổi": "All Ages",
  Già: "Senior",
  "Chó nhỏ": "Small Dog",
  "Chó lớn": "Large Dog",
  Mèo: "Cat",
  Cá: "Fish",
  Chim: "Bird",
  "Gặm nhấm": "Rodent",
  "Da dầu": "Oily Skin",
  "Da khô": "Dry Skin",
  "Da thường": "Normal Skin",
  "Da hỗn hợp": "Combination Skin",
  "Da nhạy cảm": "Sensitive Skin",
  Mụn: "Acne",
  "Lão hóa": "Anti-aging",
  Nám: "Pigmentation",
  Thâm: "Dark Spots",
  "Thiếu ẩm": "Dehydration",
  "Không mùi": "Fragrance-free",
  "Tóc dầu": "Oily Hair",
  "Tóc khô": "Dry Hair",
  "Tóc nhuộm": "Colored Hair",
  "Tóc xoăn": "Curly Hair",
  "Mọi loại tóc": "All Hair Types",
  "Đồ khô": "Dry Food",
  "Đồ tươi": "Fresh Food",
  "Đồ đông lạnh": "Frozen Food",
  "Đồ uống": "Beverage",
  "Gia vị": "Seasoning",
  "1 người": "1 Person",
  "2-3 người": "2-3 People",
  "Gia đình": "Family",
  Tiệc: "Party",
  "Việt Nam": "Vietnam",
  "Nhật Bản": "Japan",
  "Hàn Quốc": "Korea",
  Mỹ: "USA",
  Úc: "Australia",
  "Trung Quốc": "China",
  "Thái Lan": "Thailand",
  "Người lớn": "Adults",
  "Người cao tuổi": "Seniors",
  "Mọi đối tượng": "All Users",
  "Nhiệt độ phòng": "Room Temperature",
  "Ngăn mát": "Refrigerated",
  "Ngăn đông": "Frozen",
  "Tránh ánh nắng": "Keep Away From Sunlight",
  Không: "None",
  "Mở hộp": "Open Box",
  Mới: "New",
  "Đã qua sử dụng": "Used",
  "Cá nhân": "Personal",
  "Văn phòng": "Office",
  "Chuyên nghiệp": "Professional",
  "Công nghiệp": "Industrial",
  "Tiêu chuẩn": "Standard",
  "Nâng cao": "Advanced",
  "Cao cấp": "Premium",
  "Mới nhất": "Latest",
  "Trong nhà": "Indoor",
  "Ngoài trời": "Outdoor",
  "Cả hai": "Both",
  "Công trường": "Worksite",
  "Không pin": "No Battery",
  "Không cổ": "No Collar",
  Trơn: "Solid",
  Sọc: "Striped",
  Caro: "Plaid",
  Hoa: "Floral",
  "In hình": "Graphic",
  Túi: "Bag",
  "Hộp giấy": "Paper Box",
  "Hộp thiếc": "Tin Box",
  Chai: "Bottle",
  Lon: "Can",
  Thấp: "Low",
  Cao: "High",
  "0%": "0%",
  "1 tấn": "1 ton",
  "3 tấn": "3 tons",
  "Tiếng Việt": "Vietnamese",
  "Song ngữ": "Bilingual",
  "Đa ngôn ngữ": "Multilingual",
  "120 độ": "120 degrees",
  "140 độ": "140 degrees",
  "160 độ": "160 degrees",
  "178 độ": "178 degrees",
  "Nhiệt độ": "Temperature",
  "Độ ẩm": "Humidity",
  "Ánh sáng": "Light",
  "Áp suất": "Pressure",
  "Chuyển động": "Motion",
};

function toEnglishText(value) {
  return OPTION_EN[value] ?? value;
}

// ==========================================
// 2. PARSE FILE TAXONOMY ĐỂ TẠO BẢNG CATEGORY
// ==========================================
function parseTaxonomy() {
  const lines = fs.readFileSync(taxonomyFilePath, "utf-8").split("\n");
  const categories = [];
  const categoryMap = new Map(); // Lưu path -> id để tìm parent_id
  let currentId = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue; // Bỏ qua dòng rỗng hoặc comment

    const parts = trimmedLine.split(" > ");
    let currentPath = "";
    let parentId = null; // Cấp cao nhất parent_id là null

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i].trim();
      currentPath = currentPath ? `${currentPath} > ${name}` : name;

      // Nếu path này chưa tồn tại trong Map, tạo mới
      if (!categoryMap.has(currentPath)) {
        categoryMap.set(currentPath, currentId);
        categories.push({
          id: currentId,
          name,
          parent_id: parentId,
          level: i + 1,
        });
        currentId++;
      }
      // Gán parentId cho vòng lặp tiếp theo (cấp con)
      parentId = categoryMap.get(currentPath);
    }
  }
  return categories;
}

// ==========================================
// 3. MAPPING ĐIỀU KIỆN CHO CATEGORY_ATTRIBUTE
// ==========================================
function mapCategoryAttributes(categories) {
  const categoryAttributes = [];
  let caId = 1;

  const rules = [
    {
      keywords: [
        "clothing",
        "apparel",
        "shirt",
        "dress",
        "pants",
        "skirt",
        "shoe",
        "wear",
      ],
      attrs: [
        "Màu sắc",
        "Chất liệu",
        "Kích cỡ Quần Áo",
        "Giới tính",
        "Phong cách",
        "Mùa sử dụng",
        "Kiểu dáng",
        "Chiều dài tay",
        "Loại cổ áo",
        "Họa tiết",
        "Chống tia UV",
      ],
    },
    {
      keywords: [
        "computer",
        "laptop",
        "monitor",
        "phone",
        "tablet",
        "electronics",
        "camera",
        "audio",
        "video",
      ],
      attrs: [
        "Dung lượng RAM",
        "Ổ cứng",
        "Kích thước màn hình",
        "Độ phân giải",
        "Tần số quét",
        "CPU",
        "GPU",
        "Hệ điều hành",
        "Loại kết nối",
        "Chuẩn Wi-Fi",
        "Chuẩn Bluetooth",
        "Mức chống nước",
        "Cổng kết nối",
        "Số cổng",
        "Tốc độ đọc",
        "Tốc độ ghi",
        "Độ sáng",
        "Độ tương phản",
        "Tỉ lệ màn hình",
        "Góc nhìn",
        "Chuẩn âm thanh",
        "Công nghệ nổi bật",
        "Loại bảo mật",
        "Loại cảm biến",
        "Độ chính xác cảm biến",
        "Chuẩn chống bụi",
      ],
    },
    {
      keywords: [
        "vehicle",
        "car",
        "motorcycle",
        "truck",
        "watercraft",
        "bike",
        "boat",
        "yacht",
      ],
      attrs: [
        "Nhiên liệu",
        "Số chỗ",
        "Hộp số",
        "Dẫn động",
        "Tốc độ tối đa",
        "Trọng tải",
        "Năm sản xuất",
        "Xuất xứ",
        "Bảo hành",
        "Năng lượng tiêu thụ",
        "Chuẩn tiết kiệm điện",
        "Môi trường sử dụng",
        "Khả năng chống va đập",
        "Chứng nhận an toàn",
      ],
    },
    {
      keywords: ["pet", "dog", "cat", "bird", "fish", "reptile", "animal"],
      attrs: [
        "Hương vị (Thú cưng)",
        "Độ tuổi thú cưng",
        "Giống thú cưng",
        "Định lượng",
        "Nguồn gốc",
        "Thương hiệu",
        "Khối lượng đóng gói",
        "Mục đích sử dụng",
      ],
    },
    {
      keywords: ["beauty", "cosmetic", "skin", "hair", "makeup", "fragrance"],
      attrs: [
        "Loại da phù hợp",
        "Vấn đề da",
        "SPF",
        "Thành phần chính",
        "Loại tóc",
        "Thể tích",
        "Đối tượng sử dụng",
        "Điều kiện bảo quản",
        "Hạn sử dụng",
        "Kiểu đóng gói",
      ],
    },
    {
      keywords: ["food", "beverage", "drink", "snack", "grocery"],
      attrs: [
        "Nhóm thực phẩm",
        "Khẩu phần",
        "Nguồn gốc",
        "Điều kiện bảo quản",
        "Định lượng",
        "Thể tích",
        "Số lượng gói",
        "Hàm lượng đường",
        "Hàm lượng protein",
        "Hàm lượng chất béo",
        "Độ cồn",
        "Hạn sử dụng",
        "Kiểu đóng gói",
        "Khối lượng đóng gói",
      ],
    },
    {
      keywords: ["furniture", "home", "kitchen", "bed", "table", "chair"],
      attrs: [
        "Kích thước",
        "Trọng lượng",
        "Chất liệu",
        "Màu sắc",
        "Hình dạng",
        "Số ngăn",
        "Bảo hành",
        "Môi trường sử dụng",
        "Khả năng chống va đập",
        "Chứng nhận an toàn",
      ],
    },
    {
      keywords: ["book", "magazine", "media", "software", "game"],
      attrs: [
        "Ngôn ngữ",
        "Đối tượng sử dụng",
        "Tình trạng",
        "Nguồn gốc",
        "Phiên bản",
        "Loại giấy",
        "Số trang",
        "Độ tuổi khuyến nghị",
      ],
    },
    {
      keywords: ["toy", "baby", "kids", "board game", "doll"],
      attrs: [
        "Độ tuổi khuyến nghị",
        "Chất liệu",
        "Kích thước",
        "Trọng lượng",
        "Màu sắc",
        "Chứng nhận an toàn",
        "Mục đích sử dụng",
      ],
    },
    {
      keywords: ["office", "stationery", "paper", "printer"],
      attrs: [
        "Loại giấy",
        "Số trang",
        "Kích thước",
        "Khối lượng đóng gói",
        "Nguồn gốc",
      ],
    },
    {
      keywords: ["sport", "fitness", "gym", "outdoor", "camp"],
      attrs: [
        "Mục đích sử dụng",
        "Môi trường sử dụng",
        "Khả năng chống va đập",
        "Chống tia UV",
        "Trọng lượng",
      ],
    },
  ];

  const fallbackAttrs = [
    "Thương hiệu",
    "Xuất xứ",
    "Bảo hành",
    "Màu sắc",
    "Kích thước",
    "Trọng lượng",
    "Tình trạng",
  ];

  const universalAttrs = [
    "Thương hiệu",
    "Xuất xứ",
    "Tình trạng",
    "Mục đích sử dụng",
    "Dòng sản phẩm",
    "Phiên bản",
    "Bảo hành",
  ];

  function toAttrIds(attrNames) {
    return attrNames
      .map((name) => attributeIdByName.get(name))
      .filter((id) => id !== undefined);
  }

  // Lặp qua từng category để gán attribute phù hợp
  categories.forEach((cat) => {
    const assignedAttrSet = new Set();
    const nameLower = cat.name.toLowerCase();

    // Gán trước một số thuộc tính chung để tăng mật độ dữ liệu
    faker.helpers.arrayElements(universalAttrs, 4).forEach((name) => {
      const id = attributeIdByName.get(name);
      if (id) assignedAttrSet.add(id);
    });

    rules.forEach((rule) => {
      const matched = rule.keywords.some((keyword) =>
        nameLower.includes(keyword),
      );
      if (matched) {
        toAttrIds(rule.attrs).forEach((id) => assignedAttrSet.add(id));
        faker.helpers
          .arrayElements(rule.attrs, Math.min(6, rule.attrs.length))
          .forEach((name) => {
            const id = attributeIdByName.get(name);
            if (id) assignedAttrSet.add(id);
          });
      }
    });

    if (assignedAttrSet.size === 0) {
      faker.helpers.arrayElements(fallbackAttrs, 4).forEach((name) => {
        const id = attributeIdByName.get(name);
        if (id) assignedAttrSet.add(id);
      });
    }

    if (cat.level >= 4) {
      faker.helpers
        .arrayElements(
          [
            "Thương hiệu",
            "Nguồn gốc",
            "Đối tượng sử dụng",
            "Mục đích sử dụng",
            "Công nghệ nổi bật",
          ],
          3,
        )
        .forEach((name) => {
          const id = attributeIdByName.get(name);
          if (id) assignedAttrSet.add(id);
        });
    }

    // Mỗi category lấy thêm thuộc tính ngẫu nhiên để dữ liệu phong phú hơn
    faker.helpers.arrayElements(attributesData, 5).forEach((attr) => {
      assignedAttrSet.add(attr.id);
    });

    const assignedAttrs = Array.from(assignedAttrSet);

    // Tạo records
    assignedAttrs.forEach((attrId, index) => {
      categoryAttributes.push({
        id: caId++,
        category_id: cat.id,
        attribute_id: attrId,
        is_core: index < Math.ceil(assignedAttrs.length * 0.6),
      });
    });
  });

  return categoryAttributes;
}

// ==========================================
// 4. TIỆN ÍCH XUẤT FILE CSV
// ==========================================
function escapeCSV(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Nếu có dấu phẩy hoặc ngoặc kép thì bọc trong ngoặc kép và escape ngoặc kép bên trong
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCSV(filename, headers, data) {
  const outputFilePath = path.join(__dirname, filename);
  const lines = [];
  lines.push(headers.join(","));
  data.forEach((row) => {
    const line = headers.map((header) => escapeCSV(row[header])).join(",");
    lines.push(line);
  });
  fs.writeFileSync(outputFilePath, lines.join("\n"), "utf-8");
  console.log(`Đã xuất thành công: ${outputFilePath} (${data.length} dòng)`);
}

// ==========================================
// CHẠY CHƯƠNG TRÌNH CHÍNH
// ==========================================
console.log("Đang xử lý dữ liệu...");

const categories = parseTaxonomy();
const categoryAttributes = mapCategoryAttributes(categories);

// Export Bảng Attribute (Chuyển mảng options thành chuỗi JSON hợp lệ)
const formattedAttributes = attributesData.map((attr) => ({
  id: attr.id,
  name: ATTRIBUTE_NAME_EN[attr.name] ?? attr.name,
  options: JSON.stringify(attr.options.map((option) => toEnglishText(option))),
}));

writeCSV("attribute.csv", ["id", "name", "options"], formattedAttributes);
writeCSV("category.csv", ["id", "name", "parent_id", "level"], categories);
writeCSV(
  "category_attribute.csv",
  ["id", "category_id", "attribute_id", "is_core"],
  categoryAttributes,
);

// Xuất thêm data.csv để tương thích dữ liệu cũ dạng 0/1
const compatData = categoryAttributes.map((item) => ({
  ...item,
  is_core: item.is_core ? 1 : 0,
}));
writeCSV(
  "data.csv",
  ["id", "category_id", "attribute_id", "is_core"],
  compatData,
);

console.log("Hoàn tất! Kiểm tra thư mục để lấy file CSV.");
