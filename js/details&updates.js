function backToDashboard(dashboardType) {
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

    const requestedItems = document.getElementById('requested-items').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const deptHead = document.getElementById('department-head').value.trim();
    const estCost = document.getElementById('estimated-cost').value.trim();
    const description = document.getElementById('full-description').value.trim();

    request.requestedItems = requestedItems;
    request.purpose = purpose;
    request.deptHead = deptHead;
    request.estCost = estCost;
    request.description = description;
    request.lastUpdated = new Date().toLocaleString();

    localStorage.setItem('jobRequests', JSON.stringify(requests));

    return true; 
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardType = urlParams.get('dashboard') || 'requester dashboard'; 
    const rqtId = urlParams.get('rqtId');

    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            backToDashboard(dashboardType);
        });
    }

    const accountBtn = document.querySelector('.lg1');
    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
            goToAccount();
        });
    }

    const logoutBtn = document.querySelector('.lg2');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logOut();
        });
    }

    if (rqtId) {
        const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        const request = requests.find(r => r.rqtId === rqtId);
        if (request) {
            document.querySelector('.headertitle h2').textContent = `Job Requests - ${request.rqtId}`;
            document.querySelector('.request-meta').textContent = `Requested by: ${request.requestedBy || 'Unknown'}`;
            document.querySelector('.submitted-date').textContent = request.date || 'N/A';

            document.querySelector('.current-status-tag').textContent = request.status;

            const itemNames = request.items ? request.items.map(item => item.name).filter(name => name).join(', ') : '';
            document.getElementById('requested-items').value = itemNames;

            document.getElementById('purpose').value = request.title || '';

            document.getElementById('department-head').value = request.deptHead || '';

            document.getElementById('estimated-cost').value = request.estimatedCost || '';

            document.getElementById('full-description').value = request.title || '';

            document.getElementById('new-status').value = request.status;
        }
    }

    const saveBtn = document.querySelector('.save-button');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const newStatus = document.getElementById('new-status').value;
            const updateNotes = document.getElementById('update-notes').value.trim();

            if (!updateNotes) {
                alert('Please provide update notes.');
                return;
            }

            const dataSaved = saveRequestData(rqtId, dashboardType);
            if (!dataSaved) return;

            const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
            const requestIndex = requests.findIndex(r => r.rqtId === rqtId);
            if (requestIndex === -1) {
                alert('Request not found.');
                return;
            }

            let finalStatus = newStatus; 
            if (newStatus === 'Completed') {
                if (dashboardType.toLowerCase().includes('maintenance')) {
                    finalStatus = 'Maintenance Completed'; 
                } else if (dashboardType.toLowerCase().includes('custodian')) {
                    finalStatus = 'Custodian Completed'; 
                } else if (dashboardType.toLowerCase().includes('purchasing')) {
                    finalStatus = 'Completed'; 
                }
            }

            const request = requests[requestIndex];
            request.status = finalStatus;
            request.lastUpdated = new Date().toLocaleString();
            request.activityLog = request.activityLog || [];
            request.activityLog.push({
                user: dashboardType.replace(' dashboard', '').replace(' ', ''), 
                date: new Date().toLocaleString(),
                status: finalStatus,
                note: updateNotes
            });

            localStorage.setItem('jobRequests', JSON.stringify(requests));

            document.querySelector('.current-status-tag').textContent = finalStatus;

            document.getElementById('update-notes').value = '';

            alert('Request data and status updated successfully!');
            
            let redirectUrl = 'RequesterDashboard.html';
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

    const cancelBtn = document.querySelector('.cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                location.reload();
            }
        });
    }
});
