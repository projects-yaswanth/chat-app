const createBtn = document.querySelector('.btn--submit');

const inputs = document.querySelectorAll('.inputs');
const inner_container = document.querySelector('.innner--container ');

const signup = async (name, email, password) => {

  try {
    inner_container.innerHTML = '';
    const spinner = document.createElement('div');
    spinner.classList.add('loader');
    inner_container.appendChild(spinner);

    const fetchData = await fetch('http://127.0.0.1:9000/api/signup', {
      method: 'POST',
      url: 'http://127.0.0.1:9000/api/signup',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const jsonData = await fetchData.json();

    if (jsonData.status !== 'failed') {
      alert('Account created successfully ');
      window.location.href = 'http://127.0.0.1:9000/login';
    } else {
      throw new Error(jsonData.message);
    }
  } catch (err) {
    alert(err.message);
    location.href = 'http://127.0.0.1:9000/signup';
    console.log(err.message);
  }
};

createBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const name = inputs[0].value;
  const email = inputs[1].value;
  const password = inputs[2].value;

  signup(name, email, password);
});
