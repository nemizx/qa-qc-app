import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export function generateInspectionPDF(inspection: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('QA/QC Inspection Report', 15, 20);
  
  doc.setFontSize(10);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 15, 30);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Inspection Details
  let yPos = 50;
  doc.setFontSize(16);
  doc.text('Inspection Details', 15, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  
  const details = [
    ['Inspection ID:', inspection.id],
    ['Project:', inspection.project],
    ['Location:', inspection.location],
    ['Type:', inspection.type],
    ['Status:', inspection.status],
    ['Inspector:', inspection.inspector],
    ['Date:', inspection.date],
    ['Score:', inspection.score ? `${inspection.score}%` : 'N/A'],
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [],
    body: details,
    theme: 'plain',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 140 }
    },
    margin: { left: 15 }
  });
  
  // Checklist Items
  if (inspection.checklistItems && inspection.checklistItems.length > 0) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(16);
    doc.text('Checklist Items', 15, yPos);
    
    yPos += 5;
    
    const checklistData = inspection.checklistItems.map((item: any) => [
      item.checked ? '✓' : '✗',
      item.item,
      item.checked ? 'Pass' : 'Fail'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Status', 'Item', 'Result']],
      body: checklistData,
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 130 },
        2: { cellWidth: 30, halign: 'center' }
      }
    });
  }
  
  // Summary
  yPos = doc.lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.text('Summary', 15, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  
  const summary = [
    ['Total Items:', inspection.items?.toString() || '0'],
    ['Passed:', inspection.passed?.toString() || '0'],
    ['Failed:', inspection.failed?.toString() || '0'],
    ['Pass Rate:', inspection.score ? `${inspection.score}%` : 'N/A'],
  ];
  
  doc.autoTable({
    startY: yPos,
    body: summary,
    theme: 'plain',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 140 }
    },
    margin: { left: 15 }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Inspection_${inspection.id}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateIssuePDF(issue: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(220, 38, 38); // red-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('QA/QC Issue Report', 15, 20);
  
  doc.setFontSize(10);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 15, 30);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Issue Details
  let yPos = 50;
  doc.setFontSize(16);
  doc.text('Issue Details', 15, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  
  const details = [
    ['Issue ID:', issue.id],
    ['Title:', issue.title],
    ['Project:', issue.project],
    ['Location:', issue.location],
    ['Severity:', issue.severity],
    ['Status:', issue.status],
    ['Reported By:', issue.reportedBy],
    ['Assigned To:', issue.assignee],
    ['Reported Date:', issue.date],
    ['Due Date:', issue.dueDate],
  ];
  
  doc.autoTable({
    startY: yPos,
    body: details,
    theme: 'plain',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 140 }
    },
    margin: { left: 15 }
  });
  
  // Description
  yPos = doc.lastAutoTable.finalY + 15;
  
  doc.setFontSize(16);
  doc.text('Description', 15, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  
  const splitDescription = doc.splitTextToSize(issue.description, pageWidth - 30);
  doc.text(splitDescription, 15, yPos);
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Issue_${issue.id}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateReportPDF(reportData: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('QA/QC Analytics Report', 15, 20);
  
  doc.setFontSize(10);
  doc.text(`Report Period: ${reportData.period || 'Last 30 days'}`, 15, 30);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Summary Statistics
  let yPos = 50;
  doc.setFontSize(16);
  doc.text('Summary Statistics', 15, yPos);
  
  yPos += 10;
  
  const stats = [
    ['Total Inspections:', reportData.totalInspections || '0'],
    ['Passed Inspections:', reportData.passedInspections || '0'],
    ['Failed Inspections:', reportData.failedInspections || '0'],
    ['Overall Pass Rate:', reportData.passRate || '0%'],
    ['Open Issues:', reportData.openIssues || '0'],
    ['Critical Issues:', reportData.criticalIssues || '0'],
  ];
  
  doc.autoTable({
    startY: yPos,
    body: stats,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 120 }
    },
    margin: { left: 15 }
  });
  
  // Project Performance
  if (reportData.projectPerformance && reportData.projectPerformance.length > 0) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Project Performance', 15, yPos);
    
    yPos += 5;
    
    const projectData = reportData.projectPerformance.map((p: any) => [
      p.project,
      p.score + '%',
      p.inspections?.toString() || '0',
      p.issues?.toString() || '0'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Project', 'Score', 'Inspections', 'Issues']],
      body: projectData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 15, right: 15 }
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`QA_QC_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
