// src/scripts/phoneMask.js
function formatPhone(e) {
    // Remove tudo que não é dígito
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (value.length > 11) value = value.substring(0, 11);

    // Evita loop ao apagar tudo
    if (value.length === 0) {
        e.target.value = "";
        return;
    }

    // Aplica formatação progressiva
    if (value.length > 10) {
        // (11) 91234-5678
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        // (11) 1234-5678 (fixo ou incompleto)
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        // (11) 123...
        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else {
        // (11...
        value = value.replace(/^(\d*)/, '($1');
    }

    e.target.value = value;
}

document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhone);
        input.setAttribute('maxlength', '15');
    });
});

// Exporta para uso em outros scripts se necessário
window.formatPhone = formatPhone;
