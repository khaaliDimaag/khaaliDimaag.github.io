const form = document.getElementById('contact-form');
const info = document.getElementById('information');
const error = document.getElementById('user-error');
const reset = document.getElementById('contact-reset');
const submit = document.getElementById('contact-submit');
const thanks = document.getElementById('thanks');
const again = document.getElementById('one-more');
const captcha = document.getElementById('captcha');

let nonce;
try { nonce = parseInt(window.sessionStorage.getItem('nonce')); } catch(e) { nonce = 0; }

submit.addEventListener('click', (e) => {
  e.preventDefault();

  // check if captcha is not working
  if(window.sessionStorage.getItem('captchaError')) {
    message.innerHTML = `Stop trying to <i>Inspect Element</i> and send this form!`;
    return;
  }
  
  // verify captcha
  const formData = new FormData(form);
  if(!formData.get('g-recaptcha-response')) {
    message.innerHTML = `Please prove that you are not a robot.`;
    return;
  }

  // set hidden field values
  formData.set('timestamp', e.timeStamp / 1000); // in seconds

  // check empty responses
  for( const [key, val] of formData ) {
    if(!val) {
      // @dev an empty `g-recaptcha-response` should not reach here because of the captcha check above
      message.innerHTML = `Please fill out the <span class="highlight">${key}</span> field.`;
      return; 
    }
  }

  // update nonce
  window.sessionStorage.setItem('nonce', ++nonce);
  formData.set('nonce', nonce);

  // submit
  form.submit();

}, false);

reset.addEventListener('click', (e) => { message.innerHTML = ''; }, false);

again.addEventListener('click', (e) => {
  if(nonce >= 3) {
    message.innerHTML = `You have already sent three messages. Please wait for their responses before sending another.`;
    return;
  }
  window.sessionStorage.removeItem('subject');
  window.sessionStorage.removeItem('message');
  window.sessionStorage.removeItem('g-recaptcha-response');
  window.sessionStorage.removeItem('timestamp');
  window.sessionStorage.removeItem('captchaError');
  document.getElementById('contact-form').reset();
  document.getElementById('name') = window.sessionStorage.getItem('name');
  document.getElementById('email') = window.sessionStorage.getItem('email');
}, false);

window.addEventListener('load', (e) => {
  if(nonce) {
    thanks.style.display = '';
    info.style.display = 'none';
    form.style.display = 'none';
    message.style.display = 'none';
    return;
  }

  // this is the first load
  form.style.display = '';
  info.style.display = '';
  message.style.display = '';
  thanks.style.display = 'none';
  captcha.setAttribute('data-callback', 'captchaSuccessCallback');
  captcha.setAttribute('data-expired-callback', 'captchaExpiredCallback');
  captcha.setAttribute('data-error-callback', 'captchaErrorCallback');
}, false);


/* reCAPTCHA stuff */

function captchaSuccessCallback(response) {
  window.sessionStorage.setItem('g-recaptcha-response', response);
  window.sessionStorage.setItem('captchaError', false);
}

function captchaExpiredCallback() {
  message.innerHTML = `CAPTCHA expired. Please try proving humanity again.`;
}

function captchaErrorCallback() {
  info.innerHTML = 'There is some problem with reCAPTCHA. You will not be able to send a message right now. Please try again later.';
  captcha.style.display = 'none';
  for(let i=0; i<form.elements.length; i++) { form.elements[i].disabled = true; }
  window.sessionStorage.setItem('captchaError', true);
}
