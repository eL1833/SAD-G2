// Simple dropdown toggle script
    document.getElementById('dropdownBtn').addEventListener('click', function() {
      const menu = document.getElementById('dropdownMenu');
      menu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
      const container = document.querySelector('.dropdown-container');
      if (!container.contains(e.target)) {
        document.getElementById('dropdownMenu').classList.remove('show');
      }
    });

    // Handle dropdown item clicks (you can add filtering logic here)
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const status = this.getAttribute('data-status');
        console.log('Selected status:', status); // Replace with actual filtering logic
        document.getElementById('dropdownMenu').classList.remove('show');
      });
    });

    
