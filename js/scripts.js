function preencherDados() {
    let select = document.getElementById("inquilino");
    let nome = document.getElementById("nome");
    let cpf = document.getElementById("cpf");
    let endereco = document.getElementById("endereco");

    let optionSelected = select.options[select.selectedIndex];

    if (optionSelected.value) {
        nome.value = optionSelected.dataset.nome;
        cpf.value = optionSelected.dataset.cpf;
        endereco.value = optionSelected.dataset.endereco;
    } else {
        nome.value = "";
        cpf.value = "";
        endereco.value = "";
    }
    verificarCampos();
}

function verificarCampos() {
    let nome = document.getElementById("nome").value;
    let valor = document.getElementById("valor").value;
    let continuarBtn = document.getElementById("continuar");

    if (nome && valor.trim() !== "") {
        continuarBtn.disabled = false;
    } else {
        continuarBtn.disabled = true;
    }
}

function exibirComprovante() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let endereco = document.getElementById("endereco").value;
    let valor = document.getElementById("valor").value;

    document.getElementById("comprovante-nome").textContent = nome;
    document.getElementById("comprovante-cpf").textContent = cpf;
    document.getElementById("comprovante-endereco").textContent = endereco;
    document.getElementById("comprovante-valor").textContent = valor;

    document.getElementById("comprovante").style.display = "block";
}

function imprimirComprovante() {
    window.print();
}

function enviarWhatsApp() {
    let nome = document.getElementById("comprovante-nome").textContent;
    let valor = document.getElementById("comprovante-valor").textContent;
    let mensagem = `Olá, ${nome}! Seu pagamento no valor de R$${valor} foi registrado com sucesso.`;
    let link = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");
}
