let allRequests = [];

document.querySelector('.lg1').addEventListener('click', function() {
    window.location.href = 'AccountSettingsDashboard.html';
});

document.querySelector('.lg2').addEventListener('click', function() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'LoginDashboard.html';
    }
});

function deleteSelectedRequests() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    const deleteBtn = document.getElementById('deleteBtn');

    if (selectedCheckboxes.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected request(s)? This action cannot be undone.`)) return;
    
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-rqt-id'));
    
    allRequests = allRequests.filter(request => !selectedIds.includes(request.rqtId));
    
    localStorage.setItem('jobRequests', JSON.stringify(allRequests));
    
    if (deleteBtn) {
        deleteBtn.style.display = 'none'; 
    }
    if (typeof window.loadRequests === 'function') {
        window.loadRequests(); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const requestsTableBody = document.getElementById('requestsTableBody');
    const totalRequestsEl = document.querySelector('.t6');
    const searchInput = document.getElementById('searchInput');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const deleteBtn = document.getElementById('deleteBtn');

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationCount = document.getElementById('notificationCount');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');

    if (notificationDropdown) {
        notificationDropdown.classList.add('notification-dropdown-hidden'); // Start hidden
    }

    let filteredRequests = [];
    let currentStatusFilter = 'all'; 

    const dashboardType = document.querySelector('.t3').textContent.toLowerCase();

    let relevantStatusesForNotifications = [];
    if (dashboardType.includes('maintenance')) {
        relevantStatusesForNotifications = ['pending']; 
    } else if (dashboardType.includes('custodian')) {
        relevantStatusesForNotifications = ['maintenance completed']; 
    } else if (dashboardType.includes('purchasing')) {
        relevantStatusesForNotifications = ['custodian completed']; 
    } else {
        relevantStatusesForNotifications = ['pending']; 
    }

    function updateVisibleDashboards(requests) {
        requests.forEach(request => {
            if (!request.visibleInDashboards) {
                request.visibleInDashboards = ['maintenance']; 
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

    function applyFilters(searchTerm = '', statusFilter = currentStatusFilter) {
        
        const term = searchTerm.toLowerCase().trim();
        
        let baseRequests = filterRequestsByDashboard(allRequests, dashboardType);
        
        filteredRequests = baseRequests.filter(request => {
            
            const matchesSearch = !term || 
                (request.rqtId && request.rqtId.toLowerCase().includes(term)) ||        
                (request.title && request.title.toLowerCase().includes(term)) ||        
                (request.requestedBy && request.requestedBy.toLowerCase().includes(term)) || 
                (request.status && request.status.toLowerCase().includes(term));         
            
            const normalizedRequestStatus = (request.status || '').toLowerCase().replace(/\s+/g, '-');
            const normalizedFilter = statusFilter.toLowerCase().replace(/\s+/g, '-');
            const matchesStatus = normalizedFilter === 'all' || normalizedRequestStatus === normalizedFilter;
            
            return matchesSearch && matchesStatus;
        });

        filteredRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    window.loadRequests = function() {
        allRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        
        if (allRequests.length === 0) {
            const sampleData = [
                { rqtId: 'RQT1765000190438', title: 'Dehumidifier Repair', status: 'Pending', date: '12/6/2025, 1:49:50 PM', requestedBy: 'John Doe', description: 'for equipment maintenance', details: 'View Details', activityLog: [], visibleInDashboards: ['maintenance'] },
                { rqtId: 'RQT1765000207067', title: 'Office Supplies', status: 'Maintenance Completed', date: '12/6/2025, 1:50:07 PM', requestedBy: 'Jane Smith', description: 'New office supplies for Finance Department', details: 'View Details', activityLog: [{ user: 'maintenance_staff', date: '12/7/2025, 1:00:00 PM', status: 'Maintenance Completed', note: 'Repaired and marked complete.' }], visibleInDashboards: ['maintenance', 'custodian'] },
                { rqtId: 'RQT1765000254418', title: 'Light Bulb Replacement', status: 'Custodian Completed', date: '12/7/2025, 10:00:00 AM', requestedBy: 'Mike Johnson', description: 'Flickering light in server room.', details: 'View Details', activityLog: [{ user: 'maintenance_staff', date: '12/7/2025, 3:00:00 PM', status: 'Maintenance Completed', note: 'Bulb replaced.' }, { user: 'custodian_staff', date: '12/8/2025, 2:00:00 PM', status: 'Custodian Completed', note: 'Cleaned up and verified.' }], visibleInDashboards: ['maintenance', 'custodian', 'purchasing'] },
            ];
            allRequests = sampleData;
            localStorage.setItem('jobRequests', JSON.stringify(allRequests)); 
        }

        allRequests.forEach(request => {
            if (request.activityLog && request.activityLog.length > 0) {
                const sortedLog = request.activityLog.sort((a, b) => new Date(b.date) - new Date(a.date));
                if(sortedLog.length > 0) {
                    request.status = sortedLog[0].status; 
                }
            }
        });

        updateVisibleDashboards(allRequests);

        localStorage.setItem('jobRequests', JSON.stringify(allRequests));

        applyFilters(searchInput.value.trim(), currentStatusFilter); 
        renderTable();
        updateTotal();
        updateStatistics(); 
        updateNotifications(); 
    }

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

        if (deleteBtn) {
             deleteBtn.style.display = 'none';
        }
    }

    function updateTotal() {
        totalRequestsEl.textContent = `${allRequests.length} total requests`;
    }

    function updateStatistics() {
        const total = allRequests.length; 
        const inProgress = allRequests.filter(r => (r.status || '').toLowerCase().replace(/\s+/g, '-') === 'in-progress').length;
        
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

        document.querySelectorAll('.c2')[0].textContent = total; 
        document.querySelectorAll('.c2')[1].textContent = inProgress; 
        document.querySelectorAll('.c2')[2].textContent = pending; 
        document.querySelectorAll('.c2')[3].textContent = completed; 
    }

    function updateNotifications() {
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

    function viewDetails(rqtId) {
        window.location.href = `DetailsAndUpdates.html?rqtId=${rqtId}&dashboard=${encodeURIComponent(dashboardType)}`;
    }

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
                notificationCount.textContent = '0';
            }
        });
    }

    window.addEventListener('click', function(e) {
        if (notificationBtn && notificationDropdown && !notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('notification-dropdown-visible');
            notificationDropdown.classList.add('notification-dropdown-hidden');
        }
        
        const container = document.querySelector('.dropdown-container');
        if (container && dropdownMenu && !container.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        applyFilters(searchTerm, currentStatusFilter);
        renderTable();
        updateTotal();
    });

    dropdownBtn.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

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

    requestsTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            const rqtId = e.target.getAttribute('data-rqt-id');
            viewDetails(rqtId);
        }
    });

    requestsTableBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('select-checkbox')) {
            const anyChecked = document.querySelectorAll('.select-checkbox:checked').length > 0;
            if (deleteBtn) {
                deleteBtn.style.display = anyChecked ? 'block' : 'none';
            }
        }
    });
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedRequests);
    }

    window.loadRequests();
});
