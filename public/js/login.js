const submitBtn = document.querySelector('.btn--submit');
const inner_container = document.querySelector('.inner--box ');

const login = async (email, password) => {
  try {
    const fetchedData = await fetch('https://easy-chat-dg83.onrender.com/api/login', {
      method: 'POST',
      url: 'https://easy-chat-dg83.onrender.com/api/login',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const jsonData = await fetchedData.json();

    if (jsonData.status !== 'failed') {
      // alert('Login successful');
      window.setTimeout(() => {
        location.href = 'https://easy-chat-dg83.onrender.com/';
      }, 1500);
    } else {
      alert(jsonData.message);
      throw new Error(jsonData.message);
    }
  } catch (err) {
    location.href = 'https://easy-chat-dg83.onrender.com/login';
    console.log(err.message);
  }
};

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.querySelectorAll('.inputs')[0].value;
  const password = document.querySelectorAll('.inputs')[1].value;

  login(email, password);
  inner_container.innerHTML = '';
  const spinner = document.createElement('div');
  spinner.classList.add('loader');
  inner_container.appendChild(spinner);
});
