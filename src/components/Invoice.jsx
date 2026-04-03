import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateInvoicePDF = async (order) => {
  const element = document.createElement('div');
  element.style.width = '800px';
  element.style.padding = '40px';
  element.style.backgroundColor = 'white';
  element.style.fontFamily = 'Arial, sans-serif';
  
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF3B3B; margin: 0;">DMEMBRE TOI</h1>
      <p style="color: #666; margin: 5px 0;">Street wear authentique</p>
      <p style="color: #666;">Abidjan, Côte d'Ivoire</p>
    </div>
    
    <div style="border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 10px 0; margin-bottom: 20px;">
      <h2 style="margin: 0;">FACTURE</h2>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <p><strong>N° Facture:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut:</strong> ${order.status === 'pending' ? 'En attente' : order.status}</p>
      </div>
      <div>
        <p><strong>Mode de paiement:</strong> ${order.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : order.payment_method}</p>
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3>Facturé à :</h3>
      <p>${order.shipping_address?.first_name || order.shippingAddress?.firstName} ${order.shipping_address?.last_name || order.shippingAddress?.lastName}</p>
      <p>${order.shipping_address?.address || order.shippingAddress?.address}</p>
      <p>${order.shipping_address?.postal_code || order.shippingAddress?.postalCode} ${order.shipping_address?.city || order.shippingAddress?.city}</p>
      <p>${order.shipping_address?.country || order.shippingAddress?.country}</p>
      <p>Email: ${order.shipping_address?.email || order.shippingAddress?.email}</p>
      <p>Tel: ${order.shipping_address?.phone || order.shippingAddress?.phone}</p>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
          <th style="padding: 10px; text-align: left;">Produit</th>
          <th style="padding: 10px; text-align: center;">Quantité</th>
          <th style="padding: 10px; text-align: right;">Prix unitaire</th>
          <th style="padding: 10px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${item.name}<br/><small style="color: #666;">${item.color} / ${item.size}</small></td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">${Math.round(item.price).toLocaleString('fr-FR')} FCFA</td>
            <td style="padding: 10px; text-align: right;">${Math.round(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
           </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="border-top: 2px solid #ddd;">
          <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total</strong></td>
          <td style="padding: 10px; text-align: right;"><strong>${Math.round(order.total).toLocaleString('fr-FR')} FCFA</strong></td>
         </tr>
      </tfoot>
    </table>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Merci de votre confiance !</p>
      <p style="color: #666; font-size: 12px;"> DMEMBRE TOI - Tous droits réservés</p>
    </div>
  `;
  
  document.body.appendChild(element);
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(`facture_${order.id}.pdf`);
  document.body.removeChild(element);
};