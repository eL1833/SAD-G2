function initializeDefaultAccounts() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.length === 0) {
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

function handlePasswordToggle(button) {
    const passwordWrapper = button.parentElement;
    const passwordInput = passwordWrapper.querySelector('.field__input'); 
    
    const eyeShow = button.querySelector('.eye-show');
    const eyeHide = button.querySelector('.eye-hide');

    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'password') {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
    } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
    }
}

document.querySelectorAll('.togglePassword').forEach(toggleButton => {
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        handlePasswordToggle(this);
    });
});

document.getElementById("createAccountForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !department || !email || !role || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please try again.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        alert("An account with this email already exists. Please sign in.");
        return;
    }

    users.push({
        id: Date.now().toString(),  
        name,
        department,
        email,
        role, 
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert(`Account for ${name} created successfully! You can now sign in.`);
    window.location.href = "LoginDashboard.html";
});function initializeDefaultAccounts() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.length === 0) {
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

function handlePasswordToggle(button) {
    const passwordWrapper = button.parentElement;
    const passwordInput = passwordWrapper.querySelector('.field__input'); 
    
    const eyeShow = button.querySelector('.eye-show');
    const eyeHide = button.querySelector('.eye-hide');

    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'password') {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
    } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
    }
}

document.querySelectorAll('.togglePassword').forEach(toggleButton => {
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        handlePasswordToggle(this);
    });
});

document.getElementById("createAccountForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !department || !email || !role || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please try again.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        alert("An account with this email already exists. Please sign in.");
        return;
    }

    users.push({
        id: Date.now().toString(),  
        name,
        department,
        email,
        role, 
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert(`Account for ${name} created successfully! You can now sign in.`);
    window.location.href = "LoginDashboard.html";
});
