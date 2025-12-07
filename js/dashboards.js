// ==========================================================
// 📋 DASHBOARD SCRIPT START
// ==========================================================

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
// ⚙️ MAIN DASHBOARD LOGIC (DOM Content Loaded)
// Consolidating all functionality here.
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    const requestsTableBody = document.getElementById('requestsTableBody');
    const totalRequestsEl = document.querySelector('.t6'); // Assuming this is the total requests element
    const searchInput = document.getElementById('searchInput');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Global variables for dashboard state
    let allRequests = [];
    let filteredRequests = [];
    let currentStatusFilter = 'all'; // Track current status filter, default to 'all'

    // Detect dashboard type based on the title (for conditional logic if needed)
    const dashboardType = document.querySelector('.t3').textContent.toLowerCase();

    // --- Data Management Functions ---

    // Load requests from localStorage
    function loadRequests() {
        allRequests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        
        // --- START: Inject Sample Data if localStorage is empty for testing ---
        if (allRequests.length === 0) {
            const sampleData = [
                {
                    rqtId: 'RQT1765000190438',
                    title: 'Dehumidifier',
                    status: 'Pending',
                    date: '12/6/2025, 1:49:50 PM',
                    progress: 'No updates yet',
                    details: 'View Details',
                    submitted: '11/2/2025, 2:48:34 PM', 
                    lastUpdated: '11/2/2025, 2:48:34 PM', 
                    deptHead: 'N/A', 
                    estCost: 'N/A', 
                    description: 'for equipment maintenance', 
                    requestedItems: 'Dehumidifier Inspection/Repair',
                    purpose: 'Maintain optimal server room environment.',
                    requestedBy: 'John Doe', // Added for requester column
                    activityLog: [
                        { user: 'leogonzales_buildingmaintenance', date: '11/2/2025, 7:21:27 PM', status: 'Completed', note: 'done' },
                        { user: 'gildajose_custodian', date: '11/2/2025, 7:21:27 PM', status: 'Completed', note: 'done' },
                        { user: 'martincuanco_purchasing', date: '11/2/2025, 7:21:27 PM', status: 'Completed', note: 'done' },
                    ],
                },
                {
                    rqtId: 'RQT1765000207067',
                    title: 'ASDTFGHJ',
                    status: 'In Progress', // Updated to test "in-progress" recognition
                    date: '12/6/2025, 1:50:07 PM',
                    progress: 'No updates yet',
                    details: 'View Details',
                    submitted: '12/6/2025, 1:50:07 PM',
                    lastUpdated: '12/6/2025, 1:50:07 PM',
                    deptHead: 'Finance Head',
                    estCost: '500',
                    description: 'New office supplies for Finance Department',
                    requestedItems: 'Pens, Paper, Staples',
                    purpose: 'Replenish low stock.',
                    requestedBy: 'Jane Smith', // Added for requester column
                    activityLog: [],
                },
            ];
            allRequests = sampleData;
            localStorage.setItem('jobRequests', JSON.stringify(allRequests)); 
        }
        // --- END: Inject Sample Data ---

        applyFilters(); // Apply initial filters (search and status)
        renderTable();
        updateTotal();
        updateStatistics(); // Update cards to reflect pending, in progress, completed counts
    }

    // Apply filters based on search term and status
    function applyFilters(searchTerm = '', statusFilter = currentStatusFilter) {
        filteredRequests = allRequests.filter(request => {
            const matchesSearch = !searchTerm || 
                request.rqtId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                request.description.toLowerCase().includes(searchTerm.toLowerCase());
            // Normalize status for matching (e.g., "In Progress" becomes "in-progress")
            const normalizedStatus = request.status.toLowerCase().replace(' ', '-');
            const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });

        // Sort filtered requests by date (newest first) for better UX
        filteredRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Render table for Building Maintenance Dashboard
    function renderTable() {
        requestsTableBody.innerHTML = '';
        filteredRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.rqtId}</td>
                <td>${request.title}</td>
                <td>${request.requestedBy || 'Unknown'}</td>
                <td>${request.status}</td>
                <td>${request.date}</td>
                <td><button class="view-details-btn" data-rqt-id="${request.rqtId}" style="padding: 5px 10px; border: 1px solid #ccc; background-color: #f9f9f9; border-radius: 4px; cursor: pointer;">${request.details}</button></td>
            `;
            requestsTableBody.appendChild(row);
        });

        // Note: Event listeners are now handled via event delegation below, so no need to add them here
    }

    // Update total count
    function updateTotal() {
        totalRequestsEl.textContent = `${filteredRequests.length} total requests`;
    }

    // Update statistics cards (reflects number of pending, in progress, completed requests)
    function updateStatistics() {
        const total = allRequests.length;
        // Normalize status for counting (e.g., "In Progress" becomes "in-progress")
        const inProgress = allRequests.filter(r => r.status.toLowerCase().replace(' ', '-') === 'in-progress').length;
        const pending = allRequests.filter(r => r.status.toLowerCase() === 'pending').length;
        const completed = allRequests.filter(r => r.status.toLowerCase() === 'completed').length;

        document.querySelectorAll('.c2')[0].textContent = total; // Total Tasks
        document.querySelectorAll('.c2')[1].textContent = inProgress; // In Progress
        document.querySelectorAll('.c2')[2].textContent = pending; // Pending
        document.querySelectorAll('.c2')[3].textContent = completed; // Completed
    }

    // View Details Function (Redirect to details page)
    function viewDetails(rqtId) {
        // Redirect to DetailsAndUpdates.html with request ID and dashboard type
        window.location.href = `DetailsAndUpdates.html?rqtId=${rqtId}&dashboard=${encodeURIComponent(dashboardType)}`;
    }

    // --- Interaction Handlers ---

    // Search functionality - now applies both search and current status filter
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

    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
        const container = document.querySelector('.dropdown-container');
        if (!container.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Filter by status - updates currentStatusFilter and re-applies filters
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

    // Initial load of data when the dashboard loads
    loadRequests();
});
