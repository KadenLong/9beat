const form = document.querySelector('.sign-up')

function loginSubmitHandler(e) {
    e.preventDefault()

    let username = document.querySelector('.username')
    let password = document.querySelector('.password')

    bodyObj = {
        user : username.value,
        password: password.value
    }
    
    signUp(bodyObj)

    username.value = ''
    password.value = ''
}

form.addEventListener('submit', loginSubmitHandler)

function signUp(body) {
    axios
        .post('/signUp', body)
        .then(res => {
            alert('account created!')
            window.location.href = "http://localhost:4005/index.html"
        })
        .catch(err => {
            console.log(err)
            let tellEm = document.createElement('h2')
            tellEm.textContent = 'invalid username and/or password'
            document.querySelector('body').appendChild(tellEm)
        })
}