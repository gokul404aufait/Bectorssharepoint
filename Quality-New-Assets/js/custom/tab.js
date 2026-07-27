window.addEventListener('load', () => {
	const tabContainers = document.querySelectorAll('.bs-tab-wrapper');

	// Loop through each tab container
	tabContainers.forEach(function (container) {
		const tabItems = container.querySelectorAll('.bs-nav-link');

		// Add event listener to each tab item
		tabItems.forEach(function (item) {
			item.addEventListener('click', function (e) {
				e.preventDefault();
				const targetTab = this.getAttribute('data-tab');
                const tabName = this.innerHTML.trim(); 
                sessionStorage.setItem("tabName", tabName);
				const currentContainer = this.closest('.bs-tab-wrapper');

				// Only proceed if the clicked tab item is not already active
				if (!this.classList.contains('bs-tab-active')) {
					// Remove 'active' class from all tab items within the current container
					currentContainer.querySelectorAll('.bs-nav-link').forEach(function (item) {
						item.classList.remove('bs-tab-active');
					});

					// Add 'active' class to the clicked tab item
					this.classList.add('bs-tab-active');

					// Fade out the current tab pane
					currentContainer.querySelectorAll('.bs-tab-pane').forEach(function (pane) {
						pane.classList.remove('bs-fade-in');
						setTimeout(function () {
							pane.classList.remove('bs-tab-active');

							// Fade in the target tab pane
							if (pane.getAttribute('data-tab') === targetTab) {
								const targetPane = currentContainer.querySelector(`.bs-tab-pane[data-tab="${ targetTab }"]`);
								targetPane.classList.add('bs-tab-active');
								setTimeout(function () {
									targetPane.classList.add('bs-fade-in');
								}, 10);
							}
						}, 300);
					});
				}
			});
		});
	});
});
