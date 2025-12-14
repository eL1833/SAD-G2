// --- Initialize Default Accounts for All 4 Roles ---
function initializeDefaultAccounts() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if the maintenance user exists; if not, initialize defaults (to handle old data)
    const maintenanceUserExists = users.some(u => u.email === "maintenance@example.com");
    if (!maintenanceUserExists) {
        const defaultUsers = [
            {
                id: (Date.now() + 1).toString(),
                name: "John Requester",
                department: "General",
                email: "requester@example.com",  // Matches login email field
                role: "requester",  // Lowercase for consistency
                password: "password123"  // Matches login password field; change in production
            },
            {
                id: (Date.now() + 2).toString(),
                name: "Jane Maintenance",
                department: "Facilities",
                email: "maintenance@example.com",
                role: "buildingMaintenance",  // Lowercase for consistency
                password: "password123"
            },
            {
                id: (Date.now() + 3).toString(),
                name: "Bob Custodian",
                department: "Cleaning",
                email: "custodian@example.com",
                role: "custodian",  // Lowercase for consistency
                password: "password123"
            },
            {
                id: (Date.now() + 4).toString(),
                name: "Alice Purchasing",
                department: "Procurement",
                email: "purchasing@example.com",
                role: "purchasing",  // Lowercase for consistency
                password: "password123"
            }
        ];
        
        // Save defaults to localStorage (this will add missing users without overwriting existing ones)
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        console.log("Default accounts initialized for all roles.");  // Optional: Remove in production
    }
}

// Run initialization when the script loads
initializeDefaultAccounts();

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

// Function to redirect based on authenticated user's role
function redirectToDashboard(role) {
    // Keys are now all lowercase to match normalized role lookup
    const dashboardUrls = {
        requester: 'RequesterDashboard.html',
        buildingmaintenance: 'BuildingMaintenance.html',  // Changed to lowercase to match normalized role
        custodian: 'CustodianDashboard.html',
        purchasing: 'PurchasingDashboard.html'
    };
    
    // Normalize role to lowercase for lookup (applies to all roles)
    const normalizedRole = role.toLowerCase();
    const url = dashboardUrls[normalizedRole];
    if (url) {
        window.location.href = url; // Redirect to the respective dashboard
    } else {
        alert('Invalid role. Please contact support.');
        console.error('Invalid role detected:', role);  // Debug: Log the invalid role
    }
}

// Handle form submission with authentication
document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get values from DOM elements (using .value, not .passwordValue)
    const email = document.getElementById('loginEmail').value.trim();
    const passwordValue = document.getElementById('password').value.trim();
    const selectedRole = document.getElementById('roleSelect').value.trim();  // Selected role from form

    console.log('Form inputs - Email:', email, 'Password:', passwordValue, 'Selected Role:', selectedRole);  // Debug: Log form values

    // Basic validation (check all required fields)
    if (!email || !passwordValue || !selectedRole) {
        alert("Please enter email, password, and select a role.");
        return;  // Stop execution if validation fails
    }

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    console.log('Loaded users from localStorage:', users);  // Debug: Log all users
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === passwordValue);
    console.log('Found user:', user);  // Debug: Log the matched user (or undefined if not found)
    
    if (user) {
        console.log('User role from localStorage:', user.role, 'Selected role from form:', selectedRole);  // Debug: Compare roles
        
        // Check if selected role matches the user's actual role (case-insensitive, applies to all roles)
        if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
            alert("The selected role does not match your account's role. Please select the correct role and try again.");
            console.error('Role mismatch - User role:', user.role, 'Selected:', selectedRole);  // Debug: Log mismatch
            return;  // Stop if mismatch
        }
        
        // Successful login: Store email in sessionStorage and redirect based on role
        sessionStorage.setItem('currentUserEmail', email);
        redirectToDashboard(user.role);  // Redirect only after successful authentication and role match
    } else {
        // Failed login
        alert("Invalid email or password. Please try again.");
        console.error('Login failed - No user found for email:', email);  // Debug: Log failed login
    }
});
