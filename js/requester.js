// ==========================================================
// File: requester.js
// Description: Logic for the Requester Dashboard including request management, 
// notifications, search, filtering, and multi-criteria sorting.
// ==========================================================

// Global variable for requests
let allRequests = [];

// ==========================================================
// 🔔 NOTIFICATION FUNCTIONS
// ==========================================================

/**
 * Marks a specific request's update as seen/read, removes it from the notification
 * list, updates global state and localStorage, and reloads the notifications.
 */
function markNotificationAsRead(rqtId) {
    const index = allRequests.findIndex(r => r.rqtId === rqtId);
    
    if (index !== -1) {
        // Set the last seen date to the latest activity log entry's date
        if (allRequests[index].activityLog && allRequests[index].activityLog.length > 0) {
            const latestLog = allRequests[index].activityLog[allRequests[index].activityLog.length - 1];
            allRequests[index].lastNotificationSeenDate = latestLog.date;
        }
        
        // Update localStorage immediately
        localStorage.setItem('jobRequests', JSON.stringify(allRequests));
        
        // Reload notifications to update the count and list instantly
        loadNotifications(); 
        
        // Ensure dropdown is closed
        const notificationDropdown = document.getElementById('notificationDropdown');
        notificationDropdown.classList.remove('notification-dropdown-visible');
        notificationDropdown.classList.add('notification-dropdown-hidden');
    }
}

/**
 * Loads request status updates into the notification dropdown.
 */
function loadNotifications() {
    const updatedRequests = allRequests.filter(r => {
        if (!r.activityLog || r.activityLog.length === 0) return false;
        const lastSeenDate = new Date(r.lastNotificationSeenDate || '1970-01-01');
        return r.activityLog.some(entry => new Date(entry.date) > lastSeenDate);
    });
    const notificationCount = document.getElementById('notificationCount');
    const notificationList = document.getElementById('notificationList');
    
    notificationCount.textContent = updatedRequests.length;
    
    notificationList.innerHTML = '';
    
    if (updatedRequests.length > 0) {
        updatedRequests.sort((a, b) => {
            const lastUpdateA = new Date(a.activityLog[a.activityLog.length - 1].date);
            const lastUpdateB = new Date(b.activityLog[b.activityLog.length - 1].date);
            return lastUpdateB - lastUpdateA; 
        });

        updatedRequests.forEach(request => {
            const latestLog = request.activityLog[request.activityLog.length - 1]; 

            const item = document.createElement('div');
            item.className = 'notification-item';
            
            item.innerHTML = `
                <p style="margin:0;"><strong>${request.rqtId}</strong>: ${request.title}</p>
                <p style="margin:0; font-size:0.8rem; color:#6b7280;">Status: <strong>${latestLog.status}</strong></p>
            `;
            
            item.style.cursor = 'pointer';
            item.style.padding = '8px';
            
            item.addEventListener('click', function() {
                viewDetails(request.rqtId);
                markNotificationAsRead(request.rqtId);
            });
            
            notificationList.appendChild(item);
        });
    } else {
        notificationList.innerHTML = '<div class="notification-item" style="padding: 8px;">No updates</div>';
    }
}

// ==========================================================
// 📋 REQUEST TABLE & SORTING/FILTERING FUNCTIONS
// ==========================================================

/**
 * Normalizes status variations to a standard form for sorting and filtering.
 * Treats "maintenance completed", "custodian completed", "complete", etc., as "completed".
 */
function normalizeStatus(status) {
    const lower = status.toLowerCase().trim();
    if (lower.includes('completed') || lower === 'complete') {
        return 'completed';
    }
    return lower;
}

/**
 * Custom sort function to sort requests by status priority, and then by date.
 */
function sortByStatusPriority(requests) {
    // Define the order of status priority (lower number = higher priority)
    const statusOrder = {
        'pending': 1,
        'in progress': 2,
        'completed': 3,
    };

    requests.sort((a, b) => {
        // Normalize status for comparison
        const statusA = normalizeStatus(a.status);
        const statusB = normalizeStatus(b.status);
        
        // Get the defined priority, defaulting to a low priority (99) if not found
        const priorityA = statusOrder[statusA] || 99;
        const priorityB = statusOrder[statusB] || 99;

        // 1. Sort by Status Priority
        if (priorityA !== priorityB) {
            return priorityA - priorityB; // Ascending priority (1, 2, 3...)
        }

        // 2. If status is the same, sort by Date (Newest first)
        return new Date(b.date) - new Date(a.date); // Descending date
    });

    return requests;
}

/**
 * Loads and displays requests from localStorage with optional filters and sorting.
 * Filters requests to only show those made by the logged-in user.
 */
