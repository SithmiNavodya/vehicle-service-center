import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class InventoryReportGenerator {

  // Generate Excel Report
  static generateExcelReport(inventoryData, spareParts, categories) {
    try {
      const wb = XLSX.utils.book_new();

      // 1. Summary Sheet
      const summaryData = [
        ['INVENTORY SUMMARY REPORT', '', '', ''],
        ['Generated Date:', new Date().toLocaleDateString(), 'Time:', new Date().toLocaleTimeString()],
        ['', '', '', ''],
        ['TOTAL SPARE PARTS', inventoryData.totalParts],
        ['TOTAL CATEGORIES', inventoryData.totalCategories],
        ['LOW STOCK ITEMS', inventoryData.lowStockCount],
        ['ITEMS NEEDING RESTOCK', inventoryData.restockNeededCount],
        ['STOCK HEALTH', `${Math.round((inventoryData.totalParts - inventoryData.lowStockCount) / inventoryData.totalParts * 100)}%`],
        ['', '', '', ''],
        ['REPORT SUMMARY:', '', '', ''],
        ['This report contains detailed inventory information including stock levels,', '', '', ''],
        ['pricing, and category distribution for effective inventory management.', '', '', ''],
      ];

      // Add category distribution if available
      if (categories && categories.length > 0) {
        summaryData.push(['', '', '', '']);
        summaryData.push(['CATEGORY DISTRIBUTION:', '', '', '']);
        summaryData.push(['Category Name', 'Item Count', 'Percentage', '']);

        categories.forEach(category => {
          const categoryName = category.name || 'Uncategorized';
          const categoryId = category.id;
          const partsInCategory = spareParts.filter(part =>
            part.category && part.category.id === categoryId
          ).length;
          const percentage = inventoryData.totalParts > 0 ?
            ((partsInCategory / inventoryData.totalParts) * 100).toFixed(1) : '0.0';

          summaryData.push([categoryName, partsInCategory, `${percentage}%`, '']);
        });
      }

      // Add low stock summary
      const lowStockItems = spareParts.filter(part =>
        part.quantity < (part.minQuantity || 10)
      );

      if (lowStockItems.length > 0) {
        summaryData.push(['', '', '', '']);
        summaryData.push(['LOW STOCK SUMMARY:', '', '', '']);
        summaryData.push(['Total Low Stock Items:', lowStockItems.length, '', '']);
        summaryData.push(['Critical Items (Qty < 5):', lowStockItems.filter(item => item.quantity < 5).length, '', '']);
      }

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

      // Set column widths for summary sheet
      const summaryColWidths = [
        { wch: 25 }, // Column A
        { wch: 20 }, // Column B
        { wch: 15 }, // Column C
        { wch: 15 }, // Column D
      ];
      wsSummary['!cols'] = summaryColWidths;

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // 2. Detailed Parts Sheet
      if (spareParts.length > 0) {
        const headers = [
          'Part Code', 'Part Name', 'Brand', 'Model',
          'Category', 'Supplier', 'Quantity', 'Min Quantity',
          'Price ($)', 'Total Value ($)', 'Stock Status', 'Last Updated'
        ];

        const partsData = spareParts.map(part => {
          const categoryName = part.category?.name || 'Uncategorized';
          const supplierName = part.supplier?.supplierName || 'N/A';
          const totalValue = (part.quantity || 0) * (part.price || 0);
          const stockStatus = part.quantity < (part.minQuantity || 10) ? 'LOW STOCK' : 'NORMAL';

          return [
            part.partCode || 'N/A',
            part.partName || 'N/A',
            part.brand || 'N/A',
            part.model || 'N/A',
            categoryName,
            supplierName,
            part.quantity || 0,
            part.minQuantity || 10,
            part.price ? `$${part.price.toFixed(2)}` : '$0.00',
            `$${totalValue.toFixed(2)}`,
            stockStatus,
            part.updatedAt ? new Date(part.updatedAt).toLocaleDateString() : 'N/A'
          ];
        });

        const wsParts = XLSX.utils.aoa_to_sheet([headers, ...partsData]);

        // Set column widths for parts sheet
        const partsColWidths = [
          { wch: 15 }, // Part Code
          { wch: 30 }, // Part Name
          { wch: 15 }, // Brand
          { wch: 15 }, // Model
          { wch: 20 }, // Category
          { wch: 25 }, // Supplier
          { wch: 10 }, // Quantity
          { wch: 12 }, // Min Quantity
          { wch: 12 }, // Price
          { wch: 15 }, // Total Value
          { wch: 15 }, // Stock Status
          { wch: 15 }, // Last Updated
        ];
        wsParts['!cols'] = partsColWidths;

        XLSX.utils.book_append_sheet(wb, wsParts, 'Spare Parts');

        // Add conditional formatting for low stock (Excel will show these as colored)
        const lowStockRange = { s: { r: 1, c: 10 }, e: { r: partsData.length, c: 10 } };
        if (!wsParts['!condformat']) wsParts['!condformat'] = [];
        wsParts['!condformat'].push({
          ref: `K2:K${partsData.length + 1}`,
          rules: [{
            type: "containsText",
            text: "LOW STOCK",
            dxf: { fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } } }
          }]
        });
      }

      // 3. Low Stock Items Sheet
      if (lowStockItems.length > 0) {
        const lowStockHeaders = [
          'Part Code', 'Part Name', 'Category', 'Supplier',
          'Current Stock', 'Minimum Required', 'Shortage',
          'Unit Price ($)', 'Restock Value ($)', 'Urgency Level'
        ];

        const lowStockData = lowStockItems.map(item => {
          const shortage = (item.minQuantity || 10) - item.quantity;
          const restockValue = shortage * (item.price || 0);
          let urgency = 'MEDIUM';
          if (shortage > 20) urgency = 'HIGH';
          if (shortage <= 5) urgency = 'LOW';

          return [
            item.partCode || 'N/A',
            item.partName || 'N/A',
            item.category?.name || 'Uncategorized',
            item.supplier?.supplierName || 'N/A',
            item.quantity || 0,
            item.minQuantity || 10,
            shortage,
            item.price ? `$${item.price.toFixed(2)}` : '$0.00',
            `$${restockValue.toFixed(2)}`,
            urgency
          ];
        });

        const wsLowStock = XLSX.utils.aoa_to_sheet([lowStockHeaders, ...lowStockData]);

        // Set column widths for low stock sheet
        const lowStockColWidths = [
          { wch: 15 }, // Part Code
          { wch: 25 }, // Part Name
          { wch: 20 }, // Category
          { wch: 25 }, // Supplier
          { wch: 15 }, // Current Stock
          { wch: 18 }, // Minimum Required
          { wch: 12 }, // Shortage
          { wch: 15 }, // Unit Price
          { wch: 18 }, // Restock Value
          { wch: 15 }, // Urgency
        ];
        wsLowStock['!cols'] = lowStockColWidths;

        XLSX.utils.book_append_sheet(wb, wsLowStock, 'Low Stock Items');
      }

      // 4. Generate Excel file
      const fileName = `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      return { success: true, message: 'Excel report generated successfully' };
    } catch (error) {
      console.error('Error generating Excel report:', error);
      return { success: false, message: 'Failed to generate Excel report' };
    }
  }

  // Generate PDF Report
  static generatePDFReport(inventoryData, spareParts, categories) {
    try {
      // Initialize PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set default font
      doc.setFont("helvetica");

      // Report Header
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243);
      doc.text('INVENTORY MANAGEMENT REPORT', 105, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 30, { align: 'center' });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      // Summary Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('EXECUTIVE SUMMARY', 20, 45);

      doc.setFontSize(10);
      let yPosition = 55;

      const summaryItems = [
        { label: 'Total Spare Parts:', value: inventoryData.totalParts },
        { label: 'Total Categories:', value: inventoryData.totalCategories },
        { label: 'Low Stock Items:', value: inventoryData.lowStockCount },
        { label: 'Restock Needed:', value: inventoryData.restockNeededCount }
      ];

      summaryItems.forEach(item => {
        doc.text(item.label, 30, yPosition);
        doc.setTextColor(33, 150, 243);
        doc.text(item.value.toString(), 80, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 7;
      });

      // Stock Health
      const stockHealth = inventoryData.totalParts > 0 ?
        Math.round((inventoryData.totalParts - inventoryData.lowStockCount) / inventoryData.totalParts * 100) : 0;

      yPosition += 5;
      doc.text('Stock Health:', 30, yPosition);
      doc.setTextColor(33, 150, 243);
      doc.text(`${stockHealth}%`, 80, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;

      // Low Stock Analysis
      const lowStockItems = spareParts.filter(part =>
        part.quantity < (part.minQuantity || 10)
      );

      if (lowStockItems.length > 0) {
        doc.setFontSize(14);
        doc.text('LOW STOCK ANALYSIS', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        lowStockItems.slice(0, 5).forEach((item, index) => {
          const shortage = (item.minQuantity || 10) - item.quantity;
          const partName = item.partName || 'Unknown';
          const partCode = item.partCode || 'N/A';

          doc.text(`${index + 1}. ${partName} (${partCode})`, 25, yPosition);
          doc.text(`Stock: ${item.quantity}/${item.minQuantity || 10} | Shortage: ${shortage}`, 25, yPosition + 5);
          yPosition += 12;
        });

        if (lowStockItems.length > 5) {
          doc.text(`... and ${lowStockItems.length - 5} more items need attention`, 25, yPosition);
          yPosition += 7;
        }
        yPosition += 10;
      }

      // Category Distribution
      if (categories && categories.length > 0) {
        doc.setFontSize(14);
        doc.text('CATEGORY DISTRIBUTION', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        categories.forEach(category => {
          const categoryName = category.name || 'Uncategorized';
          const categoryId = category.id;
          const partsInCategory = spareParts.filter(part =>
            part.category && part.category.id === categoryId
          ).length;
          const percentage = inventoryData.totalParts > 0 ?
            ((partsInCategory / inventoryData.totalParts) * 100).toFixed(1) : '0.0';

          doc.text(`${categoryName}:`, 25, yPosition);
          doc.text(`${partsInCategory} items (${percentage}%)`, 70, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      }

      // Detailed Table
      if (spareParts.length > 0) {
        // Add new page if needed
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.text('DETAILED SPARE PARTS LIST', 20, yPosition);
        yPosition += 10;

        const tableData = spareParts.map(part => {
          const categoryName = part.category?.name || 'Uncategorized';
          const stockStatus = part.quantity < (part.minQuantity || 10) ? 'Low' : 'Normal';

          return [
            part.partCode || 'N/A',
            part.partName || 'N/A',
            categoryName,
            part.quantity?.toString() || '0',
            (part.minQuantity || 10).toString(),
            part.price ? `$${part.price.toFixed(2)}` : '$0.00',
            stockStatus
          ];
        });

        autoTable(doc, {
          startY: yPosition,
          head: [['Code', 'Name', 'Category', 'Qty', 'Min Qty', 'Price', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [33, 150, 243],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8
          },
          margin: { left: 20, right: 20 },
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak',
            lineColor: [200, 200, 200],
            lineWidth: 0.1
          },
          columnStyles: {
            0: { cellWidth: 20 }, // Code
            1: { cellWidth: 40 }, // Name
            2: { cellWidth: 30 }, // Category
            3: { cellWidth: 15, halign: 'center' }, // Qty
            4: { cellWidth: 20, halign: 'center' }, // Min Qty
            5: { cellWidth: 25, halign: 'right' }, // Price
            6: { cellWidth: 20, halign: 'center' } // Status
          },
          didDrawCell: function(data) {
            // Highlight low stock rows
            if (data.cell.raw === 'Low') {
              doc.setFillColor(255, 255, 200); // Light yellow
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            }
          }
        });
      }

      // Footer on all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('Vehicle Service Center - Inventory Management System', 105, 290, { align: 'center' });
      }

      // Save PDF
      const fileName = `Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      return { success: true, message: 'PDF report generated successfully' };
    } catch (error) {
      console.error('Error generating PDF report:', error);
      return { success: false, message: 'Failed to generate PDF report' };
    }
  }

  // Generate CSV Report
  static generateCSVReport(spareParts) {
    try {
      if (!spareParts || spareParts.length === 0) {
        return { success: false, message: 'No data to export' };
      }

      const headers = [
        'Part Code', 'Part Name', 'Brand', 'Model', 'Category',
        'Supplier', 'Quantity', 'Min Quantity', 'Price ($)',
        'Total Value ($)', 'Stock Status', 'Created Date', 'Updated Date'
      ];

      const csvContent = [
        headers.join(','),
        ...spareParts.map(part => {
          const categoryName = part.category?.name || 'Uncategorized';
          const supplierName = part.supplier?.supplierName || 'N/A';
          const totalValue = (part.quantity || 0) * (part.price || 0);
          const stockStatus = part.quantity < (part.minQuantity || 10) ? 'LOW STOCK' : 'NORMAL';

          return [
            `"${part.partCode || ''}"`,
            `"${part.partName || ''}"`,
            `"${part.brand || ''}"`,
            `"${part.model || ''}"`,
            `"${categoryName}"`,
            `"${supplierName}"`,
            part.quantity || 0,
            part.minQuantity || 10,
            part.price || 0,
            totalValue.toFixed(2),
            `"${stockStatus}"`,
            `"${part.createdAt ? new Date(part.createdAt).toISOString() : ''}"`,
            `"${part.updatedAt ? new Date(part.updatedAt).toISOString() : ''}"`
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `Inventory_Data_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);

      return { success: true, message: 'CSV report generated successfully' };
    } catch (error) {
      console.error('Error generating CSV report:', error);
      return { success: false, message: 'Failed to generate CSV report' };
    }
  }

  // Generate Comprehensive Report
  static async generateComprehensiveReport(inventoryData, spareParts, categories, format = 'excel') {
    try {
      console.log(`Generating ${format.toUpperCase()} report...`);

      let result;
      switch (format.toLowerCase()) {
        case 'excel':
          result = this.generateExcelReport(inventoryData, spareParts, categories);
          break;
        case 'pdf':
          result = this.generatePDFReport(inventoryData, spareParts, categories);
          break;
        case 'csv':
          result = this.generateCSVReport(spareParts);
          break;
        default:
          result = this.generateExcelReport(inventoryData, spareParts, categories);
      }

      return result;
    } catch (error) {
      console.error('Error in generateComprehensiveReport:', error);
      return {
        success: false,
        message: `Failed to generate ${format.toUpperCase()} report: ${error.message}`
      };
    }
  }
}