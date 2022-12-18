const socket = io('http://localhost:3000')

const msgForm = document.getElementById('input')
const msgList = document.getElementById("messageList")
const userList = document.querySelector("ul#users")
const chtBoxInput = document.getElementById('chtBox')
const userForms = document.querySelector('.modal')
const userName = document.querySelector('.modal input')
const backdrop = document.querySelector('.backdrop')

let messages = []
let users = []

function update(){
    msgList.textContent = ''
    for(let i = 0; i < messages.length; i++){
        msgList.innerHTML += `<li> 
         <p>${messages[i].user}</p>
         <p> ${messages[i].message} </p>   
         
         </li>`
    }
}

socket.on('message_clients', (msg)=>{
    messages.push(msg)
    update()
    msgList.scrollTop = msgList.scrollHeight
})

msgForm.addEventListener('submit', function updateMsg(e){
    e.preventDefault();

    let msg = chtBoxInput.value
    if(!msg){
       return alert("Message cant be empty")
    }
    socket.emit('message', msg)
    chtBoxInput.value = ''
})

function updateUsers(){
    userList.textContent = ''
    for(let i = 0; i < users.length; i++){
        let node = document.createElement('LI')
        let textnode = document.createTextNode(users[i])
        node.appendChild(textnode)
        userList.appendChild(node)
    }
}

socket.on('usersData', (_user)=>{
    users = _user
    updateUsers()
})

userForms.addEventListener('submit', function updateUser(e){
    e.preventDefault();
     let val = userName.value

     if(!val){
        return alert('Enter a valid username')
       }

     socket.emit('usersVal', val)

     userName.value = ''

     userForms.classList.add("disappear")
     backdrop.classList.add('disappear')

})