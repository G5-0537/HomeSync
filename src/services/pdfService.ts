import { RentalAgreement } from '../types';

/**
 * Generates and downloads a clean, professional PDF Rental Agreement
 * with HomeSync official seal and verified terms.
 */
export async function downloadRentalAgreementPDF(agreement: RentalAgreement): Promise<void> {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = [74, 124, 89]; // Sage green
    const secondaryColor = [139, 123, 181]; // Soft Lavender
    const textColor = [30, 34, 31]; // Charcoal
    const mutedColor = [108, 117, 110];

    // Header Stamp Box
    doc.setFillColor(250, 247, 242);
    doc.rect(14, 14, 182, 34, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.rect(14, 14, 182, 34, 'D');

    // HomeSync Logo & Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('HOMESYNC', 20, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('Your space. Your people. Your peace. — Verified Rental Agreement', 20, 32);

    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`AGREEMENT ID: ${agreement.id}`, 20, 40);
    doc.text(`ISSUED: ${new Date(agreement.createdAt).toLocaleDateString()}`, 130, 40);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('RESIDENTIAL LEASE & SHARED-LIVING CO-TENANCY AGREEMENT', 14, 58);

    // Section 1: Parties
    let y = 68;
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. PARTIES TO THIS AGREEMENT', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`LANDLORD: ${agreement.landlordName} (UID: ${agreement.landlordUid})`, 18, y);
    y += 5;
    doc.text(`PRIMARY TENANT: ${agreement.tenantName} (UID: ${agreement.tenantUid})`, 18, y);
    y += 5;
    doc.text(`PROPERTY: ${agreement.propertyTitle}`, 18, y);
    y += 5;
    doc.text(`PREMISES ADDRESS: ${agreement.propertyAddress}`, 18, y);

    // Section 2: Terms & Financials
    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('2. FINANCIAL COVENANTS & DURATION', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`MONTHLY RENT: INR ${agreement.monthlyRent.toLocaleString('en-IN')}/- (Due on day ${agreement.rentDueDayOfMonth} of each month)`, 18, y);
    y += 5;
    doc.text(`SECURITY DEPOSIT: INR ${agreement.securityDeposit.toLocaleString('en-IN')}/- (Held in Escrow Wallet)`, 18, y);
    y += 5;
    doc.text(`TENANCY PERIOD: From ${agreement.startDate} to ${agreement.endDate}`, 18, y);
    y += 5;
    doc.text(`NOTICE PERIOD: ${agreement.noticePeriodDays} days written notice via HomeSync platform`, 18, y);
    y += 5;
    doc.text(`BROKERAGE FEE: INR 0/- (100% Broker-Free Guarantee)`, 18, y);

    // Section 3: Responsibilities
    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. MAINTENANCE & SHARED LIVING RESPONSIBILITIES', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const maintLines = doc.splitTextToSize(agreement.maintenanceResponsibilities, 175);
    doc.text(maintLines, 18, y);
    y += maintLines.length * 4.5 + 4;

    // Section 4: Early Termination & Deposit
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. EARLY TERMINATION & DEPOSIT SETTLEMENT', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const termLines = doc.splitTextToSize(agreement.earlyTerminationConditions, 175);
    doc.text(termLines, 18, y);
    y += termLines.length * 4.5 + 4;

    const depLines = doc.splitTextToSize(agreement.depositSettlementConditions, 175);
    doc.text(depLines, 18, y);
    y += depLines.length * 4.5 + 6;

    // Section 5: Digital Signatures
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('5. DIGITAL EXECUTION & SIGNATURES', 14, y);
    y += 7;

    // Signature boxes
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 246, 252);

    // Tenant signature box
    doc.rect(14, y, 86, 32, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('TENANT SIGNATURE', 18, y + 6);
    if (agreement.tenantSignature?.signed) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`[Signed]: ${agreement.tenantSignature.signatureName}`, 18, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(`Date: ${new Date(agreement.tenantSignature.timestamp).toLocaleString()}`, 18, y + 24);
    } else {
      doc.setTextColor(220, 50, 50);
      doc.text('Pending Tenant Signature', 18, y + 16);
    }

    // Landlord signature box
    doc.rect(110, y, 86, 32, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('LANDLORD SIGNATURE', 114, y + 6);
    if (agreement.landlordSignature?.signed) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`[Signed]: ${agreement.landlordSignature.signatureName}`, 114, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(`Date: ${new Date(agreement.landlordSignature.timestamp).toLocaleString()}`, 114, y + 24);
    } else {
      doc.setTextColor(220, 50, 50);
      doc.text('Pending Landlord Signature', 114, y + 16);
    }

    // Footer Disclaimer
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      'Executed securely via HomeSync Broker-Free Platform. This digital prototype agreement records mutually acknowledged terms.',
      14,
      285
    );

    doc.save(`HomeSync_Agreement_${agreement.id}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    // Fallback: print document window
    window.print();
  }
}
