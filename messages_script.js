// Khởi tạo dữ liệu mẫu cho các cuộc trò chuyện
const chatData = {
    'Dad': {
        avatar: '', // Đường dẫn ảnh sẽ được cập nhật sau
        status: 'online',
        messages: [
            { sender: 'Dad', content: 'How was your day?', time: '20:15' },
            { sender: 'me', content: 'Pretty good, thanks!', time: '20:20' },
            { sender: 'Dad', content: 'Remember to come home early!', time: '20:30' }
        ]
    },
    'Mom': {
        avatar: '', // Đường dẫn ảnh sẽ được cập nhật sau
        status: 'away',
        messages: [
            { sender: 'Mom', content: 'Did you eat lunch?', time: 'Yesterday' },
            { sender: 'me', content: 'Yes, I did', time: 'Yesterday' },
            { sender: 'Mom', content: 'Are you done with your homework...', time: 'Yesterday' }
        ]
    },
    'Brother': {
        avatar: 'brother-avatar.jpg',
        status: 'offline',
        messages: [
            { sender: 'Brother', content: 'Hey can i borrow you some money?', time: '13:26' },
            { sender: 'me', content: 'How much do you need?', time: '13:30' },
            { sender: 'Brother', content: 'About $50', time: '13:31' }
        ]
    },
    'Sister': {
        avatar: 'sister-avatar.jpg',
        status: 'offline',
        messages: [
            { sender: 'Sister', content: 'こんにちは、元気ですか？', time: 'Yesterday' },
            { sender: 'me', content: 'はい、元気です。', time: 'Yesterday' }
        ]
    }
};

// Các elements chính
const mainScreen = document.querySelector('.main-screen');
const chatScreen = document.querySelector('.chat-screen');
const searchScreen = document.querySelector('.search-screen');
const searchIcon = document.querySelector('.search-icon');
const searchBar = document.querySelector('.search-bar input');
const allChats = document.querySelector('.all-chats');

// Hàm để cập nhật avatar
function updateAvatars(dadAvatarUrl, momAvatarUrl) {
    document.getElementById('dad-avatar').src = dadAvatarUrl;
    document.getElementById('dad-avatar-pinned').src = dadAvatarUrl;
    document.getElementById('dad-avatar-chat').src = dadAvatarUrl;
    document.getElementById('mom-avatar').src = momAvatarUrl;
    document.getElementById('mom-avatar-pinned').src = momAvatarUrl;
    chatData.Dad.avatar = dadAvatarUrl;
    chatData.Mom.avatar = momAvatarUrl;
}

// Hàm hiển thị màn hình chat
function showChatScreen(contact) {
    const chatHeader = chatScreen.querySelector('.chat-header .chat-info');
    const chatAvatar = chatScreen.querySelector('.chat-avatar');
    const chatMessages = chatScreen.querySelector('.chat-messages');
    
    // Cập nhật thông tin header
    chatHeader.querySelector('.chat-name').textContent = contact;
    chatHeader.querySelector('.chat-status').textContent = chatData[contact].status;
    chatAvatar.src = chatData[contact].avatar;
    
    // Hiển thị tin nhắn
    chatMessages.innerHTML = '';
    chatData[contact].messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${msg.content}</p>
                <span class="message-time">${msg.time}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    });

    mainScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    searchScreen.classList.add('hidden');
}

// Xử lý tìm kiếm
function handleSearch(searchTerm) {
    const chatItems = document.querySelectorAll('.chat-item');
    let foundResults = false;

    chatItems.forEach(item => {
        const name = item.querySelector('.name')?.textContent || 
                    item.querySelector('span')?.textContent || '';
        
        if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            item.style.display = 'flex';
            foundResults = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Hiển thị thông báo không tìm thấy kết quả
    const noResultsMsg = document.querySelector('.no-results');
    if (!foundResults) {
        if (!noResultsMsg) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.textContent = 'Không tìm thấy kết quả nào';
            allChats.appendChild(message);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Xử lý click vào chat items
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const contact = item.querySelector('.name')?.textContent || 
                          item.querySelector('span')?.textContent;
            showChatScreen(contact);
        });
    });

    // Xử lý nút back
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            mainScreen.classList.remove('hidden');
            chatScreen.classList.add('hidden');
            searchScreen.classList.add('hidden');
        });
    });

    // Xử lý icon search
    searchIcon.addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        searchScreen.classList.remove('hidden');
    });

    // Xử lý thanh tìm kiếm
    searchBar.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Xử lý gửi tin nhắn
    const chatInput = chatScreen.querySelector('.chat-input-container input');
    const sendButton = chatScreen.querySelector('.send-button');

    function sendMessage() {
        const content = chatInput.value.trim();
        if (content) {
            const currentContact = chatScreen.querySelector('.chat-info .chat-name').textContent;
            const newMessage = {
                sender: 'me',
                content: content,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            chatData[currentContact].messages.push(newMessage);
            showChatScreen(currentContact); // Cập nhật lại màn hình chat
            updateLastMessage(currentContact, `You: ${content}`, currentTime);
            chatInput.value = '';
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function updateLastMessage(contact, message, time) {
    // Tìm chat-item tương ứng với contact
    const chatItems = document.querySelectorAll('.chat-item');
    const targetChat = Array.from(chatItems).find(item => 
        item.querySelector('.name').textContent === contact
    );

    if (targetChat) {
        // Cập nhật nội dung tin nhắn cuối
        const lastMessageElement = targetChat.querySelector('.last-message');
        const timeElement = targetChat.querySelector('.time');
        
        // Cập nhật nội dung và thời gian
        lastMessageElement.textContent = message;
        timeElement.textContent = time;

        // Di chuyển chat item lên đầu danh sách
        const allChats = document.querySelector('.all-chats');
        allChats.insertBefore(targetChat, allChats.firstChild);

        // Thêm hiệu ứng highlight
        targetChat.classList.add('message-updated');
        setTimeout(() => {
            targetChat.classList.remove('message-updated');
        }, 1000);
    }
}

// Thêm CSS cho tin nhắn
const style = document.createElement('style');
style.textContent = `
    .message {
        margin: 10px 0;
        max-width: 70%;
    }

    .message.sent {
        margin-left: auto;
    }

    .message.received {
        margin-right: auto;
    }

    .message-content {
        padding: 10px 15px;
        border-radius: 15px;
        background-color: #e0ffff;
    }

    .message.sent .message-content {
        background-color: #4CAF50;
        color: white;
    }

    .message-time {
        font-size: 0.8em;
        color: #666;
        margin-top: 5px;
        display: block;
    }

    .no-results {
        padding: 20px;
        text-align: center;
        color: #666;
    }
`;
document.head.appendChild(style);

// Hàm để cập nhật avatar (sử dụng khi có đường dẫn ảnh)
function setAvatars(dadAvatarUrl, momAvatarUrl) {
    updateAvatars(dadAvatarUrl, momAvatarUrl);
}
