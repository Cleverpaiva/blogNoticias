document.addEventListener('DOMContentLoaded', function() {
    // Obtém o elemento do link
    var deletarLink = document.getElementById('deletar-link');
  
    // Manipula o evento de clique no link
    deletarLink.addEventListener('click', function(event) {
      // Exibe a mensagem de confirmação
      var confirmar = confirm("Deseja realmente excluir o contato?");
  
      // Se o usuário confirmar, redireciona para a rota de delete
      if (confirmar) {
        // Redireciona para a rota de delete
        window.location.href = '/contatos/removerCont';
  
        // Impede o comportamento padrão do link (navegação)
        event.preventDefault();
      }
    });
  });
  