function loadRequests(searchTerm = '', statusFilter = '') {
    // 1. Load all data from storage
    const allStoredRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];

    // 2. Get the logged-in user's name to filter requests
    const currentUserEmail = sessionStorage.getItem('currentUserEmail');
    let currentUserName = null;
    if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.email === currentUserEmail);
        currentUserName = currentUser ? currentUser.name : null;
    }

    // 3. Filter requests to only those requested by the logged-in user
    allRequests = allStoredRequests.filter(request => request.requestedBy === currentUserName);

    // --- START: Inject Sample Data if localStorage is empty for testing ---
    if (allStoredRequests.length === 0) {
        const sampleData = [
            { rqtId: 'RQT1765000190438', title: 'Dehumidifier Repair', status: 'Pending', date: '12/6/2025, 1:49:50 PM', lastUpdated: '12/6/2025, 1:49:50 PM', deptHead: 'IT Dept', estimatedCost: 'N/A', description: 'Needs inspection.', items: [{name: 'Inspection', qty: 1, uom: 'unit'}], requestedBy: currentUserName || 'John Doe', activityLog: [], lastNotificationSeenDate: null },
            { rqtId: 'RQT1765000207067', title: 'New Office Chairs', status: 'In Progress', date: '12/6/2025, 1:50:07 PM', lastUpdated: '12/7/2025, 10:00:00 AM', deptHead: 'Finance Head', estimatedCost: '500', description: 'Need three chairs.', items: [{name: 'Chair Ergonomic', qty: 3, uom: 'pcs'}], requestedBy: currentUserName || 'John Doe', activityLog: [
                { user: 'purchasing_staff', date: '12/7/2025, 10:00:00 AM', status: 'In Progress', note: 'Quotation requested.' }
            ], lastNotificationSeenDate: null },
            { rqtId: 'RQT1765000254418', title: 'Light Bulb Replacement', status: 'Completed', date: '12/6/2025, 1:50:54 PM', lastUpdated: '12/7/2025, 3:00:00 PM', deptHead: 'Maintenance', estimatedCost: '10', description: 'Flickering light.', items: [{name: 'Bulb LED', qty: 1, uom: 'pcs'}], requestedBy: currentUserName || 'John Doe', activityLog: [
                { user: 'maintenance_staff', date: '12/7/2025, 3:00:00 PM', status: 'Completed', note: 'Bulb replaced.' }
            ], lastNotificationSeenDate: null },
            { rqtId: 'RQT1765000260000', title: 'Wall Painting', status: 'Pending', date: '12/5/2025, 1:00:00 PM', lastUpdated: '12/5/2025, 1:00:00 PM', deptHead: 'Marketing', estimatedCost: '1200', description: 'Need accent wall painted.', items: [{name: 'Paint', qty: 5, uom: 'liters'}], requestedBy: currentUserName || 'John Doe', activityLog: [], lastNotificationSeenDate: null },
        ];
        allRequests = sampleData.filter(request => request.requestedBy === currentUserName);
        localStorage.setItem('jobRequests', JSON.stringify(sampleData)); 
    }
    // --- END: Inject Sample Data ---

    // Ensure lastNotificationSeenDate is initialized for all requests (for backward compatibility)
    allRequests.forEach(request => {
        if (request.lastNotificationSeenDate === undefined) {
            request.lastNotificationSeenDate = null;
        }
    });

    // 4. Filter requests based on search term and status filter
    let filteredRequests = allRequests.filter(request => {
        const matchesSearch = !searchTerm || 
            request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            request.rqtId.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Normalize status for filtering to recognize "maintenance completed", "custodian completed", etc., as "completed"
        const normalizedRequestStatus = normalizeStatus(request.status);
        const statusFilterLower = statusFilter.toLowerCase();

        const matchesStatus = !statusFilter || statusFilter === 'all' || normalizedRequestStatus === statusFilterLower;
        
        return matchesSearch && matchesStatus;
    });
    
    // 5. Apply Multi-criteria Sort (Status Priority then Date)
    filteredRequests = sortByStatusPriority(filteredRequests);

    // 6. Update the table display
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = '';
    
    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-checkbox" data-rqt-id="${request.rqtId}"></td>
            <td>${request.rqtId}</td>
            <td>${request.title}</td>
            <td>${request.status}</td>
            <td>${request.date}</td>
            <td><button onclick="viewDetails('${request.rqtId}')" class="view-details-btn">View Details</button></td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('totalRequests').textContent = `${filteredRequests.length} total requests`;
    document.getElementById('deleteBtn').style.display = 'none';

    loadNotifications();
}

/**
 * Function to view details in the modal.
 */
