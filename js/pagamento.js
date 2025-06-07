document.addEventListener('DOMContentLoaded', () => {
    const tenantItems = document.querySelectorAll('.tenant-item');
  
    tenantItems.forEach(item => {
      if (!item.classList.contains('disabled')) {
        item.addEventListener('click', () => {
          tenantItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          console.log('Selecionado:', item.textContent.trim());
        });
      }
    });
  
    document.querySelector('.btn-receber')?.addEventListener('click', () => {
      alert('Pagamento confirmado!');
    });
  
    document.querySelector('.btn-cancelar')?.addEventListener('click', () => {
      const confirmar = confirm('Deseja cancelar esse pagamento?');
      if (confirmar) {
        alert('Pagamento cancelado.');
      }
    });
  
    document.querySelector('.fa-print')?.addEventListener('click', () => {
      window.print();
    });
  
    document.querySelector('.fa-download')?.addEventListener('click', () => {
      alert('Download do recibo ainda não implementado.');
    });
  });
  