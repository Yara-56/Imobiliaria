document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('.button-acess');

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    console.log(email, senha);

    if (!email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (email === 'admin@teste.com' && senha === '1234') {
      alert('Login correto!');
    } else {
      alert('Login simulado! Redirecionando...');
    }

    window.location.href = 'inicio.html';
  });
});
