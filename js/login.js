// Password toggle functionality
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

// Function to redirect based on selected role
function redirectToDashboard(role) {
    const dashboardUrls = {
        requester: 'RequesterDashboard.html',
        buildingMaintenance: 'BuildingMaintenance.html', // Assuming approver redirects to a specific dashboard
        custodian: 'CustodianDashboard.html',
        purchasing: 'PurchasingDashboard.html'
    };
    
    const url = dashboardUrls[role];
    if (url) {
        window.location.href = url; // Redirect to the respective dashboard
    } else {
        alert('Invalid role selected. Please try again.');
    }
}

// Handle form submission
document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const role = document.getElementById('roleSelect').value;
    redirectToDashboard(role);
});
