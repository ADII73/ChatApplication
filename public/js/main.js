const chatForm=document.getElementById('chat-form');   //get the form to enter the mssg into that
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users'); 


//get username and room from URl
const{username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
});

const socket=io();   // variable socket sent that to io 

//join chatroom
socket.emit('joinRoom',{username,room});

// get room and users
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users); 
  

})

//message from server
socket.on('message',message=>{  
  console.log(message);
  outputMessage(message);  

//scroll dowm
  chatMessages.scrollTop=chatMessages.scrollHeight;

})
  //message submit(listen for submit). pass the event parameter(e) when you submit a form it automatically submits to a file . stop that from default behaviour
  chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();


  //get message text
  const msg=e.target.elements.msg.value;   // target elements of form id msg ,its value(i.e. text) 

  //emit message to server
  socket.emit('chatmessage',msg);

  //clear inputs
  e.target.elements.msg.value='';  // to empty the input from send area
  e.target.elements.msg.focus();   // after sending mssg again come back to send mssg

  });

  //output message to DOM
  function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }

  // add room name to DOM
  function outputRoomName(room){
    roomName.innerText=room;

  } 


//add users to DOM
function outputUsers(users){
  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `;
}