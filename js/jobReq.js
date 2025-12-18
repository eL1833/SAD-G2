document.addEventListener('DOMContentLoaded', function() {
    function autoFillRequesterName() {
        const currentUserEmail = sessionStorage.getItem('currentUserEmail');
        
        if (!currentUserEmail) {
            console.warn('No user logged in. Requester name and department not auto-filled.');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.email === currentUserEmail);
        
        if (currentUser) {
            const requestedByField = document.getElementById('requestedBy');
            if (requestedByField) {
                requestedByField.value = currentUser.name;
                requestedByField.readOnly = true; 
            }
            
            const reqDeptElement = document.getElementById('reqDept');
            if (reqDeptElement && currentUser.department) {
                reqDeptElement.textContent = `Department/Unit: ${currentUser.department}`;
            } else if (reqDeptElement) {
                reqDeptElement.textContent = 'Department/Unit: Unknown'; 
            }
        } else {
            console.error('Logged-in user not found in localStorage.');
        }
    }
    
    autoFillRequesterName();

    const generateRequestCode = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `JR-${year}${month}${day}-${randomNum}`;
    };

    const rqtIdElement = document.getElementById('rqtId');
    if (rqtIdElement) {
        const code = generateRequestCode();
        rqtIdElement.textContent = `Job Requests - ${code}`;
    }

    const addItemBtn = document.querySelector('.btn-add');
    const itemsTableContainer = document.querySelector('.items-table-container');

    if (addItemBtn && itemsTableContainer) {
        addItemBtn.addEventListener('click', function() {
            const existingRows = itemsTableContainer.querySelectorAll('.items-grid1').length;
            const nextNumber = existingRows + 1;

            const newRow = document.createElement('div');
            newRow.className = 'items-grid1';
            newRow.innerHTML = `
                <input type="text" class="input-field" value="${nextNumber}" readonly style="text-align: center;">
                <input type="text" class="input-field" placeholder="Item Name">
                <input type="text" class="input-field" placeholder="Specifications">
                <input type="text" class="input-field" placeholder="Unit of Measure">
                <input type="number" class="input-field" placeholder="Quantity">
                <button type="button" class="delete-btn btn-outline"><i class="fas fa-trash"></i></button>
            `;
            itemsTableContainer.appendChild(newRow);

            newRow.querySelector('.delete-btn').addEventListener('click', function() {
                newRow.remove();
                updateItemNumbers(); 
            });
        });
    }

    const updateItemNumbers = () => {
        const rows = itemsTableContainer.querySelectorAll('.items-grid1');
        rows.forEach((row, index) => {
            const numberInput = row.querySelector('input[type="text"][readonly]');
            if (numberInput) numberInput.value = index + 1;
        });
    };

    const accountBtn = document.querySelector('.lg1');
    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
            window.location.href = 'AccountSettingsDashboard.html';
        });
    }

    document.querySelector('.lg2').addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'LoginDashboard.html';
        }
    });

    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
                window.location.href = 'RequesterDashboard.html'; 
            }
        });
    }

    document.getElementById('submitBtn').addEventListener('click', function() {
        const items = [];
        const itemRows = itemsTableContainer.querySelectorAll('.items-grid1');
        itemRows.forEach(row => {
            const inputs = row.querySelectorAll('input.input-field:not([readonly])');
            if (inputs.length >= 4) {
                const name = inputs[0].value.trim();
                const specs = inputs[1].value.trim();
                const uom = inputs[2].value.trim();
                const qty = inputs[3].value.trim();
                if (name) items.push({ name, specs, uom, qty });
            }
        });
        const purpose = document.getElementById('purpose').value.trim();
        const requestedBy = document.getElementById('requestedBy').value.trim();
        const deptHead = document.getElementById('deptHead').value.trim();
        const notedName = document.getElementById('notedName').value.trim();
        const notedTitle = document.getElementById('notedTitle').value.trim();
        const approvedName = document.getElementById('approvedName').value.trim();
        const approvedTitle = document.getElementById('approvedTitle').value.trim();
        const estimatedCost = document.getElementById('estimatedCost').value.trim();

        const currentUserEmail = sessionStorage.getItem('currentUserEmail');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.email === currentUserEmail);
        const department = currentUser && currentUser.department ? currentUser.department : 'Unknown';

        if (!purpose) {
            alert('Please fill in the Purpose.');
            return;
        }
        if (items.length === 0) {
            alert('Please add and fill in at least one item.');
            return;
        }
        if (!deptHead || !notedName || !notedTitle || !approvedName || !approvedTitle) {
            alert('Please fill in all required fields (Department Head, Noted by, Approved by).');
            return;
        }

        const rqtId = 'RQT' + Date.now();
        const submittedDate = new Date().toLocaleString();

        const request = {
            rqtId,
            title: purpose, 
            status: 'Pending',
            date: submittedDate,
            progress: 'No updates yet',
            details: 'View Details',
            items,
            requestedBy,
            department,  
            deptHead,
            noted: { name: notedName, title: notedTitle },
            approved: { name: approvedName, title: approvedTitle },
            estimatedCost
        };

        const requests = JSON.parse(localStorage.getItem('jobRequests')) || [];
        requests.push(request);
        localStorage.setItem('jobRequests', JSON.stringify(requests));

        if (rqtIdElement) rqtIdElement.textContent = `Job Requests - ${rqtId}`;
        const submittedDateElement = document.getElementById('submittedDate');
        if (submittedDateElement) submittedDateElement.textContent = submittedDate;

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'RequesterDashboard.html';
            }, 2000);
        }
    });

});
