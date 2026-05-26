const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success-message');

const validators = {
    name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Message must be at least 10 characters'
    }
};

function showError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function showSuccess(input) {
    input.classList.add('success');
    input.classList.remove('error');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = ''; 
    }
}

function validateField(input) {
    const validator = validators[input.name];
    if (!validator) return true;

    if (validator.validate(input.value)) {
        showSuccess(input);
        return true;
    } else {
        showError(input, validator.message);
        return false;
    }
}

if (form) {
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                validateField(input);
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);

        if (isNameValid && isEmailValid && isMessageValid) {
            
            console.log('Form submitted successfully:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });

            successMessage.hidden = false;
            
            form.reset();

            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('success', 'error');
            });

            setTimeout(() => {
                successMessage.hidden = true;
            }, 3000);
        }
    });
}