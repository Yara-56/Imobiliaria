document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.button-acess');
  
    loginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();
  
      if (!email || !senha) {
        alert('Preencha todos os campos!');
        return;
      }
  
      if (email === 'admin@teste.com' && senha === '1234') {
        window.location.href = 'inicio.html';
      } else {
        alert('Credenciais inválidas.');
      }
    });
  });
  