async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    const chatBox = document.getElementById('chat-box');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    const userMessageContent = document.createElement('div');
    userMessageContent.className = 'message-content';
    userMessageContent.textContent = userInput;
    userMessage.appendChild(userMessageContent);
    chatBox.appendChild(userMessage);

    document.getElementById('userInput').value = '';

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        const data = await response.json();
        const botResponse = data.response;

        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';
        
        const botImg = document.createElement('img');
        botImg.src = 'toretto01.jpg';
        botImg.alt = 'Dominic Toretto';

        const botMessageContent = document.createElement('div');
        botMessageContent.className = 'message-content';
        botMessageContent.textContent = botResponse;

        botMessage.appendChild(botImg);
        botMessage.appendChild(botMessageContent);
        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
    }
}