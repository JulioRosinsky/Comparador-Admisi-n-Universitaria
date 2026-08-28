import { jsPDF } from 'jspdf';
import { CareerWithSimulation, PaesScores } from '../types/paes';

export function generateApplicationReportPDF(
  scores: PaesScores,
  careers: CareerWithSimulation[],
  applicantName: string = 'Estudiante Postulante'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 16;

  // Header Banner (#001122)
  doc.setFillColor(0, 17, 34);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Earth Accent Line (#7C5E45)
  doc.setFillColor(124, 94, 69);
  doc.rect(0, 32, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('INFORME ESTADÍSTICO DE ADMISIÓN UNIVERSITARIA', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(239, 234, 225);
  doc.text('Calculadora PAES & Simulador Estocástico de Corte (DEMRE / MiFuturo / SIES / CNA)', margin, 20);

  const currentDate = new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Fecha de Emisión: ${currentDate}  |  Postulante: ${applicantName}`, margin, 26);

  y = 42;

  // Student Scores Summary Box (#F7F4EF)
  doc.setFillColor(247, 244, 239);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'F');
  doc.setDrawColor(210, 200, 185);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'S');

  doc.setTextColor(0, 17, 34);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RESUMEN DE PUNTAJES DEL POSTULANTE (ESCALA 100 - 1.000 DEMRE)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  const colWidth = (pageWidth - margin * 2 - 8) / 4;
  const row1Y = y + 14;
  const row2Y = y + 22;

  doc.text(`• NEM: ${scores.nem.toFixed(2)} (${scores.nemScore} pts)`, margin + 4, row1Y);
  doc.text(`• Ranking: ${scores.ranking} pts`, margin + 4 + colWidth, row1Y);
  doc.text(`• C. Lectora: ${scores.lectora} pts`, margin + 4 + colWidth * 2, row1Y);
  doc.text(`• Mat. 1 (M1): ${scores.m1} pts`, margin + 4 + colWidth * 3, row1Y);

  doc.text(`• Mat. 2 (M2): ${scores.m2 ? `${scores.m2} pts` : 'No rendida'}`, margin + 4, row2Y);
  doc.text(`• Ciencias: ${scores.ciencias ? `${scores.ciencias} pts` : 'No rendida'}`, margin + 4 + colWidth, row2Y);
  doc.text(`• Historia: ${scores.historia ? `${scores.historia} pts` : 'No rendida'}`, margin + 4 + colWidth * 2, row2Y);
  doc.text(`• Opt. Ciencia/Hist: Automática`, margin + 4 + colWidth * 3, row2Y);

  y += 36;

  // Selected Careers Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 17, 34);
  doc.text(`OPCIONES ACADÉMICAS ANALIZADAS (${careers.length} CARRERAS)`, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Modelación estocástica de series de tiempo 2020-2024 y métricas de inserción MiFuturo.cl', margin, y + 4.5);

  y += 9;

  // Render each career card in the PDF
  careers.forEach((item, index) => {
    // Check if new page is needed
    if (y + 44 > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 18;
    }

    const sim = item.simulation;
    const isGreen = sim.category === 'SEGURA';
    const isAmber = sim.category === 'COMPETITIVA';

    // Container box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 2, 2, 'F');
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 2, 2, 'S');

    // Status Left Accent bar
    if (isGreen) {
      doc.setFillColor(46, 125, 50); // Green
    } else if (isAmber) {
      doc.setFillColor(199, 119, 0); // Amber
    } else {
      doc.setFillColor(198, 40, 40); // Red
    }
    doc.rect(margin, y, 3.5, 38, 'F');

    // Career Title & University
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 17, 34);
    doc.text(`${index + 1}. ${item.name} - ${item.universityName} (${item.universityShort})`, margin + 6, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 100, 90);
    doc.text(`Código DEMRE: ${item.code} | Sede: ${item.metrics.sedeCampus} | CNA: ${item.metrics.acreditacionAnos} Años (${item.metrics.acreditacionNivel})`, margin + 6, y + 11);

    // Probability & Verdict Badge Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (isGreen) {
      doc.setTextColor(46, 125, 50);
      doc.text(`Probabilidad de Admisión: ${sim.probability}% [ADMISIÓN MUY PROBABLE / SEGURA]`, margin + 6, y + 17);
    } else if (isAmber) {
      doc.setTextColor(199, 119, 0);
      doc.text(`Probabilidad de Admisión: ${sim.probability}% [COMPETITIVO / LISTA DE ESPERA]`, margin + 6, y + 17);
    } else {
      doc.setTextColor(198, 40, 40);
      doc.text(`Probabilidad de Admisión: ${sim.probability}% [BAJO CORTE HISTÓRICO / RIESGO ALTO]`, margin + 6, y + 17);
    }

    // Key metrics 3-column table
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);

    const c1 = margin + 6;
    const c2 = margin + 68;
    const c3 = margin + 130;

    const rowA = y + 23;
    const rowB = y + 28;
    const rowC = y + 33;

    doc.text(`• Ponderado Postulante: ${sim.weightedScore} pts`, c1, rowA);
    doc.text(`• Corte Último 2024: ${item.metrics.corte2024} pts`, c1, rowB);
    doc.text(`• Promedio Corte 5 Años: ${item.metrics.promedioCorte5Anos} pts`, c1, rowC);

    doc.text(`• Empleabilidad 1° Año: ${item.metrics.empleabilidad1Ano}%`, c2, rowA);
    doc.text(`• Empleabilidad 2° Año: ${item.metrics.empleabilidad2Ano}%`, c2, rowB);
    doc.text(`• Ingreso Bruto 5° Año: $${(item.metrics.ingreso5Ano).toLocaleString('es-CL')}`, c2, rowC);

    doc.text(`• Arancel Anual: $${(item.metrics.arancelAnualCLP).toLocaleString('es-CL')}`, c3, rowA);
    doc.text(`• Gratuidad: ${item.metrics.adscritoGratuidad ? 'Sí (Adscrita)' : 'No'}`, c3, rowB);
    doc.text(`• Duración Real: ${item.metrics.duracionRealSemestres} sem.`, c3, rowC);

    y += 42;
  });

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Fuentes Oficiales: DEMRE Proceso de Admisión, MiFuturo.cl (Mineduc), Servicio de Información de Educación Superior (SIES) y Comisión Nacional de Acreditación (CNA).`,
      margin,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin - 18,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  // Trigger download
  doc.save(`Ficha_Admision_PAES_${applicantName.replace(/\s+/g, '_')}.pdf`);
}
