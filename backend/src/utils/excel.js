let ExcelJSModule = null;
async function getExcel() {
  if (ExcelJSModule) return ExcelJSModule;
  try {
    const mod = await import("exceljs");
    ExcelJSModule = mod?.default || mod;
    return ExcelJSModule;
  } catch (e) {
    return null;
  }
}

export async function buildOffersTemplate({ storeSlug } = {}) {
  const excel = await getExcel();
  const headers = [
    "title","description","original_price","offer_price","discount_percentage","image_url","store_slug","section_name","category_name","valid_from","valid_until","is_active"
  ];
  const rows = [
    headers,
    ["Diamond Earrings","14k gold with diamonds",299.99,199.99,33,"https://example.com/img1.jpg", storeSlug || "demo-store","Jewelry","Jewelry","2025-08-01","2025-08-31",true],
    ["Kids Sneakers","Comfortable sneakers",69.99,49.99,29,"https://example.com/img2.jpg", storeSlug || "demo-store","Kids","Shoes","2025-08-01","2025-08-31",true],
  ];

  if (!excel) {
    // Fallback to CSV when exceljs is not installed
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    return { buffer: Buffer.from(csv, "utf8"), contentType: "text/csv", filename: "offers_template.csv" };
  }

  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("offers");
  rows.forEach(r => ws.addRow(r));
  const buf = await wb.xlsx.writeBuffer();
  return { buffer: Buffer.from(buf), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename: "offers_template.xlsx" };
}

export async function buildSalesTemplate({ storeSlug } = {}) {
  const excel = await getExcel();
  const headers = ["store_slug","sale_date","total_amount","customer_count","items_sold"];
  const rows = [
    headers,
    [storeSlug || "demo-store","2025-08-01",1250.5,8,15],
    [storeSlug || "demo-store","2025-08-02",980.75,6,12],
  ];

  if (!excel) {
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    return { buffer: Buffer.from(csv, "utf8"), contentType: "text/csv", filename: "sales_template.csv" };
  }

  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("sales");
  rows.forEach(r => ws.addRow(r));
  const buf = await wb.xlsx.writeBuffer();
  return { buffer: Buffer.from(buf), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename: "sales_template.xlsx" };
}

