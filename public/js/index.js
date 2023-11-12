const loginbtn = document.querySelector('.login');
const signupbtn = document.querySelector('.signup');
if (window.location.href.endsWith('login')) {
  loginbtn.style.display = 'none';
} else if (window.location.href.endsWith('signup')) {
  signupbtn.style.display = 'none';
}
