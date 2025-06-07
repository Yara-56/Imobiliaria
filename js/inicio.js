document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.filtro input[type="text"]');
  
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        const linhas = document.querySelectorAll('.tabela tbody tr');
  
        linhas.forEach(linha => {
          const texto = linha.textContent.toLowerCase();
          linha.style.display = texto.includes(termo) ? '' : 'none';
        });
      });
    }
  });
  