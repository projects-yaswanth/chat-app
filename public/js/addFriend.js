const input = document.querySelector('.inputs');
const container = document.querySelector('.container');
const user = document.querySelector('.card').dataset.user;

const getUsers = async () => {
  let users;
  try {
    const usersData = await fetch('https://easy-chat-dg83.onrender.com/api', {
      method: 'GET',
    });
    users = await usersData.json();
    renderUsers(users.data);
  } catch (err) {
    console.log(err.message);
  }
  let filterData = users.data;
  input.addEventListener('input', (e) => {
    container.innerHTML = '';
    filterData = users.data.filter((doc) => doc.name.startsWith(input.value));
    renderUsers(filterData);
  });
};

const html = (doc) => `
<div class="card">
<div class="user">${doc.name}</div>
<button class="adduser--btn ${doc.name}" data-userId=${doc._id} type="submit">Add User </button> 
</div>
`;

const renderUsers = (users) => {
  const usersMap = users.map((doc) => html(doc)).join(' ');
  container.insertAdjacentHTML('afterbegin', usersMap);
  const addfriendBtn = document.querySelectorAll('.adduser--btn');
  handlefriend(addfriendBtn);
};

getUsers();

///////////////////////////////////////////////////////////////////////////////

const handlefriend = (btns) => {
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sendAddfriendRequest(btn.dataset.userid, btn.classList[1]);
    });
  });
};

const sendAddfriendRequest = async (id, name) => {
  const sendRequest = await fetch(`http://127.0.0.1:9000/api/addfriend/${id}`, {
    method: 'POST',
  });
  const jsonData = await sendRequest.json();
  if (jsonData.status == 'success') {
    if (jsonData.message) alert(`${name} is already in your friend list`);
    else alert(`Added ${name} successfully to your friend list`);
  }
};
