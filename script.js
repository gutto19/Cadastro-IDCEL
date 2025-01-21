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

        if (togglePrefixo.is(':checked') && prefixoInput.val()) {
            maxLength += prefixoInput.val().length + 1; // Adiciona tamanho do prefixo + 1 espaço
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

    // Formata o CPF
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é número
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Limita a 11 dígitos
        }
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Formata CPF
    }

    // Atualiza o campo RG com a formatação correta
    function atualizarRG() {
        let rg = rgInput.val();
        rgInput.val(formatarRG(rg)); // Atualiza o campo RG
    }

    // Restringe a quantidade de caracteres no campo RG
    function validarRG() {
        const digitos = parseInt(digitosSelect.val(), 10);
        const prefixoLength = togglePrefixo.is(':checked') && prefixoInput.val() ? prefixoInput.val().length + 1 : 0;
        const maxLength = digitos + prefixoLength;

        let rg = rgInput.val().replace(/\D/g, ''); // Remove caracteres não numéricos
        if (rg.length > digitos) {
            rg = rg.slice(0, digitos); // Limita ao número exato de dígitos
        }

        rgInput.val(formatarRG(rg));
    }

    // Atualiza a formatação ao alterar os dígitos
    digitosSelect.on('change', function () {
        rgInput.val(''); // Limpa o campo RG
        atualizarMaxLength(); // Atualiza o maxlength
    });

    // Aplica formatação ao RG ao digitar
    rgInput.on('input', function () {
        validarRG(); // Valida o RG
    });

    // Atualiza o RG ao alterar o prefixo
    prefixoInput.on('input', function () {
        let valor = $(this).val().replace(/[^A-Za-z]/g, ''); // Apenas letras
        $(this).val(valor.substring(0, 3)); // Limita o prefixo a no máximo 3 caracteres
        atualizarMaxLength();
        atualizarRG(); // Atualiza o campo RG
    });

    // Atualiza o RG ao mudar a posição do prefixo
    $('input[name="prefixo-posicao"]').on('change', function () {
        atualizarRG(); // Atualiza o campo RG
    });

    // Habilita ou desabilita o campo de prefixo do RG com base no checkbox
    togglePrefixo.on('click', function () {
        prefixoInput.attr('disabled', !this.checked);
        $('input[name="prefixo-posicao"]').attr('disabled', !this.checked);
        posicaoLabel.toggleClass('disabled', !this.checked);

        if (!this.checked) {
            prefixoInput.val(''); // Limpa o prefixo
            $('#prefixo-posicao-antes').prop('checked', true); // Reseta a posição para "Antes"
            rgInput.val(''); // Limpa o campo RG
        }

        atualizarMaxLength(); // Atualiza o maxlength
        atualizarRG(); // Atualiza o campo RG
    });

    // Valida e limita o CPF ao digitar
    cpfInput.on('input', function () {
        let cpf = $(this).val().replace(/\D/g, ''); // Remove qualquer caractere não numérico
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Limita a 11 dígitos
        }
        $(this).val(formatarCPF(cpf)); // Aplica a formatação
    });

    // Validação do CPF (algoritmo)
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove formatação (pontos e hífens)
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

    // Valida o CPF ao perder o foco
    cpfInput.on('blur', function () {
        const cpfValue = $(this).val();
        if (cpfValue.length !== 14 || !validarCPF(cpfValue.replace(/\D/g, ''))) {
            alert('CPF inválido!');
            $(this).val(''); // Limpa o campo
        }
    });

    // Carrega os estados no select
    $.ajax({
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
        dataType: "json",
        success: function (data) {
            // Ordena os estados em ordem crescente (alfabeticamente)
            data.sort(function(a, b) {
                return a.sigla.localeCompare(b.sigla); // Ordenação pela sigla do estado
            });

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

        const nome = $('#nome').val().trim().toUpperCase(); // Converte nome para caixa alta
        const rg = $('#rg').val().trim().toUpperCase(); // Converte rg para caixa alta
        const cpf = $('#cpf').val().trim().toUpperCase(); // Converte cpf para caixa alta

        // Verifica se os campos obrigatórios estão preenchidos
        if (!nome || !rg || !cpf) {
            alert('Por favor, preencha todos os campos obrigatórios: Nome, RG e CPF.');
            return; // Interrompe o envio do formulário
        }

        const cidade = $('#cidade').val().toUpperCase(); // Converte cidade para caixa alta
        const estado = $('#estado').val().toUpperCase(); // Converte estado para caixa alta

        const resultadoTexto = `${nome} / ${rg} / CERB / ${cidade} / ${estado}`;
        const apelidoTexto = `CLT / ${cpf} / 23.617.076/0001-66`;

        resultadoDiv.text(resultadoTexto.trim()); // Exibe o resultado em caixa alta
        apelidoDiv.text(apelidoTexto.trim()); // Exibe o apelido em caixa alta
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

    // Função para copiar a Identificação
    $('#copiar-identificacao').on('click', function () {
        const textoIdentificacao = resultadoDiv.text(); // Obtém o texto da Identificação
        navigator.clipboard.writeText(textoIdentificacao).then(function () {
            alert('Identificação copiada com sucesso!');
        }).catch(function (err) {
            console.error('Erro ao copiar a Identificação: ', err);
            alert('Falha ao copiar a Identificação.');
        });
    });

    // Função para copiar o Apelido
    $('#copiar-apelido').on('click', function () {
        const textoApelido = apelidoDiv.text(); // Obtém o texto do Apelido
        navigator.clipboard.writeText(textoApelido).then(function () {
            alert('Apelido copiado com sucesso!');
        }).catch(function (err) {
            console.error('Erro ao copiar o Apelido: ', err);
            alert('Falha ao copiar o Apelido.');
        });
    });
});
