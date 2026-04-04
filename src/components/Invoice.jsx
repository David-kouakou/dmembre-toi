import jsPDF from 'jspdf';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text('DMEMBRE TOI', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('FACTURE', 105, 35, { align: 'center' });
  doc.text(`N° ${order.id}`, 105, 45, { align: 'center' });
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}`, 105, 55, { align: 'center' });
  
  // Informations client
  doc.setFontSize(10);
  doc.text('Facturé à :', 20, 75);
  doc.text(order.shipping_address?.full_name || '', 20, 85);
  doc.text(`Tél: ${order.shipping_address?.phone || 'Non renseigné'}`, 20, 95);
  doc.text(`${order.shipping_address?.neighborhood || ''}, ${order.shipping_address?.city || ''}`, 20, 105);
  doc.text(order.shipping_address?.country || '', 20, 115);
  
  // Articles
  let y = 140;
  doc.text('Produit', 20, y);
  doc.text('Qté', 120, y);
  doc.text('Total', 170, y);
  y += 10;
  
  order.items.forEach((item) => {
    doc.text(item.name.substring(0, 30), 20, y);
    doc.text(item.quantity.toString(), 125, y);
    doc.text(`${Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA`, 150, y);
    y += 10;
  });
  
  // Sous-total
  doc.text(`Sous-total: ${Math.round(order.subtotal || order.total - order.delivery_fee).toLocaleString('fr-FR')} FCFA`, 150, y + 5, { align: 'right' });
  y += 10;
  doc.text(`Livraison: ${Math.round(order.delivery_fee || 1500).toLocaleString('fr-FR')} FCFA`, 150, y + 5, { align: 'right' });
  y += 10;
  
  // Total
  y += 10;
  doc.setFontSize(12);
  doc.text(`Total: ${Math.round(order.total).toLocaleString('fr-FR')} FCFA`, 105, y, { align: 'center' });
  
  // Pied de page
  doc.setFontSize(8);
  doc.text('Merci de votre confiance !', 105, 280, { align: 'center' });
  doc.text('DMEMBRE TOI - Tous droits réservés', 105, 290, { align: 'center' });
  
  // Ouvrir le PDF dans un nouvel onglet
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};