document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('ritualTableBody');

    // Initial table population
    populateTable(ritualData);

    // Event listener for realtime search
    searchInput.addEventListener('input', handleSearch);

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = ritualData.filter(item => 
            item.ritual.toLowerCase().includes(searchTerm) ||
            item.sacrifice.toLowerCase().includes(searchTerm) ||
            item.result.toLowerCase().includes(searchTerm)
        );

        populateTable(filteredData);
    }

    function populateTable(data) {
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.ritual}</td>
                <td>${item.sacrifice}</td>
                <td>${item.result}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});