console.log('main.min.js ran');
var registerForm = document.querySelector('.form--register');
var loginForm = document.querySelector('.form--login');
// var modal = document.querySelector('.modal');
var inputs = Array.from(document.querySelectorAll('input'));

console.log('main.min.js got to before log forms');
console.log('registerForm', registerForm);
console.log('loginForm', loginForm);


// close modal if clicked outside
// modal.addEventListener('click', function(event) {
//   event.stopPropagation();
//   if (event.target === modal) {
//     modal.style.display = 'none';
//   }
// });

// clear border on input focus
inputs.forEach(function (input) {
  input.addEventListener('focus',function () {
    clearError(this);
  });
});

// ====================
// form event listeners
// ====================

registerForm.addEventListener('submit', processRegister);
loginForm.addEventListener('submit', processLogin);

// =====================
// form submit functions
// =====================

function processRegister (event) {
  event.preventDefault();

  console.log('validating inputs');
  var errorMessage = '';
  if (!validateEmail(registerForm.email)) {
    error(registerForm.email);
    errorMessage += 'Email address is invalid.';
  }
  if (!validatePassword(registerForm.password)) {
    error(registerForm.password);
    if (errorMessage){
      errorMessage += '<br /> Password is invalid';
    } else {
      errorMessage += 'Password is invalid';
    }
  }
  
  console.log('errorMessage', errorMessage);
  if (errorMessage) {
    return displayError(errorMessage);
  }

  console.log('sending request');
  var userData = {
    email: registerForm.email.value,
    password: registerForm.password.value
  };
  console.log('userData', userData)
  // request
  // what do i want to do
  // make a request to send information to back end server to eventualy validate and create a user
  // display login success modal if success
  // handle errors
  // redirect to login page

  fetch('/register', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(userData)
  })
  .then(function (res) {
    if (!res.ok) return submitError(res);
    window.location = '/login';
  })
  .catch(submitError);
}

function processLogin () {
  event.preventDefault();

  console.log('validating inputs');
  var errorMessage = '';
  if (!form.email.value) {
    error(form.email);
    errorMessage += 'Missing email!';
  }
  if (!form.password.value) {
    error(form.password);
    if (errorMessage) {
      errorMessage += '<br /> Missing password!';
    } else {
      errorMessage += 'Missing password!';
    }
  }
  
  console.log('errorMessage', errorMessage);
  if (errorMessage) {
    return displayError(errorMessage);
  }

  console.log('sending request');
  var userLoginData = {
    email: form.email.value,
    password: form.password.value
  };
  console.log(userLoginData);

    // request
    // what do i want to do
    // request to back end with login information to get a token if authenticated
    // store the token to localStorage
    // redirect to users notes
    // else return an error

  fetch('/login', {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    } else {
      return res.json().then(function (result) {
        localStorage.token = result.token;
        window.location = '/notes?token=' + result.token;
      });
    }
  })
  .catch(submitError);
}
// ==========================
// input validation functions
// ==========================

// return true iff valid
function validateEmail (target) {
  var emailInputValue = target.value;
  // http://emailregex.com/
  var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInputValue);
  return isValid;
}
function validatePassword (target) {
  var passwordInputValue = target.value;
  var isValid;
  if (passwordInputValue === '') {
    isValid = false;
  } else {
    isValid = true;
  }
  return isValid;
}

// add border on target
function error (target) {
  target.style.border = '3px solid #f00';
}
// clear border on target
function clearError (target) {
  target.style.border = '';
}

// toggle error messages
function displayError(message) {
  var errorDiv = document.querySelector('.error-message');
  errorDiv.innerHTML = message;
  errorDiv.style.visibility = 'visible';
}

// =====================
// register form submit callbacks
// =====================
function submitError (res, message) {
  if (res.status >= 400 && res.status < 500) {
    return res.text().then(function (message) { 
      displayError(message); 
    });
  }
  if (message) {
    return displayError(message);
  }
  return displayError('There was a problem submitting your form. Please try again later.');
}