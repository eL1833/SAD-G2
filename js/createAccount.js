// --- Initialize Default Accounts for All 4 Roles ---
function initializeDefaultAccounts() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Only initialize if no users exist (to avoid duplicates)
    if (users.length === 0) {
        const defaultUsers = [
            {
                id: (Date.now() + 1).toString(),
                name: "John Requester",
                department: "General",
                email: "requester@example.com",
                role: "requester",  // Standardized to lowercase/internal name
                password: "password123"  // Default password; change in production
            },
            {
                id: (Date.now() + 2).toString(),
                name: "Jane Maintenance",
                department: "Facilities",
                email: "maintenance@example.com",
                role: "buildingMaintenance",  // Standardized
                password: "password123"
            },
            {
                id: (Date.now() + 3).toString(),
                name: "Bob Custodian",
                department: "Cleaning",
                email: "custodian@example.com",
                role: "custodian",  // Standardized
                password: "password123"
            },
            {
                id: (Date.now() + 4).toString(),
                name: "Alice Purchasing",
                department: "Procurement",
                email: "purchasing@example.com",
                role: "purchasing",  // Standardized
                password: "password123"
            }
        ];
        
        // Save defaults to localStorage
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        console.log("Default accounts initialized for all roles.");  // Optional: Remove in production
    }
}

// Run initialization when the script loads
initializeDefaultAccounts();

// --- Password Visibility Toggle Feature ---
function handlePasswordToggle(button) {
    // Find the associated password input
    const passwordWrapper = button.parentElement;
    const passwordInput = passwordWrapper.querySelector('.field__input'); 
    
    // Get the icons inside the button
    const eyeShow = button.querySelector('.eye-show');
    const eyeHide = button.querySelector('.eye-hide');

    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the icon visibility based on the new type
    if (type === 'password') {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
    } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
    }
}

// Find all password toggle buttons and attach the listener
document.querySelectorAll('.togglePassword').forEach(toggleButton => {
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        handlePasswordToggle(this);
    });
});

// --- Account Creation Functionality ---
document.getElementById("createAccountForm").addEventListener("submit", function(e) {
    // 1. Form Submission Prevention
    e.preventDefault();

    // 2. Input Collection
    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic required field check (in addition to HTML 'required' attribute)
    if (!name || !department || !email || !role || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    // 3. Validation: Password Length and Match
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please try again.");
        return;
    }
    
    // 4. Data Storage (Saving to localStorage)
    
    // Load existing users or initialize an empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if user already exists
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        alert("An account with this email already exists. Please sign in.");
        return;
    }

    // Add new user object (matches default structure for full functionality)
    users.push({
        id: Date.now().toString(),  // Unique ID
        name,
        department,
        email,
        role,  // Already in internal format (e.g., "buildingMaintenance")
        password
    });

    // Save updated user list
    localStorage.setItem("users", JSON.stringify(users));

    // 5. Success Feedback and Redirect
    alert(`Account for ${name} created successfully! You can now sign in.`);
    window.location.href = "LoginDashboard.html";
});
