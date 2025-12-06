// Function to navigate to Account Settings Dashboard
function navigateToAccountSettings() {
    window.location.href = 'AccountSettingsDashboard.html'; // Adjust path if needed
}

// Function to handle logout with confirmation
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'LoginDashboard.html'; // Adjust path if needed
    }
}

// Function to navigate to Job Request Form Dashboard
function navigateToJobRequestForm() {
    window.location.href = 'JobRequest.html'; // Adjust path if needed
}

// Function to close the modal
function closeDialog(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to load and display requests from localStorage with optional filters
function loadRequests(searchTerm = '', statusFilter = '') {
    const allRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
    
    // Filter requests based on search term and status
    let filteredRequests = allRequests.filter(request => {
        const matchesSearch = !searchTerm || 
            request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            request.rqtId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || request.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-checkbox" data-rqt-id="${request.rqtId}"></td>
            <td>${request.rqtId}</td>
            <td>${request.title}</td>
            <td>${request.status}</td>
            <td>${request.date}</td>
            <td><button onclick="viewDetails('${request.rqtId}')">View Details</button></td>
        `;
        tbody.appendChild(row);
    });

    // Update total requests count (show filtered count)
    document.getElementById('totalRequests').textContent = `${filteredRequests.length} total requests`;
    
    // Hide delete button after reloading (selections are cleared)
    document.getElementById('deleteBtn').style.display = 'none';
}

// Function to view details in the modal
function viewDetails(rqtId) {
    const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
    const request = requests.find(r => r.rqtId === rqtId);

    if (request) {
        document.getElementById('modalTitle').textContent = request.title;
        document.getElementById('modalCurrentStatus').textContent = request.status;
        document.getElementById('modalSubmittedDate').textContent = request.date;
        document.getElementById('modalLastUpdated').textContent = request.date; // Assuming no separate last updated field yet
        document.getElementById('modalDepartmentHead').textContent = request.deptHead;
        document.getElementById('modalEstimatedCost').textContent = request.estimatedCost || 'N/A';

        // Populate description with purpose and items
        const itemsList = request.items.map(item => `${item.name} (${item.qty} ${item.uom})`).join(', ');
        document.getElementById('modalDescription').innerHTML = `<p><strong>Purpose:</strong> ${request.title}</p><p><strong>Items:</strong> ${itemsList}</p>`;

        // Activity log (placeholder for now)
        document.getElementById('activityLog').innerHTML = '<p>No activity updates yet.</p>';

        // Show the modal
        document.getElementById('viewRequestModal').style.display = 'block';
    }
}

// Function to delete selected requests
function deleteSelectedRequests() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    if (selectedCheckboxes.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected request(s)? This action cannot be undone.`)) return;
    
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-rqt-id'));
    let allRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
    
    // Filter out selected requests
    allRequests = allRequests.filter(request => !selectedIds.includes(request.rqtId));
    
    // Save back to localStorage
    localStorage.setItem('jobRequests', JSON.stringify(allRequests));
    
    // Reload the table
    loadRequests();
}

// Event listeners for navigation
document.querySelector('.lg1').addEventListener('click', navigateToAccountSettings);
document.querySelector('.lg2').addEventListener('click', handleLogout);
document.querySelector('.lg3').addEventListener('click', navigateToJobRequestForm);

// Load requests when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadRequests(); // Load all initially
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    let currentStatusFilter = ''; // Track current status filter
    
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim();
        loadRequests(searchTerm, currentStatusFilter);
    });
    
    // Dropdown toggle
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    dropdownBtn.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Status filter functionality
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentStatusFilter = this.getAttribute('data-status');
            const searchTerm = searchInput.value.trim();
            loadRequests(searchTerm, currentStatusFilter);
            dropdownMenu.style.display = 'none'; // Hide menu after selection
        });
    });
    
    // Close dropdown if clicked outside (optional enhancement)
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
    
    // Selection and delete functionality
    const tbody = document.getElementById('requestsTableBody');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Event delegation for checkboxes to show/hide delete button
    tbody.addEventListener('change', function(e) {
        if (e.target.classList.contains('select-checkbox')) {
            const anyChecked = document.querySelectorAll('.select-checkbox:checked').length > 0;
            deleteBtn.style.display = anyChecked ? 'block' : 'none';
        }
    });
    
    // Delete button event listener
    deleteBtn.addEventListener('click', deleteSelectedRequests);
});
