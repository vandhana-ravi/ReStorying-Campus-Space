document.addEventListener('DOMContentLoaded', () => {
    imageMapResize();
    const areas = document.querySelectorAll('map area');
    const popups = document.querySelectorAll('.popup-window');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Lazy-load embeds: only fetch an iframe the first time its popup is opened,
    // and only while it is visible, so heavy apps (KnightLab StoryMap/Timeline)
    // initialize at the correct size. Once loaded it stays cached for instant reopen.
    const loadEmbeds = (popup) => {
        popup.querySelectorAll('iframe[data-src]').forEach(iframe => {
            if (!iframe.getAttribute('src')) {
                iframe.setAttribute('src', iframe.dataset.src);
            }
        });
    };

    // Stop playback of media embeds (YouTube/Vimeo/SoundCloud) by reloading just
    // those iframes. Non-media embeds are left cached so reopening is fast.
    const pauseMedia = (popup) => {
        popup.querySelectorAll('iframe[src]').forEach(iframe => {
            if (/youtube|youtu\.be|vimeo|soundcloud/i.test(iframe.src)) {
                iframe.src = iframe.src;
            }
        });
    };

    areas.forEach(area => {
        area.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const targetId = area.dataset.target; // Get the ID from data-target attribute
            const targetPopup = document.getElementById(targetId);

            if (targetPopup) {
                // Hide all other popups first (optional, but good for single-popup display)
                popups.forEach(popup => popup.style.display = 'none');
                
                targetPopup.style.display = 'flex'; // Show the specific popup
                // Optional: Stop body scrolling when popup is open
                document.body.style.overflow = 'hidden';

                // Load the embed now that the popup is visible (first open only).
                loadEmbeds(targetPopup);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popupWindow = button.closest('.popup-window');
            if (popupWindow) {
                popupWindow.style.display = 'none'; // Hide the popup
                // Optional: Re-enable body scrolling
                document.body.style.overflow = ''; 
                
                // Pause any playing media (YouTube/Vimeo/SoundCloud) in this popup.
                pauseMedia(popupWindow);
            }
        });
    });

    // Close pop-up when clicking outside the content
    popups.forEach(popup => {
        popup.addEventListener('click', (event) => {
            if (event.target === popup) { // Check if click was directly on the background
                popup.style.display = 'none';
                document.body.style.overflow = '';
                pauseMedia(popup);
            }
        });
    });

    // Close pop-up with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            popups.forEach(popup => {
                if (popup.style.display === 'flex') {
                    popup.style.display = 'none';
                    document.body.style.overflow = '';
                    pauseMedia(popup);
                }
            });
        }
    });
});