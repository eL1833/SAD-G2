// Function to get role badge class and label
function getRoleBadge(role) {
  const colors = {
    requester: 'requester',
    buildingMaintenance: 'maintenance', // Match your role names
    custodian: 'custodian',
    purchasing: 'purchasing'
  };
  const labels = {
    requester: 'Requester',
    buildingMaintenance: 'Maintenance Staff',
    custodian: 'Custodian Staff',
    purchasing: 'Purchasing Staff'
  };
  return { class: colors[role] || '', label: labels[role] || role };
}

// Function to change password (ensures it updates localStorage for login)
function changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd) {
  // Load users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find the current user
  const userIndex = users.findIndex(u => u.email === currentUserEmail);
  if (userIndex === -1) {
    throw new Error('User not found. Please log in again.');
  }
  
  const user = users[userIndex];
  
  // Validate old password
  if (user.password !== oldPwd) {
    throw new Error('Current password is incorrect.');
  }
  
  // Validate new password
  if (newPwd.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }
  
  if (newPwd !== confirmPwd) {
    throw new Error('New passwords do not match.');
  }
  
  // Update password
  user.password = newPwd;
  users[userIndex] = user;
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log('Password updated successfully for user:', currentUserEmail); // Debug log
  return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Get the current user from sessionStorage
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!currentUserEmail) {
    alert('No user logged in. Please log in first.');
    window.location.href = 'LoginDashboard.html'; // Redirect to login
    return;
  }

  // Load users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find the current user
  const user = users.find(u => u.email === currentUserEmail);
  
  if (!user) {
    alert('User not found. Please log in again.');
    sessionStorage.removeItem('currentUserEmail'); // Clear invalid session
    window.location.href = 'LoginDashboard.html';
    return;
  }

  // Populate user data
  document.getElementById('userId').textContent = `user - ${user.id.slice(-10)}`;
  document.getElementById('userNameDept').textContent = `${user.name}, ${user.department || 'N/A'}`;
  document.getElementById('userEmail').textContent = user.email;
  
  const roleBadge = getRoleBadge(user.role);
  const roleElement = document.getElementById('userRole');
  roleElement.className = `badge ${roleBadge.class}`;
  roleElement.textContent = roleBadge.label;
  
  const accessElement = document.getElementById('accessLevel');
  accessElement.className = `badge ${roleBadge.class}`;
  accessElement.textContent = roleBadge.label;

  // Update header with dynamic data
  document.getElementById('headerRole').textContent = roleBadge.label.toLowerCase();


  // Back button (goes back to previous page)
  document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back(); // Navigate to the previous page in browser history
  });

  // Edit button (opens edit modal)
  document.getElementById('editBtn').addEventListener('click', function() {
    // Pre-fill modal with current data
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editDept').value = user.department || '';
    document.getElementById('editModal').classList.add('show');
  });

  // Edit modal cancel
  document.getElementById('editCancelBtn').addEventListener('click', function() {
    document.getElementById('editModal').classList.remove('show');
  });

  // Edit modal save
  document.getElementById('editSaveBtn').addEventListener('click', function() {
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    const newDept = document.getElementById('editDept').value.trim();
    
    if (!newName || !newEmail) {
      alert('Name and email are required.');
      return;
    }
    
    // Update user object
    user.name = newName;
    user.email = newEmail;
    user.department = newDept;
    
    // Save to localStorage
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('currentUserEmail', newEmail); // Update session if email changed
    }
    
    // Update display
    document.getElementById('userNameDept').textContent = `${newName}, ${newDept}`;
    document.getElementById('userEmail').textContent = newEmail;
    document.getElementById('headerName').textContent = newName;
    document.getElementById('headerEmail').textContent = newEmail;
    
    alert('Profile updated successfully!');
    document.getElementById('editModal').classList.remove('show');
  });

  // Change password button
  document.getElementById('changePwdBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.add('show');
  });

  // Cancel button in password modal
  document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.remove('show');
  });

  // Update password button (uses the changePassword function)
  document.getElementById('updateBtn').addEventListener('click', function() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    try {
      changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd);
      alert('Password updated successfully! Please log out and log back in with your new password.');
      document.getElementById('passwordModal').classList.remove('show');
      // Clear inputs
      document.getElementById('oldPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (error) {
      alert(error.message);
    }
  });

  // Log-out button (in header)
  document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('currentUserEmail');
      window.location.href = 'LoginDashboard.html'; // Adjust path if necessary
    }
  });
});
