function initializeDefaultAccounts() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const maintenanceUserExists = users.some(u => u.email === "maintenance@example.com");
    if (!maintenanceUserExists) {
        const defaultUsers = [
            {
                id: (Date.now() + 1).toString(),
                name: "John Requester",
                department: "General",
                email: "requester@example.com",
                role: "requester",  
                password: "password123"  
            },
            {
                id: (Date.now() + 2).toString(),
                name: "Jane Maintenance",
                department: "Facilities",
                email: "maintenance@example.com",
                role: "buildingMaintenance",  
                password: "password123"
            },
            {
                id: (Date.now() + 3).toString(),
                name: "Bob Custodian",
                department: "Cleaning",
                email: "custodian@example.com",
                role: "custodian", 
                password: "password123"
            },
            {
                id: (Date.now() + 4).toString(),
                name: "Alice Purchasing",
                department: "Procurement",
                email: "purchasing@example.com",
                role: "purchasing", 
                password: "password123"
            }
        ];
        
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        console.log("Default accounts initialized for all roles.");  
    }
}

initializeDefaultAccounts();

const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const eyeShow = togglePassword.querySelector('.eye-show');
const eyeHide = togglePassword.querySelector('.eye-hide');

togglePassword.addEventListener('click', function (e) {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    if (type === 'password') {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
    } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
    }
});

function redirectToDashboard(role) {
    const dashboardUrls = {
        requester: 'RequesterDashboard.html',
        buildingmaintenance: 'BuildingMaintenance.html',  
        custodian: 'CustodianDashboard.html',
        purchasing: 'PurchasingDashboard.html'
    };
    
    const normalizedRole = role.toLowerCase();
    const url = dashboardUrls[normalizedRole];
    if (url) {
        window.location.href = url; 
    } else {
        alert('Invalid role. Please contact support.');
        console.error('Invalid role detected:', role);  
    }
}

document.getElementById('signinForm').addEventListener('submit', function(e) {
 
    const email = document.getElementById('loginEmail').value.trim();
    const passwordValue = document.getElementById('password').value.trim();
    const selectedRole = document.getElementById('roleSelect').value.trim(); 

    console.log('Form inputs - Email:', email, 'Password:', passwordValue, 'Selected Role:', selectedRole);  

    if (!email || !passwordValue || !selectedRole) {
        alert("Please enter email, password, and select a role.");
        return;  
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    console.log('Loaded users from localStorage:', users); 
    
    const user = users.find(u => u.email === email && u.password === passwordValue);
    console.log('Found user:', user); 
    
    if (user) {
        console.log('User role from localStorage:', user.role, 'Selected role from form:', selectedRole);  
        
       
        if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
            alert("The selected role does not match your account's role. Please select the correct role and try again.");
            console.error('Role mismatch - User role:', user.role, 'Selected:', selectedRole);  
            return;  
        }
        
        sessionStorage.setItem('currentUserEmail', email);
        redirectToDashboard(user.role); 
    } else {
     
        alert("Invalid email or password. Please try again.");
        console.error('Login failed - No user found for email:', email);
    }
});
