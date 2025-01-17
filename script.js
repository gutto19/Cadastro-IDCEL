$(document).ready(function () {
    const rgInput = $('#rg');
    const prefixoInput = $('#rg-prefixo');
    const togglePrefixo = $('#toggle-prefixo');
    const posicaoLabel = $('#prefixo-posicao-label');
    const digitosSelect = $('#rg-digits');
    const estadoSelect = $('#estado');
    const cidadeSelect = $('#cidade');
    const resultadoModal = $('#resultadoModal');
    const closeModal = $('#closeModal');
    const resultadoDiv = $('#resultado');
    const apelidoDiv = $('#apelido');
    const cadastroForm = $('#cadastro-form');
    const cpfInput = $('#cpf');

    // Atualiza o máximo de caracteres do RG conforme a quantidade de dígitos selecionada
    function atualizarMaxLength() {
        const digitos = parseInt(digitosSelect.val(), 10);
        let maxLength = digitos;

        // Se o toggle do prefixo estiver ativo, adiciona 3 ao limite
        if (togglePrefixo.is(':checked')) {
            maxLength += 3; // Aumenta o limite de 3 caracteres
        } else if (prefixoInput.val()) {
            maxLength += prefixoInput.val().length; // Adiciona o tamanho do prefixo
        }

        rgInput.attr('maxlength', maxLength); // Atualiza o maxlength do campo RG
    }

    // Formata o RG com base nos dígitos selecionados e o prefixo (se habilitado)
    function formatarRG(rg) {
        const digitos = parseInt(digitosSelect.val(), 10);
        let formattedRG = rg.replace(/\D/g, ''); // Remove tudo que não é número

        // Formata o RG de acordo com o número de dígitos
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

        const prefixo = prefixoInput.val().toUpperCase();
        if (togglePrefixo.is(':checked') && prefixo) {
            if ($('#prefixo-posicao-antes').is(':checked')) {
                return `${prefixo} ${formattedRG}`; // Prefixo antes
            } else {
                return `${formattedRG} ${prefixo}`; // Prefixo depois
            }
        }

        return formattedRG;
    }

    // Atualiza o maxlength do RG sempre que os dígitos forem alterados
    digitosSelect.on('change', function () {
        rgInput.val(''); // Limpa o campo RG
        atualizarMaxLength(); // Atualiza o maxlength
    });

    // Aplica formatação ao RG ao digitar
    rgInput.on('input', function () {
        let rg = $(this).val();
        const maxLength = parseInt(digitosSelect.val(), 10);

        // Impede que o usuário digite mais caracteres do que o selecionado
        if (rg.replace(/\D/g, '').length > maxLength) {
            rg = rg.substring(0, rg.length - 1);
        }

        $(this).val(formatarRG(rg)); // Aplica a formatação
    });

    // Aplica formatação ao CPF ao digitar
    cpfInput.on('input', function () {
        let cpf = $(this).val();
        const maxLength = 14; // CPF tem 14 caracteres com a formatação

        // Impede que o usuário digite mais caracteres do que permitido
        if (cpf.replace(/\D/g, '').length > 11) {
            cpf = cpf.substring(0, cpf.length - 1);
        }

        $(this).val(formatarCPF(cpf)); // Aplica a formatação
    });

    // Permitir apenas letras no prefixo do RG
    prefixoInput.on('input', function () {
        let valor = $(this).val();
        // Substituir qualquer caractere que não seja letra
        valor = valor.replace(/[^A-Za-z]/g, '');
        $(this).val(valor); // Atualizar o valor do campo com apenas letras

        // Atualiza o campo RG enquanto o prefixo é digitado
        if (togglePrefixo.is(':checked')) {
            rgInput.val(formatarRG(rgInput.val())); // Atualiza o RG com prefixo dinâmico
        }
    });

    // Habilita ou desabilita o campo de prefixo do RG com base no checkbox
    togglePrefixo.on('click', function () {
        prefixoInput.attr('disabled', !this.checked);
        $('input[name="prefixo-posicao"]').attr('disabled', !this.checked); // Radio buttons
        posicaoLabel.toggleClass('disabled', !this.checked);

        if (!this.checked) {
            // Limpa o prefixo se desmarcado
            prefixoInput.val('');
            $('#prefixo-posicao-antes').prop('checked', true); // Reseta a posição padrão para "Antes"
            
            // Limpa o campo RG caso o prefixo tenha sido removido
            rgInput.val('');
        }

        atualizarMaxLength(); // Atualiza o maxlength ao desmarcar ou marcar o prefixo
    });

    // Atualiza a posição do prefixo com base nos radio buttons
    $('input[name="prefixo-posicao"]').on('change', function () {
        if ($('#prefixo-posicao-antes').is(':checked')) {
            posicaoLabel.text('Antes');
        } else {
            posicaoLabel.text('Depois');
        }
    });

    // Valida o CPF ao perder o foco
    cpfInput.on('blur', function () {
        const cpfValue = $(this).val();
        if (!validarCPF(cpfValue)) {
            alert('CPF inválido!');
            $(this).val(''); // Limpa o campo
            return; // Permite que o usuário continue digitando
        }
    });

    // Validação do CPF (algoritmo)
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove formatação
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
        success: function (data) {
            estadoSelect.empty().append($("<option>", { value: "", text: "Selecione o Estado" }));
            data.forEach(function (val) {
                estadoSelect.append($("<option>", { value: val.sigla, text: val.sigla }));
            });
        },
        error: function () {
            alert("Erro ao carregar estados.");
        }
    });

    // Carrega as cidades com base no estado selecionado
    estadoSelect.on("change", function () {
        const uf = $(this).val();
        cidadeSelect.empty().append($("<option>", { value: "", text: "Selecione a Cidade" }));
        if (uf) {
            $.ajax({
                url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
                dataType: "json",
                success: function (data) {
                    data.forEach(function (val) {
                        cidadeSelect.append($("<option>", { value: val.nome, text: val.nome }));
                    });
                },
                error: function () {
                    alert("Erro ao carregar cidades.");
                }
            });
        }
    });

    // Envia o formulário e exibe o resultado
    cadastroForm.on('submit', function (event) {
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
    closeModal.on('click', function () {
        resultadoModal.css('display', 'none');
    });

    // Fecha o modal clicando fora dele
    window.onclick = function (event) {
        if (event.target == resultadoModal[0]) {
            resultadoModal.css('display', 'none');
        }
    };
});
