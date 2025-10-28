// ===============================================
// phoneMask.js
// Aplica máscara de telefone (XX) XXXXX-XXXX em campos de input.
// ===============================================

/**
 * Formata o valor do input de telefone enquanto o usuário digita.
 * Remove caracteres não numéricos e aplica a máscara.
 * @param {Event} e - O evento de input do campo de telefone.
 */
function formatPhone(e) {
    // Remove tudo que não for dígito.
    let value = e.target.value.replace(/\D/g, ''); 
    // Limita o número máximo de dígitos a 11 (considerando celular com 9 dígitos + DDD).
    if (value.length > 11) value = value.substring(0, 11); 

    // Aplica a máscara dinamicamente com base no número de dígitos.
    if (value.length > 6) {
        // Formato (XX) XXXXX-XXXX para celular com 9 dígitos.
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        // Formato (XX) XXXXX para início da digitação do número.
        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) {
        // Formato (XX para início da digitação do DDD.
        value = value.replace(/^(\d*)/, '($1');
    }
    // Atualiza o valor do campo de input com o valor formatado.
    e.target.value = value;
}

// Aplica a máscara a todos os inputs com type="tel" na página.
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os inputs de telefone.
    const phoneInputs = document.querySelectorAll('input[type="tel"]'); 
    // Adiciona o event listener 'input' a cada um deles.
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhone);
        // Define o atributo maxlength para 15 para acomodar a máscara "(XX) XXXXX-XXXX"
        input.setAttribute('maxlength', '15'); 
    });
});