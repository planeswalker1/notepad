console.log('main.min.js ran');
var loginForm = document.querySelector('.form--login');
var modal = document.querySelector('.modal');
var inputs = Array.from(document.querySelectorAll('input'));

// close modal if clicked outside
modal.addEventListener('click', function(event) {
  event.stopPropagation();
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// clear border on input focus
inputs.forEach(function (input) {
  input.addEventListener('focus',function () {
    clearError(this);
  });
});

loginForm.addEventListener('submit', processLogin);

function processLogin (event) {
  event.preventDefault();
  var email = loginForm.email.value;
  var password = loginForm.hash.value;
  console.log('validating inputs');
  // validate input
  var errorMessage = '';
  if (!validateEmail()) {
    error(loginForm.email);
    errorMessage += 'Missing email';
  }
  if (!validatePassword()) {
    error(loginForm.hash);
    if (errorMessage){
      errorMessage += '<br> Missing password';
    } else {
      errorMessage += 'Missing password';
    }
  }
  console.log(errorMessage);
  if (errorMessage) {
    displayError(errorMessage);
    return;
  }

  console.log('sending request');
  var userData = {
    email: email,
    hash: password
  };

  // request
  // what do i want to do
  // make a request to send information to back end server to eventualy validate and login a user

  fetch('/login', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(userData)
  })
  .then(function(res) {
    if (!res.ok) return alert('Error :(((');
    modal.style.display = 'block';
  }).catch(function (err) {
    alert('There was a server error');
  });
}

function validateEmail () {
  var emailInput = loginForm.email;
  // http://emailregex.com/
  var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
  return isValid;
}

function validatePassword () {
  var passwordInput = loginForm.hash;
  var isValid;
  if (passwordInput.value === '') {
      isValid = false;
  } else {
      isValid = true;
  }
  return isValid;
}

function error (target) {
  target.style.border = '3px solid #f00';
}

function clearError (target) {
  target.style.border = '';
}

function displayError(message) {
  var errorDiv = document.querySelector('.error-message');
  errorDiv.innerHTML = message;
  errorDiv.style.visibility = 'visible';
}