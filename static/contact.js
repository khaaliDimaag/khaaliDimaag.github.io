const form = document.getElementById('contact-form');
const reset = document.getElementById('contact-reset');
const submit = document.getElementById('contact-submit');
const thanks = document.getElementById('thanks');
const message = document.getElementById('message');
const submitted = window.sessionStorage.getItem('timestamp');

submit.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('timestamp').value = e.timeStamp;
  const data = {}
  for( const [key, val] of new FormData(form) ) {
    data[key] = val; // @dev unused thus far
    window.sessionStorage.setItem(key, val);
  }
  if(!submitted) form.submit();
}, false);

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