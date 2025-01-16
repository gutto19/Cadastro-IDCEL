$(document).ready(function() {
    const rgInput = $('#rg');
    const prefixoInput = $('#rg-prefixo');
    const togglePrefixo = $('#toggle-prefixo');
    const digitosSelect = $('#rg-digits');
    const estadoSelect = $('#estado');
    const cidadeSelect = $('#cidade');
    const resultadoModal = $('#resultadoModal');
    const closeModal = $('#closeModal');
    const resultadoDiv = $('#resultado');
    const apelidoDiv = $('#apelido');
    const cadastroForm = $('#cadastro-form');

    // Função para atualizar o máximo de caracteres do RG conforme a quantidade de dígitos selecionada
    function atualizarMaxLength() {
        const digitos = parseInt(digitosSelect.val(), 10);
        rgInput.attr('maxlength', digitos);
    }

    // Função para formatar o RG conforme o número de dígitos selecionado
    function formatarRG(rg) {
        const digitos = parseInt(digitosSelect.val(), 10);
        let formattedRG = rg.replace(/\D/g, ''); // Remove tudo que não é número

        // Formatação conforme os casos de dígitos
        switch (digitos) {
            case 6:
                formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{1})/, "$1.$2-$3");
                break;
            case 7:
                formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{2})/, "$1.$2.$3");
                break;
            case 8:
                formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
                break;
            case 9:
                formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
                break;
            case 10:
                formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                break;
        }
        return formattedRG;
    }

    // Atualiza a máscara do RG sempre que mudar o número de dígitos selecionados
    digitosSelect.on('change', function() {
        rgInput.val(''); // Limpa o campo RG
        atualizarMaxLength(); // Atualiza o maxlength
    });

    // Atualiza a formatação ao digitar no campo RG
    rgInput.on('input', function() {
        let rg = $(this).val();
        $(this).val(formatarRG(rg)); // Aplica a formatação
    });

    // Habilita ou desabilita o campo de prefixo do RG com base no checkbox
    togglePrefixo.on('click', function() {
        prefixoInput.attr('disabled', !this.checked);
        if (!this.checked) prefixoInput.val(''); // Limpa o prefixo se desmarcado
    });

    // Valida o CPF
    $('#cpf').inputmask('999.999.999-99').on('blur', function() {
        if (!validarCPF($(this).val())) {
            alert('CPF inválido!');
            $(this).val('').focus();
        }
    });

    // Validação do CPF (algoritmo)
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    // Carrega os estados no select
    $.ajax({
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
        dataType: "json",
        success: function(data) {
            estadoSelect.empty().append($("<option>", { value: "", text: "Selecione o Estado" }));
            data.forEach(function(val) {
                estadoSelect.append($("<option>", { value: val.sigla, text: val.sigla }));
            });
        },
        error: function() {
            alert("Erro ao carregar estados.");
        }
    });

    // Carrega as cidades conforme o estado selecionado
    estadoSelect.on("change", function() {
        const uf = $(this).val();
        cidadeSelect.empty().append($("<option>", { value: "", text: "Selecione a Cidade" }));
        if (uf) {
            $.ajax({
                url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
                dataType: "json",
                success: function(data) {
                    data.forEach(function(val) {
                        cidadeSelect.append($("<option>", { value: val.nome, text: val.nome }));
                    });
                },
                error: function() {
                    alert("Erro ao carregar cidades.");
                }
            });
        }
    });

    // Envia o formulário e exibe o resultado
    cadastroForm.on('submit', function(event) {
        event.preventDefault();
        const nome = $('#nome').val().toUpperCase();
        const rg = $('#rg').val();
        const cpf = $('#cpf').val();
        const cidade = $('#cidade').val().toUpperCase();
        const estado = $('#estado').val().toUpperCase();

        const resultadoTexto = `${nome} / ${rg} / CERB / ${cidade} / ${estado}`;
        const apelidoTexto = `CLT / ${cpf} / 23.617.076/0001-66`;

        resultadoDiv.text(resultadoTexto.trim());
        apelidoDiv.text(apelidoTexto.trim());
        resultadoModal.css('display', 'block');
    });

    // Fecha o modal
    closeModal.on('click', function() {
        resultadoModal.css('display', 'none');
    });

    // Fecha o modal clicando fora dele
    window.onclick = function(event) {
        if (event.target == resultadoModal[0]) {
            resultadoModal.css('display', 'none');
        }
    };
});
