document.addEventListener('DOMContentLoaded', function() {
    // Generate unique request code
    const generateRequestCode = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `JR-${year}${month}${day}-${randomNum}`;
    };

    // Set request code and current date
    const rqtCodeElement = document.getElementById('rqtCode');
    const currentDateElement = document.getElementById('currentDate');
    if (rqtCodeElement) rqtCodeElement.textContent = generateRequestCode();
    if (currentDateElement) currentDateElement.textContent = new Date().toLocaleDateString();

    // Add Item functionality (updated for div-based grid)
    const addItemBtn = document.querySelector('.btn-add');
    const itemsTableContainer = document.querySelector('.items-table-container');
    let itemCount = 0;

    if (addItemBtn && itemsTableContainer) {
        addItemBtn.addEventListener('click', function() {
            itemCount++;
            const newRow = document.createElement('div');
            newRow.className = 'items-grid1';
            newRow.innerHTML = `
                <input type="text" class="input-field" value="${itemCount}" readonly style="text-align: center;">
                <input type="text" class="input-field" placeholder="Item Name">
                <input type="text" class="input-field" placeholder="Specifications">
                <input type="text" class="input-field" placeholder="Unit of Measure">
                <input type="number" class="input-field" placeholder="Quantity">
                <button type="button" class="delete-btn btn-outline"><i class="fas fa-trash"></i></button>
            `;
            itemsTableContainer.appendChild(newRow);

            // Add delete functionality to the new button
            newRow.querySelector('.delete-btn').addEventListener('click', function() {
                newRow.remove();
                itemCount--;
                updateItemNumbers();
            });
        });
    }

    // Function to update item numbers after deletion
    const updateItemNumbers = () => {
        const rows = itemsTableContainer.querySelectorAll('.items-grid1');
        rows.forEach((row, index) => {
            const numberInput = row.querySelector('input[type="text"][readonly]');
            if (numberInput) numberInput.value = index + 1;
        });
    };

    // Form submission (updated for div-based grid)
    const form1 = document.querySelector('.form1');

    if (form1) {
        form1.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const purpose = document.getElementById('purpose') ? document.getElementById('purpose').value.trim() : '';
            const requestedBy = document.getElementById('requestedBy') ? document.getElementById('requestedBy').value : '';
            const notedByName = document.getElementById('notedByName') ? document.getElementById('notedByName').value.trim() : '';
            const notedByTitle = document.getElementById('notedByTitle') ? document.getElementById('notedByTitle').value.trim() : '';
            const approvedByName = document.getElementById('approvedByName') ? document.getElementById('approvedByName').value.trim() : '';
            const approvedByTitle = document.getElementById('approvedByTitle') ? document.getElementById('approvedByTitle').value.trim() : '';
            const departmentHead = document.getElementById('departmentHead') ? document.getElementById('departmentHead').value.trim() : '';
            const estimatedCost = document.getElementById('estimatedCost') ? document.getElementById('estimatedCost').value.trim() : '';
            
            // Check if at least one item is added
            const itemRows = itemsTableContainer.querySelectorAll('.items-grid1');
            if (itemRows.length === 0) {
                alert('Please add at least one item.');
                return;
            }
            
            // Validate required fields
            if (!purpose || !notedByName || !notedByTitle || !approvedByName || !approvedByTitle || !departmentHead) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Validate items
            let itemsValid = true;
            itemRows.forEach(row => {
                const inputs = row.querySelectorAll('input:not([readonly])');
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        itemsValid = false;
                    }
                });
            });
            if (!itemsValid) {
                alert('Please fill in all item details.');
                return;
            }
            
            // If all good, submit (in a real app, send to server)
            alert('Job request submitted successfully!');
            // Reset form
            form1.reset();
            itemsTableContainer.innerHTML = `
                <div class="items-grid">
                    <div class="grid-header">#</div>
                    <div class="grid-header">Item Name</div>
                    <div class="grid-header">Specifications</div>
                    <div class="grid-header">Unit of Measure</div>
                    <div class="grid-header">Quantity</div>
                </div>
            `;
            itemCount = 0;
            if (rqtCodeElement) rqtCodeElement.textContent = generateRequestCode();
        });
    }

    // Cancel button - Navigate back to Requester Dashboard
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
                window.location.href = 'RequesterDashboard.html'; // Navigate back to Requester Dashboard
            }
        });
    }
});
