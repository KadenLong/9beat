const form = document.querySelector('.login')


function loginSubmitHandler(e) {
    e.preventDefault()

    let username = document.querySelector('.username')
    let password = document.querySelector('.password')

    bodyObj = {
        user : username.value,
        password: password.value
    }
    
    login(bodyObj)

    username.value = ''
    password.value = ''
}

form.addEventListener('submit', loginSubmitHandler)

function login(body) {
    axios
        .post('/login', body)
        .then((res) => {
            console.log(res.data)
            sessionStorage.setItem('userId', `${res.data.user_id}`)
            window.location.href = "http://localhost:4005/lab.html"
        })
        .catch(err => {
            console.log(err)
            let tellEm = document.createElement('h2')
            tellEm.textContent = 'invalid username and/or password'
            document.querySelector('body').appendChild(tellEm)
        })
}
