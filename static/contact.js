const info = document.getElementById('information');
const form = document.getElementById('contact-form');
const reset = document.getElementById('contact-reset');
const submit = document.getElementById('contact-submit');
const thanks = document.getElementById('thanks');
const message = document.getElementById('message');
const captcha = document.getElementById('captcha');
const submitted = window.sessionStorage.getItem('timestamp');

submit.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('timestamp').value = e.timeStamp / 1000; // in seconds
  const data = {}
  for( const [key, val] of new FormData(form) ) {
    if(!val) {
      if(key === 'g-recaptcha-response') {
        message.innerHTML = `Problems with the CAPTCHA. Please try again later.`;
      }
      else {
        message.innerHTML = `Please fill out the <span class="highlight">${key}</span> field.`;
      }
      return; 
    }
    data[key] = val; // @dev unused thus far
    // window.sessionStorage.setItem(key, val);
  }
  if(!submitted) form.submit();
}, false);

reset.addEventListener('click', (e) => { message.innerHTML = ''; }, false);

window.addEventListener('load', (e) => {
  if(submitted) {
    thanks.style.display = '';
    form.style.display = 'none';
    message.style.display = 'none';
  } else {
    form.style.display = '';
    message.style.display = '';
    thanks.style.display = 'none';
  }
}, false);

function captchaSuccessCallback(response) {
  thanks.style.display = '';
  form.style.display = 'none';
  message.style.display = 'none';
  console.log(response);
}

function captchaExpiredCallback() {
  message.innerHTML = `CAPTCHA expired. Please try proving humanity again.`;
}

function captchaErrorCallback(error) {
  info.innerHTML = 'There is some problem with reCAPTCHA. You will not be able to send a message right now. Please try again later.';
  captcha.style.display = 'none';
  for(let i=0; i<form.elements.length; i++) { form.elements[i].disabled = true; }
  console.log('error', error);
}
