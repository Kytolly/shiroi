document.addEventListener('DOMContentLoaded', () => {
  const searchInputInHeader = document.getElementById('search-input');
  const searchIconInHeader = document.querySelector('.header-search-container .search-icon');
  const searchPopOverlay = document.querySelector('.search-pop-overlay');
  const popupSearchInput = document.querySelector('.popup.search-popup .search-input');
  const popupBtnClose = document.querySelector('.popup-btn-close');
  const searchResultsList = document.getElementById('search-results');
  const searchResultIcon = document.querySelector('.search-result-icon');

  if (!searchInputInHeader || !searchIconInHeader || !searchPopOverlay) return;

  let searchData = [];
  let isSearchDataLoaded = false;

  // Function to load search data
  function loadSearchData() {
    if (isSearchDataLoaded) return;

    fetch('/search.xml')
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const entries = data.querySelectorAll('entry');
        searchData = Array.from(entries).map(entry => ({
          title: entry.querySelector('title').textContent,
          content: entry.querySelector('content').textContent,
          url: entry.querySelector('url').textContent
        }));
        isSearchDataLoaded = true;
        if (searchResultIcon) {
          searchResultIcon.style.display = 'none'; // Hide spinner once data is loaded
        }
        // If popup is already active and input has query, perform search immediately
        if (searchPopOverlay.classList.contains('active') && popupSearchInput.value.length > 0) {
          performSearch(popupSearchInput.value);
        }
      })
      .catch(error => {
        console.error('Error fetching search.xml:', error);
        if (searchResultIcon) {
          searchResultIcon.innerHTML = '<p>加载搜索数据失败。</p>'; // Show error message
        }
      });
  }

  // Function to open search popup
  function openSearchPopup() {
    searchPopOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    popupSearchInput.focus();
    loadSearchData(); // Load data when popup opens
  }

  // Function to close search popup
  function closeSearchPopup() {
    searchPopOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
    searchResultsList.innerHTML = ''; // Clear results
    popupSearchInput.value = ''; // Clear input
    if (searchResultIcon) {
      searchResultIcon.style.display = 'block'; // Show spinner again for next open
    }
  }

  // Function to perform search and display results
  function performSearch(query) {
    searchResultsList.innerHTML = '';
    if (query.length === 0) {
      if (searchResultIcon) searchResultIcon.style.display = 'block';
      return;
    }

    if (!isSearchDataLoaded) {
      if (searchResultIcon) searchResultIcon.style.display = 'block';
      return; // Data not loaded yet, show spinner
    }

    if (searchResultIcon) searchResultIcon.style.display = 'none'; // Hide spinner once searching

    const filteredResults = searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = item.content.toLowerCase().includes(query.toLowerCase());
      return titleMatch || contentMatch;
    });

    if (filteredResults.length > 0) {
      filteredResults.forEach(item => {
        const resultItem = document.createElement('a');
        resultItem.href = item.url;
        resultItem.classList.add('search-result-item');
        resultItem.innerHTML = `<h3>${item.title}</h3><p>${item.content.substring(0, 150)}...</p>`;
        searchResultsList.appendChild(resultItem);
      });
    } else {
      searchResultsList.innerHTML = '<p>无结果</p>';
    }
  }

  // Event Listeners
  searchInputInHeader.addEventListener('click', openSearchPopup);
  searchIconInHeader.addEventListener('click', openSearchPopup);
  popupBtnClose.addEventListener('click', closeSearchPopup);

  popupSearchInput.addEventListener('input', function() {
    performSearch(this.value);
  });

  // Close search popup when clicking outside the popup content
  searchPopOverlay.addEventListener('click', (event) => {
    if (event.target === searchPopOverlay) {
      closeSearchPopup();
    }
  });

  // Close search popup on ESC key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchPopOverlay.classList.contains('active')) {
      closeSearchPopup();
    }
  });
}); 