// Cache DOM elements
const globalSearch = document.getElementById('globalSearch');
const cardNumberFilter = document.getElementById('cardNumberFilter');
const cardTypeFilter = document.getElementById('cardTypeFilter');
const typeFilter = document.getElementById('typeFilter');
const levelFilter = document.getElementById('levelFilter');
const atkFilter = document.getElementById('atkFilter');
const defFilter = document.getElementById('defFilter');
const starchipFilter = document.getElementById('starchipFilter');
const tableBody = document.getElementById('tableBody');
const copyAllBtn = document.getElementById('copyAll');
const toggleFiltersBtn = document.getElementById('toggleFilters');
const filterSection = document.getElementById('filterSection');

// Toggle filters visibility
toggleFiltersBtn.addEventListener('click', () => {
    filterSection.style.display = filterSection.style.display === 'none' ? 'grid' : 'none';
    toggleFiltersBtn.textContent = filterSection.style.display === 'none' ? 'Show Filters' : 'Hide Filters';
});

// Populate filters on load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial display state for filter section
    filterSection.style.display = 'none';
    toggleFiltersBtn.textContent = 'Show Filters';
    
    const uniqueValues = {
        'Card Type': new Set(),
        'Type': new Set(),
        'Level': new Set(),
        'ATK': new Set(),
        'DEF': new Set(),
        'Starchip Cost': new Set()
    };

    cardDatabase.forEach(card => {
        uniqueValues['Card Type'].add(card['Card Type']);
        uniqueValues['Type'].add(card['Type']);
        uniqueValues['Level'].add(card['Level']);
        uniqueValues['ATK'].add(card['ATK']);
        uniqueValues['DEF'].add(card['DEF']);
        uniqueValues['Starchip Cost'].add(card['Starchip Cost']);
    });

    // Populate dropdowns
    populateSelect(cardTypeFilter, uniqueValues['Card Type']);
    populateSelect(typeFilter, uniqueValues['Type']);
    populateSelect(levelFilter, uniqueValues['Level']);
    populateSelect(atkFilter, uniqueValues['ATK']);
    populateSelect(defFilter, uniqueValues['DEF']);
    populateSelect(starchipFilter, uniqueValues['Starchip Cost']);

    // Show initial data
    filterAndDisplayData();
});

function populateSelect(select, values) {
    select.innerHTML = '<option value="">All</option>';
    [...values].sort((a, b) => {
        if (a === "-" || b === "-") return 0;
        // Handle numeric sorting for ATK, DEF, and Level
        if (!isNaN(a) && !isNaN(b)) {
            return Number(a) - Number(b);
        }
        // Handle string sorting for other fields
        return String(a).localeCompare(String(b));
    }).forEach(value => {
        if (value !== undefined) {
            const option = new Option(value, value);
            select.add(option);
        }
    });
}

// Normalize search terms
function normalizeSearchTerm(term) {
    return String(term).toLowerCase().replace(/-/g, ' ');
}

// Filter and display data
function filterAndDisplayData() {
    const searchTerm = normalizeSearchTerm(globalSearch.value);
    const cardNumberTerm = cardNumberFilter.value.toLowerCase();
    const cardTypeValue = cardTypeFilter.value;
    const typeValue = typeFilter.value;
    const levelValue = levelFilter.value;
    const atkValue = atkFilter.value;
    const defValue = defFilter.value;
    const starchipValue = starchipFilter.value;

    const filteredData = cardDatabase.filter(card => {
        // Global search across all fields
        const cardString = Object.values(card).join(' ').toLowerCase();
        const normalizedCardString = normalizeSearchTerm(cardString);
        const matchesGlobal = !searchTerm || normalizedCardString.includes(searchTerm);

        // Individual filters
        const matchesCardNumber = !cardNumberTerm || card['Card Number'].toLowerCase().includes(cardNumberTerm);
        const matchesCardType = !cardTypeValue || card['Card Type'] === cardTypeValue;
        const matchesType = !typeValue || card['Type'] === typeValue;
        const matchesLevel = !levelValue || String(card['Level']) === levelValue;
        const matchesAtk = !atkValue || String(card['ATK']) === atkValue;
        const matchesDef = !defValue || String(card['DEF']) === defValue;
        const matchesStarchip = !starchipValue || String(card['Starchip Cost']) === starchipValue;

        return matchesGlobal && matchesCardNumber && matchesCardType && 
               matchesType && matchesLevel && matchesAtk && 
               matchesDef && matchesStarchip;
    });

    renderTable(filteredData);
}

// Render table with data
function renderTable(data) {
    tableBody.innerHTML = '';
    
    data.forEach(card => {
        const tr = document.createElement('tr');
        
        Object.values(card).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value || '';
            td.addEventListener('click', () => copyContent(td, value));
            tr.appendChild(td);
        });
        
        tableBody.appendChild(tr);
    });
}

// Copy content function
function copyContent(element, content) {
    navigator.clipboard.writeText(content).then(() => {
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 1000);
    });
}

// Copy all function
copyAllBtn.addEventListener('click', () => {
    const visibleRows = Array.from(tableBody.querySelectorAll('tr'));
    const content = visibleRows.map(row => {
        return Array.from(row.cells)
            .map(cell => cell.textContent)
            .join('\t');
    }).join('\n');

    navigator.clipboard.writeText(content).then(() => {
        copyAllBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyAllBtn.textContent = 'Copy All';
        }, 1000);
    });
});

// Event listeners with debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedFilter = debounce(filterAndDisplayData, 300);

globalSearch.addEventListener('input', debouncedFilter);
cardNumberFilter.addEventListener('input', debouncedFilter);
cardTypeFilter.addEventListener('change', filterAndDisplayData);
typeFilter.addEventListener('change', filterAndDisplayData);
levelFilter.addEventListener('change', filterAndDisplayData);
atkFilter.addEventListener('change', filterAndDisplayData);
defFilter.addEventListener('change', filterAndDisplayData);
starchipFilter.addEventListener('change', filterAndDisplayData);

