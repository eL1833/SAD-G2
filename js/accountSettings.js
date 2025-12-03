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

  // Back button (simulates onClose)
  document.getElementById('backBtn').addEventListener('click', function() {
    alert('Back to dashboard clicked!'); // Replace with actual navigation logic
  });

  // Edit button (simulates onUpdateProfile)
  document.getElementById('editBtn').addEventListener('click', function() {
    alert('Edit profile clicked!'); // Replace with actual edit logic
  });

  // Change password button
  document.getElementById('changePwdBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.add('show');
  });

  // Cancel button in modal
  document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.remove('show');
  });

  // Update password button (simulates onUpdatePassword)
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
});
