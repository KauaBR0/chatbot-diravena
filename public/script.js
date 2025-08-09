document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerText = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Rola para a mensagem mais recente
    };

    const sendMessage = async () => {
        const question = userInput.value.trim();
        if (!question) return;

        addMessage(question, 'user');
        userInput.value = '';
        sendBtn.disabled = true; // Desabilita o botão para evitar envios duplos

        try {
            const response = await fetch('/perguntar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pergunta: question }),
            });

            if (!response.ok) {
                throw new Error('Erro na resposta do servidor.');
            }

            const data = await response.json();
            addMessage(data.resposta, 'bot');

        } catch (error) {
            console.error('Erro:', error);
            addMessage('Desculpe, não consegui me conectar ao meu cérebro. Tente novamente mais tarde.', 'bot');
        } finally {
            sendBtn.disabled = false; // Habilita o botão novamente
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Mensagem de boas-vindas
    addMessage('Olá! Sou o assistente da Diravena. Como posso ajudar?', 'bot');
});