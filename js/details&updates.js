// Reusable functions for buttons
function backToDashboard(dashboardType) {
    // Simply go back to the previous page in history (the dashboard the user came from)
    window.history.back();
}

function goToAccount() {
    window.location.href = 'AccountSettingsDashboard.html';
}

function logOut() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'Log-in dashboard';
    }
}

// Function to store (save) the request data to localStorage
function saveRequestData(rqtId, dashboardType) {
    if (!rqtId) {
        alert('No request ID found.');
        return false;
    }

    const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
    const requestIndex = requests.findIndex(r => r.rqtId === rqtId);
    if (requestIndex === -1) {
        alert('Request not found.');
        return false;
    }

    const request = requests[requestIndex];

    // Collect data from form fields
    const requestedItems = document.getElementById('requested-items').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const deptHead = document.getElementById('department-head').value.trim();
    const estCost = document.getElementById('estimated-cost').value.trim();
    const description = document.getElementById('full-description').value.trim();

    // Update the request object with the new data
    request.requestedItems = requestedItems;
    request.purpose = purpose;
    request.deptHead = deptHead;
    request.estCost = estCost;
    request.description = description;
    request.lastUpdated = new Date().toLocaleString();

    // Save back to localStorage
    localStorage.setItem('jobRequests', JSON.stringify(requests));

    return true; // Indicate success
}

// Attach event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardType = urlParams.get('dashboard') || 'requester dashboard'; // Default if not provided
    const rqtId = urlParams.get('rqtId');

    // Back to Dashboard button
    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            backToDashboard(dashboardType);
        });
    }

    // Account button
    const accountBtn = document.querySelector('.lg1');
    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
            goToAccount();
        });
    }

    // Log out button
    const logoutBtn = document.querySelector('.lg2');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logOut();
        });
    }

    // Load request details
    if (rqtId) {
        const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        const request = requests.find(r => r.rqtId === rqtId);
        if (request) {
            // Populate header with dynamic data
            document.querySelector('.headertitle h2').textContent = `Job Requests - ${request.rqtId}`;
            document.querySelector('.request-meta').textContent = `Requested by: ${request.requestedBy || 'Unknown'}`;
            document.querySelector('.submitted-date').textContent = request.date || 'N/A';

            // Populate status
            document.querySelector('.current-status-tag').textContent = request.status;

            // Populate form fields, mapping from job request form data
            // requested-items: Join item names from the items array (from form)
            const itemNames = request.items ? request.items.map(item => item.name).filter(name => name).join(', ') : '';
            document.getElementById('requested-items').value = itemNames;

            // purpose: Use the title field from the form (which is the purpose)
            document.getElementById('purpose').value = request.title || '';

            // department-head: Use deptHead from form
            document.getElementById('department-head').value = request.deptHead || '';

            // estimated-cost: Use estimatedCost from form
            document.getElementById('estimated-cost').value = request.estimatedCost || '';

            // full-description: Use title (purpose) as fallback since form doesn't have a separate description
            // If you add a description field to the form, map it here instead
            document.getElementById('full-description').value = request.title || '';

            // Set the select dropdown to current status
            document.getElementById('new-status').value = request.status;
        }
    }

    // Save Update button functionality
    const saveBtn = document.querySelector('.save-button');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const newStatus = document.getElementById('new-status').value;
            const updateNotes = document.getElementById('update-notes').value.trim();

            if (!updateNotes) {
                alert('Please provide update notes.');
                return;
            }

            // First, save the general request data (fields like requested items, purpose, etc.)
            const dataSaved = saveRequestData(rqtId, dashboardType);
            if (!dataSaved) return; // Stop if saving data failed

            const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
            const requestIndex = requests.findIndex(r => r.rqtId === rqtId);
            if (requestIndex === -1) {
                alert('Request not found.');
                return;
            }

            // Determine the final status based on dashboard and newStatus (sequential workflow)
            let finalStatus = newStatus; // Default
            if (newStatus === 'Completed') {
                if (dashboardType.toLowerCase().includes('maintenance')) {
                    finalStatus = 'Maintenance Completed'; // Next step for Custodian
                } else if (dashboardType.toLowerCase().includes('custodian')) {
                    finalStatus = 'Custodian Completed'; // Next step for Purchasing
                } else if (dashboardType.toLowerCase().includes('purchasing')) {
                    finalStatus = 'Completed'; // Final step
                }
            }

            // Update the request with status and activity log
            const request = requests[requestIndex];
            request.status = finalStatus;
            request.lastUpdated = new Date().toLocaleString();
            request.activityLog = request.activityLog || [];
            request.activityLog.push({
                user: dashboardType.replace(' dashboard', '').replace(' ', ''), // e.g., 'buildingmaintenance'
                date: new Date().toLocaleString(),
                status: finalStatus,
                note: updateNotes
            });

            // Save back to localStorage (again, to include the status/log updates)
            localStorage.setItem('jobRequests', JSON.stringify(requests));

            // Update the displayed status
            document.querySelector('.current-status-tag').textContent = finalStatus;

            // Clear the notes field
            document.getElementById('update-notes').value = '';

            // Show success message and redirect
            alert('Request data and status updated successfully!');
            
            // Redirect back to the originating dashboard
            let redirectUrl = 'RequesterDashboard.html'; // Default
            if (dashboardType.toLowerCase().includes('maintenance')) {
                redirectUrl = 'BuildingMaintenance.html';
            } else if (dashboardType.toLowerCase().includes('custodian')) {
                redirectUrl = 'CustodianDashboard.html';
            } else if (dashboardType.toLowerCase().includes('purchasing')) {
                redirectUrl = 'PurchasingDashboard.html';
            }
            window.location.href = redirectUrl;
        });
    }

    // Cancel button (optional - could clear fields or do nothing)
    const cancelBtn = document.querySelector('.cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                // Reload the page to reset fields
                location.reload();
            }
        });
    }
});
