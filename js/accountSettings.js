function getRoleBadge(role) {
  const colors = {
    requester: 'requester',
    buildingMaintenance: 'maintenance', 
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

function changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const userIndex = users.findIndex(u => u.email === currentUserEmail);
  if (userIndex === -1) {
    throw new Error('User not found. Please log in again.');
  }
  
  const user = users[userIndex];
  
  if (user.password !== oldPwd) {
    throw new Error('Current password is incorrect.');
  }
  
  if (newPwd.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }
  
  if (newPwd !== confirmPwd) {
    throw new Error('New passwords do not match.');
  }
  
  user.password = newPwd;
  users[userIndex] = user;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log('Password updated successfully for user:', currentUserEmail); 
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!currentUserEmail) {
    alert('No user logged in. Please log in first.');
    window.location.href = 'LoginDashboard.html'; 
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const user = users.find(u => u.email === currentUserEmail);
  
  if (!user) {
    alert('User not found. Please log in again.');
    sessionStorage.removeItem('currentUserEmail'); 
    window.location.href = 'LoginDashboard.html';
    return;
  }

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

  document.getElementById('headerRole').textContent = roleBadge.label.toLowerCase();

  document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back(); 
  });

  document.getElementById('editBtn').addEventListener('click', function() {
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editDept').value = user.department || '';
    document.getElementById('editModal').classList.add('show');
  });

  document.getElementById('editCancelBtn').addEventListener('click', function() {
    document.getElementById('editModal').classList.remove('show');
  });

  document.getElementById('editSaveBtn').addEventListener('click', function() {
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    const newDept = document.getElementById('editDept').value.trim();
    
    if (!newName || !newEmail) {
      alert('Name and email are required.');
      return;
    }
    
    user.name = newName;
    user.email = newEmail;
    user.department = newDept;
    
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('currentUserEmail', newEmail); 
    }
    
    document.getElementById('userNameDept').textContent = `${newName}, ${newDept}`;
    document.getElementById('userEmail').textContent = newEmail;
    document.getElementById('headerName').textContent = newName;
    document.getElementById('headerEmail').textContent = newEmail;
    
    alert('Profile updated successfully!');
    document.getElementById('editModal').classList.remove('show');
  });

  document.getElementById('changePwdBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.add('show');
  });

  document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.remove('show');
  });

  document.getElementById('updateBtn').addEventListener('click', function() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    try {
      changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd);
      alert('Password updated successfully! Please log out and log back in with your new password.');
      document.getElementById('passwordModal').classList.remove('show');
      document.getElementById('oldPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('currentUserEmail');
      window.location.href = 'LoginDashboard.html'; 
    }
  });
});function getRoleBadge(role) {
  const colors = {
    requester: 'requester',
    buildingMaintenance: 'maintenance', 
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

function changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const userIndex = users.findIndex(u => u.email === currentUserEmail);
  if (userIndex === -1) {
    throw new Error('User not found. Please log in again.');
  }
  
  const user = users[userIndex];
  
  if (user.password !== oldPwd) {
    throw new Error('Current password is incorrect.');
  }
  
  if (newPwd.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }
  
  if (newPwd !== confirmPwd) {
    throw new Error('New passwords do not match.');
  }
  
  user.password = newPwd;
  users[userIndex] = user;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log('Password updated successfully for user:', currentUserEmail); 
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!currentUserEmail) {
    alert('No user logged in. Please log in first.');
    window.location.href = 'LoginDashboard.html'; 
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const user = users.find(u => u.email === currentUserEmail);
  
  if (!user) {
    alert('User not found. Please log in again.');
    sessionStorage.removeItem('currentUserEmail'); 
    window.location.href = 'LoginDashboard.html';
    return;
  }

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

  document.getElementById('headerRole').textContent = roleBadge.label.toLowerCase();

  document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back(); 
  });

  document.getElementById('editBtn').addEventListener('click', function() {
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editDept').value = user.department || '';
    document.getElementById('editModal').classList.add('show');
  });

  document.getElementById('editCancelBtn').addEventListener('click', function() {
    document.getElementById('editModal').classList.remove('show');
  });

  document.getElementById('editSaveBtn').addEventListener('click', function() {
    const newName = document.getElementById('editName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    const newDept = document.getElementById('editDept').value.trim();
    
    if (!newName || !newEmail) {
      alert('Name and email are required.');
      return;
    }
    
    user.name = newName;
    user.email = newEmail;
    user.department = newDept;
    
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('currentUserEmail', newEmail); 
    }
    
    document.getElementById('userNameDept').textContent = `${newName}, ${newDept}`;
    document.getElementById('userEmail').textContent = newEmail;
    document.getElementById('headerName').textContent = newName;
    document.getElementById('headerEmail').textContent = newEmail;
    
    alert('Profile updated successfully!');
    document.getElementById('editModal').classList.remove('show');
  });

  document.getElementById('changePwdBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.add('show');
  });

  document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').classList.remove('show');
  });

  document.getElementById('updateBtn').addEventListener('click', function() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    try {
      changePassword(currentUserEmail, oldPwd, newPwd, confirmPwd);
      alert('Password updated successfully! Please log out and log back in with your new password.');
      document.getElementById('passwordModal').classList.remove('show');
      document.getElementById('oldPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('currentUserEmail');
      window.location.href = 'LoginDashboard.html'; 
    }
  });
});
