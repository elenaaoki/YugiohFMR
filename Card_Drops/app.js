// DOM Elements
const searchInput = document.getElementById("searchInput")
const showFiltersBtn = document.getElementById("showFilters")
const filtersContainer = document.getElementById("filtersContainer")
const characterSelect = document.getElementById("characterSelect")
const filterCheckboxes = document.querySelectorAll(".filter-checkbox")
const tableWrappers = document.querySelectorAll(".table-wrapper")

// Populate character select
const uniqueCharacters = [...new Set(cardDatabase.map((data) => data.character))]
uniqueCharacters.forEach((character) => {
  const option = document.createElement("option")
  option.value = character
  option.textContent = character
  characterSelect.appendChild(option)
})

// Toggle filters
showFiltersBtn.addEventListener("click", () => {
  filtersContainer.classList.toggle("show")
  showFiltersBtn.textContent = filtersContainer.classList.contains("show") ? "Hide Filters" : "Show Filters"
})

// Copy button functionality
function createCopyButton(text) {
  const btn = document.createElement("button")
  btn.className = "copy-btn"
  btn.textContent = "Copy"
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    btn.textContent = "Copied!"
    setTimeout(() => (btn.textContent = "Copy"), 1000)
  })
  return btn
}

// Normalize search terms
function normalizeText(text) {
  return text.toLowerCase().replace(/[-\s'.,]+/g, "") // Remove spaces, hyphens, apostrophes, periods, and commas
}

// Extract numbers from text
function extractNumbers(text) {
  return text.match(/\d+/g) || []
}

// Check if two strings are similar
function areSimilar(str1, str2) {
  const norm1 = normalizeText(str1)
  const norm2 = normalizeText(str2)
  const numbers1 = extractNumbers(str1)
  const numbers2 = extractNumbers(str2)

  // Check for text similarity
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return true
  }

  // Check for number similarity
  if (numbers1.length > 0 && numbers2.length > 0) {
    return numbers1.some((num1) => numbers2.includes(num1))
  }

  return false
}

// Debounce function
function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// Filter and render tables
function renderTables() {
  const searchTerm = searchInput.value.trim().toLowerCase()
  const selectedCharacter = characterSelect.value

  // Get visible categories from checkboxes
  const visibleCategories = Array.from(filterCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.dataset.type)

  // Update table visibility
  tableWrappers.forEach((wrapper) => {
    wrapper.style.display = visibleCategories.includes(wrapper.dataset.type) ? "block" : "none"
  })

  // Helper function to create table rows
  function createTableRow(character, card, category) {
    if (
      searchTerm &&
      !areSimilar(card.name, searchTerm) &&
      !areSimilar(character, searchTerm) &&
      !areSimilar(card.percentage, searchTerm)
    ) {
      return null
    }

    const row = document.createElement("tr")
    const cells = [
      { text: character, copyText: character },
      { text: card.name, copyText: card.name },
      { text: card.percentage, copyText: card.percentage },
    ]

    cells.forEach(({ text, copyText }) => {
      const td = document.createElement("td")
      td.textContent = text
      td.appendChild(createCopyButton(copyText))
      row.appendChild(td)
    })

    return row
  }

  // Clear all tables
  document.getElementById("saPowTable").innerHTML = ""
  document.getElementById("bcdPowTecTable").innerHTML = ""
  document.getElementById("saTecTable").innerHTML = ""

  // Filter and render data
  cardDatabase.forEach((data) => {
    if (selectedCharacter === "all" || selectedCharacter === data.character) {
      if (visibleCategories.includes("saPow")) {
        const tbody = document.getElementById("saPowTable")
        data.saPow.forEach((card) => {
          const row = createTableRow(data.character, card, "saPow")
          if (row) tbody.appendChild(row)
        })
      }

      if (visibleCategories.includes("bcdPowTec")) {
        const tbody = document.getElementById("bcdPowTecTable")
        data.bcdPowTec.forEach((card) => {
          const row = createTableRow(data.character, card, "bcdPowTec")
          if (row) tbody.appendChild(row)
        })
      }

      if (visibleCategories.includes("saTec")) {
        const tbody = document.getElementById("saTecTable")
        data.saTec.forEach((card) => {
          const row = createTableRow(data.character, card, "saTec")
          if (row) tbody.appendChild(row)
        })
      }
    }
  })
}

// Debounced render function
const debouncedRender = debounce(renderTables, 300)

// Event listeners
searchInput.addEventListener("input", debouncedRender)
characterSelect.addEventListener("change", renderTables)
filterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", renderTables)
})

// Initial render
renderTables()

