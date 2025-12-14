// ==========================================================
// 📋 DASHBOARD SCRIPT START
// ==========================================================

// Global variable for requests
let allRequests = [];

// --- Simple UI Handlers (Account, Logout) ---

// Account button functionality (navigates to account settings)
document.querySelector('.lg1').addEventListener('click', function() {
    window.location.href = 'AccountSettingsDashboard.html';
});

// Logout functionality (with confirmation) - Updated to navigate to 'Log-in dashboard'
document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'LoginDashboard.html';
    }
});

// ==========================================================
// 🗑️ DELETE FUNCTIONALITY
// ==========================================================

/**
 * Function to delete selected requests from localStorage.
 * This function is now in the global scope for easier calling.
 */
function deleteSelectedRequests() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    const deleteBtn = document.getElementById('deleteBtn');

    if (selectedCheckboxes.length === 0) return;
    
    // Confirmation dialog
    if (!confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected request(s)? This action cannot be undone.`)) return;
    
    // Extract RQT IDs from selected checkboxes
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-rqt-id'));
    
    // Filter out the selected requests from the global list
    allRequests = allRequests.filter(request => !selectedIds.includes(request.rqtId));
    
    // Save the filtered list back to localStorage
    localStorage.setItem('jobRequests', JSON.stringify(allRequests));
    
    // Reload the dashboard after deletion
    if (deleteBtn) {
        deleteBtn.style.display = 'none'; // Hide the button
    }
    // Reload the table using the function exposed globally
    if (typeof window.loadRequests === 'function') {
        window.loadRequests(); 
    }
}

// ==========================================================
// ⚙️ MAIN DASHBOARD LOGIC (DOM Content Loaded)
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    const requestsTableBody = document.getElementById('requestsTableBody');
    const totalRequestsEl = document.querySelector('.t6');
    const searchInput = document.getElementById('searchInput');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const deleteBtn = document.getElementById('deleteBtn'); // Reference to the delete button

    // Notification elements
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationCount = document.getElementById('notificationCount');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');

    // Setup notification dropdown visibility
    if (notificationDropdown) {
        notificationDropdown.classList.add('notification-dropdown-hidden'); // Start hidden
    }

    // Global variables for dashboard state
    let filteredRequests = [];
    let currentStatusFilter = 'all'; 

    // Detect dashboard type based on the title (for sequential notifications and role-specific statistics)
    const dashboardType = document.querySelector('.t3').textContent.toLowerCase();

    // Define sequential statuses for notifications (workflow guidance)
    let relevantStatusesForNotifications = [];
    if (dashboardType.includes('maintenance')) {
        relevantStatusesForNotifications = ['pending']; // Notify only for new work
    } else if (dashboardType.includes('custodian')) {
        relevantStatusesForNotifications = ['maintenance completed']; // Notify for Maintenance's completions
    } else if (dashboardType.includes('purchasing')) {
        relevantStatusesForNotifications = ['custodian completed']; // Notify for Custodian's completions
    } else {
        relevantStatusesForNotifications = ['pending']; // Fallback notifications
    }

    // --- Data Management Functions ---

    /**
     * Updates the visibleInDashboards array for each request based on its status.
     * - All requests start visible in 'maintenance'.
     * - When status becomes 'maintenance completed', add 'custodian'.
     * - When status becomes 'custodian completed', add 'purchasing'.
     */
    function updateVisibleDashboards(requests) {
        requests.forEach(request => {
            if (!request.visibleInDashboards) {
                request.visibleInDashboards = ['maintenance']; // Default for new requests
            }
            const status = (request.status || '').toLowerCase();
            if (status === 'maintenance completed' && !request.visibleInDashboards.includes('custodian')) {
                request.visibleInDashboards.push('custodian');
            }
            if (status === 'custodian completed' && !request.visibleInDashboards.includes('purchasing')) {
                request.visibleInDashboards.push('purchasing');
            }
        });
    }

    /**
     * Filters requests to only show those visible in the current dashboard.
     * - Maintenance: Show requests visible in 'maintenance'.
     * - Custodian: Show requests visible in 'custodian'.
     * - Purchasing: Show requests visible in 'purchasing'.
     */
    function filterRequestsByDashboard(allRequests, dashboardType) {
        const lowerType = dashboardType.toLowerCase();
        let targetDashboard = 'maintenance';
        if (lowerType.includes('custodian')) {
            targetDashboard = 'custodian';
        } else if (lowerType.includes('purchasing')) {
            targetDashboard = 'purchasing';
        }
        return allRequests.filter(r => r.visibleInDashboards && r.visibleInDashboards.includes(targetDashboard));
    }

    /**
     * Apply filters based on search term and status.
     * Searches across RQT ID, Title, Requester, and Status.
     * Table shows requests visible in the dashboard (filtered by workflow visibility).
     * Status filtering is optional via dropdown.
     */
    function applyFilters(searchTerm = '', statusFilter = currentStatusFilter) {
        
        // Normalize search term for easier comparison
        const term = searchTerm.toLowerCase().trim();
        
        // Start with requests visible in the dashboard
        let baseRequests = filterRequestsByDashboard(allRequests, dashboardType);
        
        filteredRequests = baseRequests.filter(request => {
            
            // CORRECTED SEARCH LOGIC: Check all visible table fields
            const matchesSearch = !term || 
                (request.rqtId && request.rqtId.toLowerCase().includes(term)) ||          // RQT ID
                (request.title && request.title.toLowerCase().includes(term)) ||         // Title
                (request.requestedBy && request.requestedBy.toLowerCase().includes(term)) || // Requester
                (request.status && request.status.toLowerCase().includes(term));           // Status
            
            
            // Status filtering logic (optional, via dropdown)
            const normalizedRequestStatus = (request.status || '').toLowerCase().replace(/\s+/g, '-');
            const normalizedFilter = statusFilter.toLowerCase().replace(/\s+/g, '-');
            const matchesStatus = normalizedFilter === 'all' || normalizedRequestStatus === normalizedFilter;
            
            return matchesSearch && matchesStatus;
        });

        // Sort filtered requests by date (newest first) for better UX
        filteredRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Public function to load, process, filter, and render requests.
     */
    window.loadRequests = function() {
        allRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        
        // --- START: Inject Sample Data if localStorage is empty for testing ---
        if (allRequests.length === 0) {
            const sampleData = [
                { rqtId: 'RQT1765000190438', title: 'Dehumidifier Repair', status: 'Pending', date: '12/6/2025, 1:49:50 PM', requestedBy: 'John Doe', description: 'for equipment maintenance', details: 'View Details', activityLog: [], visibleInDashboards: ['maintenance'] },
                { rqtId: 'RQT1765000207067', title: 'Office Supplies', status: 'Maintenance Completed', date: '12/6/2025, 1:50:07 PM', requestedBy: 'Jane Smith', description: 'New office supplies for Finance Department', details: 'View Details', activityLog: [{ user: 'maintenance_staff', date: '12/7/2025, 1:00:00 PM', status: 'Maintenance Completed', note: 'Repaired and marked complete.' }], visibleInDashboards: ['maintenance', 'custodian'] },
                { rqtId: 'RQT1765000254418', title: 'Light Bulb Replacement', status: 'Custodian Completed', date: '12/7/2025, 10:00:00 AM', requestedBy: 'Mike Johnson', description: 'Flickering light in server room.', details: 'View Details', activityLog: [{ user: 'maintenance_staff', date: '12/7/2025, 3:00:00 PM', status: 'Maintenance Completed', note: 'Bulb replaced.' }, { user: 'custodian_staff', date: '12/8/2025, 2:00:00 PM', status: 'Custodian Completed', note: 'Cleaned up and verified.' }], visibleInDashboards: ['maintenance', 'custodian', 'purchasing'] },
            ];
            allRequests = sampleData;
            localStorage.setItem('jobRequests', JSON.stringify(allRequests)); 
        }
        // --- END: Inject Sample Data ---

        // Update each request's status based on the latest activityLog entry
        allRequests.forEach(request => {
            if (request.activityLog && request.activityLog.length > 0) {
                const sortedLog = request.activityLog.sort((a, b) => new Date(b.date) - new Date(a.date));
                if(sortedLog.length > 0) {
                    request.status = sortedLog[0].status; 
                }
            }
        });

        // Update visibility based on current status
        updateVisibleDashboards(allRequests);

        // Save updated requests back to localStorage
        localStorage.setItem('jobRequests', JSON.stringify(allRequests));

        applyFilters(searchInput.value.trim(), currentStatusFilter); 
        renderTable();
        updateTotal();
        updateStatistics(); 
        updateNotifications(); 
    }

    // Render table, including the checkbox column
    function renderTable() {
        requestsTableBody.innerHTML = '';
        filteredRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="select-checkbox" data-rqt-id="${request.rqtId}"></td> 
                <td>${request.rqtId}</td>
                <td>${request.title}</td>
                <td>${request.requestedBy || 'Unknown'}</td>
                <td>${request.status}</td>
                <td>${request.date}</td>
                <td><button class="view-details-btn" data-rqt-id="${request.rqtId}" style="padding: 5px 10px; border: 1px solid #ccc; background-color: #f9f9f9; border-radius: 4px; cursor: pointer;">${request.details || 'View Details'}</button></td>
            `;
            requestsTableBody.appendChild(row);
        });

        // Hide delete button on table re-render until something is selected
        if (deleteBtn) {
             deleteBtn.style.display = 'none';
        }
    }

    // Update total count (for all requests)
    function updateTotal() {
        totalRequestsEl.textContent = `${allRequests.length} total requests`; // Use allRequests for full count
    }

    // Update statistics cards (role-specific for "Pending" and "Completed", based on all requests)
    function updateStatistics() {
        const total = allRequests.length; // Count all requests
        const inProgress = allRequests.filter(r => (r.status || '').toLowerCase().replace(/\s+/g, '-') === 'in-progress').length;
        
        // Role-specific "Pending" count (includes next-step statuses)
        let pending = 0;
        if (dashboardType.includes('custodian')) {
            pending = allRequests.filter(r => 
                (r.status || '').toLowerCase().replace(/\s+/g, '-') === 'pending' ||
                (r.status || '').toLowerCase().replace(/\s+/g, ' ') === 'maintenance completed'
            ).length;
        } else if (dashboardType.includes('purchasing')) {
            pending = allRequests.filter(r => 
                (r.status || '').toLowerCase().replace(/\s+/g, '-') === 'pending' ||
                (r.status || '').toLowerCase().replace(/\s+/g, ' ') === 'custodian completed'
            ).length;
        } else {
            pending = allRequests.filter(r => (r.status || '').toLowerCase().replace(/\s+/g, '-') === 'pending').length;
        }
        
        // Role-specific "Completed" count
        let completed = 0;
        if (dashboardType.includes('maintenance')) {
            completed = allRequests.filter(r => 
                (r.status || '').toLowerCase().includes('maintenance completed') || 
                (r.status || '').toLowerCase() === 'completed'
            ).length;
        } else if (dashboardType.includes('custodian')) {
            completed = allRequests.filter(r => 
                (r.status || '').toLowerCase().includes('custodian completed') || 
                (r.status || '').toLowerCase() === 'completed'
            ).length;
        } else if (dashboardType.includes('purchasing')) {
            completed = allRequests.filter(r => (r.status || '').toLowerCase() === 'completed').length;
        } else {
            completed = allRequests.filter(r => (r.status || '').toLowerCase().includes('completed')).length;
        }

        document.querySelectorAll('.c2')[0].textContent = total; // Total Tasks (all)
        document.querySelectorAll('.c2')[1].textContent = inProgress; // In Progress
        document.querySelectorAll('.c2')[2].textContent = pending; // Pending (role-specific)
        document.querySelectorAll('.c2')[3].textContent = completed; // Completed (role-specific)
    }

    // Update notifications: Sequential (only for next actionable step)
    function updateNotifications() {
        // Filter notifications by sequential statuses
        const newRequests = allRequests.filter(request => {
            const normalizedStatus = (request.status || '').toLowerCase().replace(/\s+/g, ' ');
            return relevantStatusesForNotifications.includes(normalizedStatus);
        });
        
        notificationCount.textContent = newRequests.length;

        notificationList.innerHTML = '';
        if (newRequests.length > 0) {
            newRequests.forEach(request => {
                const item = document.createElement('div');
                item.className = 'notification-item';
                item.innerHTML = `
                    <strong>${request.rqtId}</strong>: ${request.title} (by ${request.requestedBy || 'Unknown'})
                `;
                item.style.cursor = 'pointer';
                item.style.padding = '8px';
                item.addEventListener('click', function() {
                    viewDetails(request.rqtId);
                    notificationDropdown.classList.remove('notification-dropdown-visible');
                    notificationDropdown.classList.add('notification-dropdown-hidden');
                });
                notificationList.appendChild(item);
            });
        } else {
            notificationList.innerHTML = '<div class="notification-item" style="padding: 8px;">No new requests</div>';
        }
    }

    // View Details Function (Redirect to details page with dashboard context)
    function viewDetails(rqtId) {
        window.location.href = `DetailsAndUpdates.html?rqtId=${rqtId}&dashboard=${encodeURIComponent(dashboardType)}`;
    }

    // --- Interaction Handlers ---

    // Notification button: Toggle dropdown (notifications cleared per dashboard)
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            e.stopPropagation(); 
            const isVisible = notificationDropdown.classList.contains('notification-dropdown-visible');
            if (isVisible) {
                notificationDropdown.classList.remove('notification-dropdown-visible');
                notificationDropdown.classList.add('notification-dropdown-hidden');
            } else {
                notificationDropdown.classList.add('notification-dropdown-visible');
                notificationDropdown.classList.remove('notification-dropdown-hidden');
                // Reset count to 0 when opening (clears for this dashboard only)
                notificationCount.textContent = '0';
            }
        });
    }

    // Close dropdowns when clicking outside
    window.addEventListener('click', function(e) {
        // Notification dropdown
        if (notificationBtn && notificationDropdown && !notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('notification-dropdown-visible');
            notificationDropdown.classList.add('notification-dropdown-hidden');
        }
        
        // Status dropdown
        const container = document.querySelector('.dropdown-container');
        if (container && dropdownMenu && !container.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Search functionality 
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        applyFilters(searchTerm, currentStatusFilter);
        renderTable();
        updateTotal();
    });

    // Dropdown Toggle
    dropdownBtn.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Filter by status (optional, for user control)
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentStatusFilter = this.getAttribute('data-status');
            applyFilters(searchInput.value.trim(), currentStatusFilter);
            renderTable();
            updateTotal();
            dropdownMenu.classList.remove('show');
        });
    });

    // Event delegation for "View Details" buttons
    requestsTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            const rqtId = e.target.getAttribute('data-rqt-id');
            viewDetails(rqtId);
        }
    });
    
    // ✅ Event delegation for checkbox changes to toggle the Delete button
    requestsTableBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('select-checkbox')) {
            const anyChecked = document.querySelectorAll('.select-checkbox:checked').length > 0;
            if (deleteBtn) {
                deleteBtn.style.display = anyChecked ? 'block' : 'none';
            }
        }
    });
    
    // ✅ Listener for Delete button click
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedRequests);
    }

    // Initial load of data when the dashboard loads
    window.loadRequests();
});
