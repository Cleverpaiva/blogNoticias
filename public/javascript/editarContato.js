function editarContato(id) {
    // Obter os valores da tabela com base no ID
    var nome = document.getElementById('nome_' + id).innerText;
    var telefone = document.getElementById('telefone_' + id).innerText;
    var email = document.getElementById('email_' + id).innerText;
    
    // Redirecionar para a página de edição com os valores preenchidos
    window.location.href = '/atualiza?id=' + id + '&nome=' + encodeURIComponent(nome) + '&telefone=' + encodeURIComponent(telefone) + '&email=' + encodeURIComponent(email);
  }