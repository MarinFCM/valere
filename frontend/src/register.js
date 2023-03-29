const form = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const display = document.querySelector('.error')

 form.addEventListener('submit', async (e) => {
	e.preventDefault()
	display.textContent = ''
	try {
	  const res = await fetch('http://localhost:5000/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ email: email.value, password: password.value }),
		headers: { 'Content-Type': 'application/json' }
	  })
	  const data = await res.json()
	  if(res.status === 400 || res.status === 401){
	   return display.textContent = `${data.message}. ${data.error ? data.error : ''}`
	  }
	} catch (err) {
	  console.log(err.message)
	}
  })
