console.log('main.min.js ran');
var registerForm = document.querySelector('.form--register');
var loginForm = document.querySelector('.form--login');
var createNoteForm = document.querySelector('.form--createnote');
// var modal = document.querySelector('.modal');
var inputs = Array.from(document.querySelectorAll('input'));
var textarea = document.querySelector('textarea');
console.log('registerForm', registerForm);
console.log('loginForm', loginForm);
console.log('createNoteForm', createNoteForm);
console.log('inputs', inputs);
console.log('textarea', textarea);

// close modal if clicked outside
// modal.addEventListener('click', function(event) {
//   event.stopPropagation();
//   if (event.target === modal) {
//     modal.style.display = 'none';
//   }
// });

// =====================
// input event listeners
// =====================
if (textarea) {
  textarea.addEventListener('focus', function () {
    clearError(this);
  });
}
if (inputs) {
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      clearError(this);
    });
  });
}

// ====================
// form event listeners
// ====================

if (registerForm) {
  registerForm.addEventListener('submit', processRegister);
}

if (loginForm) {
  loginForm.addEventListener('submit', processLogin);
}

if (createNoteForm) {
  createNoteForm.addEventListener('submit', processNote);
}
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
  console.log('userData', userData);

  // request
  // what do i want to do
  // make a request to send information to back end server to eventualy validate and create a user
  // handle errors
  // redirect to login page
  fetch('/register', {
    headers: { 
      'Content-Type': 'application/json'
    },
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
  if (!loginForm.email.value) {
    error(loginForm.email);
    errorMessage += 'Missing email!';
  }
  if (!loginForm.password.value) {
    error(loginForm.password);
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
    email: loginForm.email.value,
    password: loginForm.password.value
  };
  console.log('userLoginData', userLoginData);

  // request
  // what do i want to do
  // request to back-end server with login information to get a token if authenticated
  // handle errors
  // store the token in localStorage
  // redirect to users notes

  fetch('/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(userLoginData)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    } else {
      return res.json().then(function (result) {
        console.log('fetch POST /login worked, heres the result', result);
        localStorage.token = result.token;
        window.location = '/notes?token=' + result.token;
      });
    }
  })
  .catch(submitError);
}

function processNote () {
  event.preventDefault();
  console.log('validating inputs');
  var errorMessage = '';
  if (!createNoteForm.name.value) {
    error(createNoteForm.name);
    errorMessage += 'Missing Title';
  }
  if (!createNoteForm.text.value) {
    if (errorMessage) {
      error(createNoteForm.text);
      errorMessage += '<br /> Missing Note';
    } else {
      error(createNoteForm.text);
      errorMessage += 'Missing Note';
    }
  }
  if (errorMessage) {
    return displayError(errorMessage);
  }

  console.log('sending request');
  var noteData = {
    name: createNoteForm.name.value,
    text: createNoteForm.text.value
  }
  console.log('noteData', noteData);
  // request
  // what do i want to do
  // make a request to back-end server with note information to save a note to the users note db
  // handle errors
  // redirect users to all their notes
  fetch('/notes', {
    headers: { 
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token 
     },
    method: 'POST',
    body: JSON.stringify(noteData)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    } else {
      console.log('fetch post /notes worked, here is the res', res);
      window.location = '/notes?token=' + localStorage.token        
    }
  }).catch(submitError);
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

console.log('end main.min.js');