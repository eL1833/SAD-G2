// Sample user data (replace with dynamic data if needed)
const user = {
  id: '1234567890abcdef',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'maintenance' // Options: requester, maintenance, custodian, purchasing
};

// Function to get role badge class and label
function getRoleBadge(role) {
  const colors = {
    requester: 'requester',
    maintenance: 'maintenance',
    custodian: 'custodian',
    purchasing: 'purchasing'
  };
  const labels = {
    requester: 'Requester',
    maintenance: 'Maintenance Staff',
    custodian: 'Custodian Staff',
    purchasing: 'Purchasing Staff'
  };
  return { class: colors[role] || '', label: labels[role] || role };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Populate user data
  document.getElementById('userId').textContent = `user - ${user.id.slice(-10)}`;
  document.getElementById('userNameDept').textContent = `${user.name}, Finance`;
  document.getElementById('userEmail').textContent = user.email;
  
  const roleBadge = getRoleBadge(user.role);
  const roleElement = document.getElementById('userRole');
  roleElement.className = `badge ${roleBadge.class}`;
  roleElement.textContent = roleBadge.label;
  
  const accessElement = document.getElementById('accessLevel');
  accessElement.className = `badge ${roleBadge.class}`;
  accessElement.textContent = roleBadge.label;

  // Back button (goes back to previous page)
  document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back(); // Navigate to the previous page in browser history
  });

  // Edit button (opens edit modal)
  document.getElementById('editBtn').addEventListener('click', function() {
    // Pre-fill modal with current data
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editDept').value = 'Finance'; // Assuming department is static; update dynamically if needed
    document.getElementById('editModal').classList.add('show');
  });

  // Edit modal cancel
  document.getElementById('editCancelBtn').addEventListener('click', function() {
    document.getElementById('editModal').classList.remove('show');
  });

  // Edit modal save
  document.getElementById('editSaveBtn').addEventListener('click', function() {
    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;
    const newDept = document.getElementById('editDept').value;
    
    // Simulate update (replace with actual logic/API call)
    user.name = newName;
    user.email = newEmail;
    // Update department if needed (assuming it's part of name display)
    document.getElementById('userNameDept').textContent = `${newName}, ${newDept}`;
    document.getElementById('userEmail').textContent = newEmail;
    
    alert('Profile updated!'); // Replace with success message or redirect
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

  // Update password button
  document.getElementById('updateBtn').addEventListener('click', function() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    if (newPwd !== confirmPwd) {
      alert('New passwords do not match!');
      return;
    }
    
    alert('Password updated!'); // Replace with actual update logic
    document.getElementById('passwordModal').classList.remove('show');
    // Clear inputs
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  });

  // Log-out button (in header)
  document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
      window.location.href = 'LoginDashboard.html'; // Adjust path if necessary
    }
  });
});
