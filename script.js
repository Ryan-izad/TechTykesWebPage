document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.querySelector('.chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        // Display user message
        const userMessageElement = document.createElement('p');
        userMessageElement.classList.add('user-message');
        userMessageElement.textContent = userMessage;
        chatBox.appendChild(userMessageElement);

        // Simulate AI response (echo for simplicity)
        const aiMessageElement = document.createElement('p');
        aiMessageElement.classList.add('ai-message');
        aiMessageElement.textContent = userMessage;
        chatBox.appendChild(aiMessageElement);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear input
        chatInput.value = '';
    }

    // Function to add a message to the chat box
    function addMessage(sender, text) {
        const messageElement = document.createElement('p');
        messageElement.textContent = text;
        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else if (sender === 'ai') {
            messageElement.classList.add('ai-message');
        }
        chatBox.appendChild(messageElement);
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Add default AI message on load
    addMessage('ai', 'How can I help you?');

    // Card swipe-to-swap functionality
    const cardContainer = document.querySelector('.card-container');
    let cards = Array.from(cardContainer.querySelectorAll('.card'));
    let draggedCard = null;
    let initialMouseX = 0;
    let initialMouseY = 0;
    let initialCardX = 0;
    let initialCardY = 0;

    function getCardCenter(card) {
        const rect = card.getBoundingClientRect();
        return rect.left + rect.width / 2;
    }

    function updateCardOrder() {
        cards.sort((a, b) => getCardCenter(a) - getCardCenter(b));
        cards.forEach(card => cardContainer.appendChild(card)); // Re-append in new order
    }

    function handleDragStart(e) {
        if (e.target.closest('.card')) {
            draggedCard = e.target.closest('.card');
            draggedCard.classList.add('dragging');

            initialMouseX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            initialMouseY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            const rect = draggedCard.getBoundingClientRect();
            initialCardX = rect.left;
            initialCardY = rect.top;

            // Set initial position for dragging
            draggedCard.style.position = 'fixed'; // Use fixed to drag relative to viewport
            draggedCard.style.left = initialCardX + 'px';
            draggedCard.style.top = initialCardY + 'px';
            draggedCard.style.transform = 'none'; // Clear any existing transforms

            // Prevent default drag behavior
            e.preventDefault();
        }
    }

    function handleDragMove(e) {
        if (!draggedCard) return;

        const currentClientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const currentClientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        const deltaX = currentClientX - initialMouseX;
        const deltaY = currentClientY - initialMouseY;

        // Update dragged card position
        draggedCard.style.left = (initialCardX + deltaX) + 'px';
        draggedCard.style.top = (initialCardY + deltaY) + 'px';

        // Optional: Provide visual feedback for potential swap targets
        cards.forEach(card => {
            if (card !== draggedCard) {
                const cardCenter = getCardCenter(card);
                const draggedCardCenter = getCardCenter(draggedCard);
                const distance = Math.abs(cardCenter - draggedCardCenter);
                const swapThreshold = card.offsetWidth / 2; // Swap if dragged card center is within half of target card width

                if (distance < swapThreshold) {
                    card.classList.add('swap-target');
                } else {
                    card.classList.remove('swap-target');
                }
            }
        });
    }

    function handleDragEnd() {
        if (!draggedCard) return;

        draggedCard.classList.remove('dragging');
        draggedCard.style.position = 'static'; // Reset position
        draggedCard.style.left = ''; // Clear inline styles
        draggedCard.style.top = '';
        draggedCard.style.transform = 'none'; // Clear inline styles

        // Remove swap-target class from all cards
        cards.forEach(card => card.classList.remove('swap-target'));

        // Update card order in the DOM based on final horizontal position
        updateCardOrder();

        // Reset dragged card
        draggedCard = null;
    }

    // Add event listeners for mouse and touch events on the card container
    cardContainer.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    cardContainer.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    // Initial arrangement (optional, but good practice)
    updateCardOrder();
}); 