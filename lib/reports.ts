import { format } from "date-fns";
import * as XLSX from "xlsx";

// Data types for reports
export type ReportType = "sales" | "products" | "orders" | "customers";
export type ExportFormat = "csv" | "excel";

// Format date for filenames and report headers
export const formatDateForReport = (date: Date = new Date()): string => {
  return format(date, "yyyy-MM-dd");
};

// Convert array of objects to CSV string
export const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return "";

  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);

  // Create CSV header row
  const csvRows = [headers.join(",")];

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      // Handle different data types and escape commas in strings
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

// Generic function to download any data
export const downloadData = (
  data: string,
  filename: string,
  mimeType: string
): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download data as CSV file
export const downloadCSV = (data: any[], filename: string): void => {
  const csvData = convertToCSV(data);
  downloadData(csvData, `${filename}.csv`, "text/csv;charset=utf-8;");
};

// Download data as Excel file
export const downloadExcel = (data: any[], filename: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Write the workbook directly as a blob for proper binary handling
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([new Uint8Array(excelBuffer)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Prepare sales report data from chart data and orders
export const prepareSalesReport = (
  chartData: any[],
  period: string,
  allOrders: any[]
): any[] => {
  return chartData.map((item) => ({
    Date: item.date,
    Revenue: item.revenue.toFixed(2),
    Orders: item.orders,
    AverageOrderValue:
      item.orders > 0 ? (item.revenue / item.orders).toFixed(2) : "0.00",
  }));
};

// Prepare products report data
export const prepareProductsReport = (products: any[]): any[] => {
  return products.map((product) => ({
    ID: product.id || product.$id,
    Name: product.name,
    Price: product.price,
    DiscountPrice: product.discount_price || "",
    Stock: product.stock || 0,
    Categories: Array.isArray(product.categories)
      ? product.categories.join(", ")
      : "",
    UnitsSold: product.sold || 0,
    Revenue: product.revenue || product.price * (product.sold || 0),
  }));
};

// Prepare orders report data
export const prepareOrdersReport = (orders: any[]): any[] => {
  return orders.map((order) => ({
    ID: order.$id,
    Date: format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss"),
    Customer: order.shippingAddress?.fullName || "Unknown",
    Status: order.status || "Processing",
    Items: order.items?.length || order.itemsCount || 0,
    Subtotal: order.amount?.subtotal.toFixed(2) || "0.00",
    Shipping: order.amount?.shipping.toFixed(2) || "0.00",
    Tax: order.amount?.tax.toFixed(2) || "0.00",
    Total: order.amount?.total.toFixed(2) || "0.00",
  }));
};

// Export report based on type, format and data
export const exportReport = (
  type: ReportType,
  format: ExportFormat,
  data: any,
  period: string = "week"
): void => {
  const date = formatDateForReport();
  let reportData: any[] = [];
  let filename = "";

  // Prepare data based on report type
  switch (type) {
    case "sales":
      filename = `sales_report_${period}_${date}`;
      reportData = prepareSalesReport(data.chartData, period, data.orders);
      break;
    case "products":
      filename = `products_report_${date}`;
      reportData = prepareProductsReport(data.products);
      break;
    case "orders":
      filename = `orders_report_${date}`;
      reportData = prepareOrdersReport(data.orders);
      break;
    case "customers":
      filename = `customers_report_${date}`;
      reportData = data.customers;
      break;
    default:
      console.error("Unknown report type:", type);
      return;
  }

  // Export based on format
  if (format === "csv") {
    downloadCSV(reportData, filename);
  } else if (format === "excel") {
    downloadExcel(reportData, filename);
  }
};
