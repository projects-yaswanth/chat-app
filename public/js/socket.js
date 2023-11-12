const socket = io();
const sendBtn = document.querySelector('.msg--btn');
const messageContainer = document.querySelector('.messages--container');
const myName = document.querySelector('.links');
const friendName = document.querySelector('.friend--name');

const html = (message) => `
      <div class="msg--outer">
        <div class="message--template">
          <p class="message--body">${message}</p>
          <p class="time">9:15</p>
        </div>
      </div>
`;

const mymsgbody = (message) => `
        <div class="msg--outer right--align">
           <div class="message--template right--border">
                <p class="message--body">${message}</p>
                <p class="time">9:15</p>
            </div>
        </div>
`;

const saveMsg = async (message, friend) => {
  try {
    const fetchData = await fetch(`http://127.0.0.1:9000/chats/${friend}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const jsonData = await fetchData.json();
    console.log(jsonData);
  } catch (err) {
    console.log(err.message);
  }
};

socket.on('connect', () => {
  socket.emit('addUser', myName.innerHTML);
});

sendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const messageText = document.querySelector('.msg--input');

  if (messageText.value) {
    socket.emit('send_to_server', {
      messageText: messageText.value,
      friendName: friendName.innerHTML,
      myName: myName.innerHTML,
    });

    messageContainer.insertAdjacentHTML(
      'afterbegin',
      mymsgbody(messageText.value)
    );

    saveMsg(messageText.value, friendName.innerHTML);
  }
  messageText.value = '';
  messageText.focus();
});

socket.on('send_to_client', (message) => {
  messageContainer.insertAdjacentHTML('afterbegin', html(message));
});
