// Função para formatar CPF no formato ###.###.###-##
  function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Função para travar a digitação de CPF e RG
  document.getElementById("cpf").addEventListener("input", function(event) {
    let cpfValue = event.target.value;

    // Permite apenas números para o CPF
    cpfValue = cpfValue.replace(/\D/g, '');

    // Se o CPF tiver 11 dígitos, aplica o formato e desabilita o campo
    if (cpfValue.length === 11) {
      event.target.value = formatarCPF(cpfValue); // Formata o CPF
      event.target.disabled = true;  // Desativa o campo para impedir mais digitação
    } else {
      // Caso o CPF tenha menos de 11 dígitos, mantém o valor sem formatação
      event.target.value = cpfValue;
    }
  });

  // Função para formatar RG no formato correto
  function formatarRG(rg, digitos) {
    if (digitos === '6') {
      return rg.replace(/(\d{2})(\d{3})(\d{1})/, "$1.$2-$3");
    } else if (digitos === '7') {
      return rg.replace(/(\d{2})(\d{3})(\d{2})/, "$1.$2.$3");
    } else if (digitos === '8') {
      return rg.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
    } else if (digitos === '9') {
      return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    } else if (digitos === '10') {
      return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return rg;
  }

  // Função para travar a digitação de RG
  document.getElementById("rg").addEventListener("input", function(event) {
    let rgValue = event.target.value;
    const digitosRG = document.getElementById("rg-digits").value;

    // Impede que o RG ultrapasse o número de dígitos selecionado
    if (rgValue.length === parseInt(digitosRG)) {
      event.target.value = formatarRG(rgValue, digitosRG); // Formata o RG
      event.target.disabled = true;  // Desativa o campo para impedir mais digitação
    }
  });
  
  // Função para exibir o resultado no modal
  document.getElementById("cadastro-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value;
    const rg = document.getElementById("rg").value;
    const cpf = document.getElementById("cpf").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;
  
    // Formata os dados para exibição da Identificação
    const resultadoTexto = `
  ${nome.toUpperCase()} / ${formatarRG(rg, document.getElementById("rg-digits").value)} / CERB / ${cidade.toUpperCase()} / ${estado.toUpperCase()}
  `;
  
    // Formata os dados para exibição do Apelido
    const apelidoTexto = `
  CLT / ${formatarCPF(cpf)} / 23.617.076/0001-66
  `;
  
    // Preenche o conteúdo no modal
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = resultadoTexto.trim();  // Remove espaços extras
  
    const apelidoDiv = document.getElementById("apelido");
    apelidoDiv.textContent = apelidoTexto.trim();  // Remove espaços extras
  
    // Exibe o modal
    document.getElementById("resultadoModal").style.display = "block";
  });
  
  // Função para fechar o modal
  document.getElementById("closeModal").onclick = function() {
    document.getElementById("resultadoModal").style.display = "none";
  }
  
  // Função para copiar o conteúdo do resultado
  function copiarResultado() {
    const resultadoTexto = document.getElementById("resultado").textContent.trim();  // Remove espaços extras
    const textArea = document.createElement("textarea");
    textArea.value = resultadoTexto;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Identificação copiada para a área de transferência!");
  }
  
  // Função para copiar o conteúdo do Apelido
  function copiarApelido() {
    const apelidoTexto = document.getElementById("apelido").textContent.trim();  // Remove espaços extras
    const textArea = document.createElement("textarea");
    textArea.value = apelidoTexto;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Apelido copiado para a área de transferência!");
  }
  