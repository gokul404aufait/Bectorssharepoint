window.addEventListener('load', function () {
	document.addEventListener('click', (event) => {
		const target = event.target;

		if (!target.matches('.bs-menu-opener')) return;

		const container = target.closest('.bs-menu-parent');
		const button = container.querySelector('.bs-menu-opener');
		const menu = container.querySelector('.bs-menu');
		const menus = document.querySelectorAll('.bs-menu');
		const menusOPeners = document.querySelectorAll('.bs-menu-opener');

		// Hide other menus
		menusOPeners.forEach((opener) => {
			opener.classList.remove('is-active');
		});
		menus.forEach((menu) => {
			menu.classList.remove('bs-menu-is-active', 'bs-menu-on-top', 'bs-menu-on-bottom');
		});

		if (menu.classList.contains('bs-menu-is-active')) {
			// If the menu is already open, close it
			document.body.classList.remove('is-menu-active'); // Enable scrolling on body
			button.classList.remove('is-active');
			menu.classList.remove('bs-menu-is-active');
		} else {
			// Show the menu
			document.body.classList.add('is-menu-active'); // Disable scrolling on body
			button.classList.add('is-active');
			menu.classList.add('bs-menu-is-active');

			const buttonRect = button.getBoundingClientRect();
			const spaceBelow = window.innerHeight - buttonRect.bottom - 10;
			const spaceAbove = buttonRect.top - 10;

			if (spaceBelow >= menu.offsetHeight) {
				// If there is enough space below, align to the bottom
				menu.classList.add('bs-menu-on-bottom');
				menu.style.top = buttonRect.bottom + 10 + 'px';
			} else if (spaceAbove >= menu.offsetHeight) {
				// If there is enough space above, align to the top
				menu.classList.add('bs-menu-on-top');
				menu.style.top = buttonRect.top - menu.offsetHeight - 10 + 'px';
			} else {
				// If there's not enough space at the bottom or the top, hide the menu
				menu.style.top = buttonRect.bottom + 10 + 'px';
			}

			const spaceLeft = buttonRect.left;
			menu.style.left = buttonRect.right - menu.offsetWidth + 'px';

			// If there is enough space on the left side, align to the left
			if (spaceLeft <= menu.offsetWidth) {
				menu.style.left = buttonRect.left + 'px';
			}
		}
	});

	// Close the menu when clicking outside the menu or button
	document.addEventListener('click', (event) => {
		const target = event.target;

		if (!target.classList.contains('bs-menu-opener') && !target.closest('.bs-menu')) {
			const menuContainers = document.querySelectorAll('.bs-menu-parent');
			menuContainers.forEach((container) => {
				container
					.querySelector('.bs-menu')
					.classList.remove('bs-menu-is-active', 'bs-menu-on-top', 'bs-menu-on-bottom');
				container.querySelector('.bs-menu-opener').classList.remove('is-active');
			});
			document.body.classList.remove('is-menu-active'); // Enable scrolling on body
		}
	});

	// Close the menu on scroll
	let isScrolling = false;

	document.querySelector(".bs-tab-wrapper").addEventListener("scroll", function () {
		if (!isScrolling) {
			requestAnimationFrame(() => {
				const menuContainers = document.querySelectorAll('.bs-menu-parent');
				menuContainers.forEach((container) => {
					container
						.querySelector('.bs-menu')
						.classList.remove('bs-menu-is-active', 'bs-menu-on-top', 'bs-menu-on-bottom');
					container.querySelector('.bs-menu-opener').classList.remove('is-active');
				});
				document.body.classList.remove('is-menu-active');

				isScrolling = false;
			});
			isScrolling = true;
		}
	});
	// Close the menu on every scroll event

});