function viewDetails(rqtId) {
    const request = allRequests.find(r => r.rqtId === rqtId);
    
    if (request) {
        document.getElementById('modalTitle').textContent = request.title;
        const statusElement = document.getElementById('modalCurrentStatus');
        statusElement.textContent = request.status;
        statusElement.setAttribute('data-status', request.status.toLowerCase().replace(/\s/g, '-')); 
        
        document.getElementById('modalSubmittedDate').textContent = request.date;
        document.getElementById('modalLastUpdated').textContent = request.lastUpdated || request.date;
        document.getElementById('modalDepartmentHead').textContent = request.deptHead || 'N/A';
        document.getElementById('modalEstimatedCost').textContent = request.estimatedCost !== 'N/A' ? `$${request.estimatedCost}` : 'N/A';
        
        const itemsList = request.items ? request.items.map(item => `<li>${item.qty} ${item.uom} of ${item.name}</li>`).join('') : 'No items specified.';
        document.getElementById('modalDescription').innerHTML = `<p><strong>Description:</strong> ${request.description || 'N/A'}</p><h4>Requested Items:</h4><ul>${itemsList}</ul>`;
        
        const activityLogContainer = document.getElementById('activityLog');
        if (request.activityLog && request.activityLog.length > 0) {
            request.activityLog.sort((a, b) => new Date(a.date) - new Date(b.date));

            const logHtml = request.activityLog.map(entry => 
                `<div class="log-item ${entry.status.toLowerCase() === 'completed' ? 'log-item-completed' : ''}">
                    <div class="log-status-tag">${entry.status}</div>
                    <div class="log-details">
                        <p class="log-meta">Update by ${entry.user} on ${entry.date}</p>
                        <p class="log-comment">Note: ${entry.note}</p>
                    </div>
                </div>`
            ).join('');
            activityLogContainer.innerHTML = logHtml;
        } else {
            activityLogContainer.innerHTML = '<p style="font-style: italic; color: #999;">No activity updates yet.</p>';
        }
        
        document.getElementById('viewRequestModal').style.display = 'block';
    }
}

/**
 * Function to delete selected requests
 */
function deleteSelectedRequests() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    if (selectedCheckboxes.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected request(s)? This action cannot be undone.`)) return;
    
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-rqt-id'));
    let storedRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
    storedRequests = storedRequests.filter(request => !selectedIds.includes(request.rqtId));
    localStorage.setItem('jobRequests', JSON.stringify(storedRequests));
    loadRequests();
}

// ==========================================================
// 🧭 NAVIGATION & UTILITY FUNCTIONS 
// ==========================================================

function navigateToAccountSettings() {
    window.location.href = 'AccountSettingsDashboard.html';
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'LoginDashboard.html';
    }
}

function navigateToJobRequestForm() {
    window.location.href = 'JobRequest.html';
}

function closeDialog(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ==========================================================
// ⚙️ EVENT LISTENERS (DOM Ready)
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadRequests(); 
    
    // --- Header Nav Listeners ---
    document.querySelector('.lg1').addEventListener('click', navigateToAccountSettings);
    document.querySelector('.lg2').addEventListener('click', handleLogout);
    document.querySelector('.lg3').addEventListener('click', navigateToJobRequestForm);

    // --- Notification Dropdown Toggle ---
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        loadNotifications(); 

        const isVisible = notificationDropdown.classList.contains('notification-dropdown-visible');
        
        if (isVisible) {
            notificationDropdown.classList.remove('notification-dropdown-visible');
            notificationDropdown.classList.add('notification-dropdown-hidden');
        } else {
            document.getElementById('dropdownMenu').style.display = 'none';
            notificationDropdown.classList.add('notification-dropdown-visible');
            notificationDropdown.classList.remove('notification-dropdown-hidden');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('notification-dropdown-visible');
            notificationDropdown.classList.add('notification-dropdown-hidden');
        }
    });
    
    // --- Search and Filter/Sort Logic ---
    const searchInput = document.getElementById('searchInput');
    let currentStatusFilter = ''; // This variable holds the status used for filtering/sorting
    
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim();
        loadRequests(searchTerm, currentStatusFilter);
    });
    
    // Dropdown toggle for status filter/sort
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.remove('notification-dropdown-visible');
        notificationDropdown.classList.add('notification-dropdown-hidden');

        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Status filter/sort functionality
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // This status selection drives BOTH filtering and sorting
            currentStatusFilter = this.getAttribute('data-status'); 
            const searchTerm = searchInput.value.trim();
            
            loadRequests(searchTerm, currentStatusFilter);
            dropdownMenu.style.display = 'none';
        });
    });
    
    // Close status dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
    
    // --- Selection and Delete Functionality ---
    const tbody = document.getElementById('requestsTableBody');
    const deleteBtn = document.getElementById('deleteBtn');
    
    tbody.addEventListener('change', function(e) {
        if (e.target.classList.contains('select-checkbox')) {
            const anyChecked = document.querySelectorAll('.select-checkbox:checked').length > 0;
            deleteBtn.style.display = anyChecked ? 'block' : 'none';
        }
    });
    
    deleteBtn.addEventListener('click', deleteSelectedRequests);
});
