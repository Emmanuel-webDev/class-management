const socket = io('http://localhost:3000')

const msgForm = document.getElementById('input')
const msgList = document.getElementById("messageList")
const userList = document.querySelector("ul#users")
const chtBoxInput = document.getElementById('chtBox')

let messages = []

function update(){
    msgList.textContent = ''
    for(let i = 0; i < messages.length; i++){
        msgList.innerHTML += `<li> 

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