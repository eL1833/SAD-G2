const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const eyeShow = togglePassword.querySelector('.eye-show');
const eyeHide = togglePassword.querySelector('.eye-hide');

togglePassword.addEventListener('click', function (e) {
    // Toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // Toggle the icon visibility
    if (type === 'password') {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
    } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
    }
});

