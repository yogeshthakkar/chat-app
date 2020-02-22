//Client Side js code

const socket = io()

const $input = document.querySelector('#text-input')
const $btn_msg = document.querySelector('#btn-click')
const $btn_location = document.querySelector('#btn-share-location')
const $message = document.querySelector("#message")
//template
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locatioMessageTemplate = document.querySelector('#location-message-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//option 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message',(message,username)=>{
    console.log(message);    
    const now= new Date().getTime()
    const markup = Mustache.render($messageTemplate,{
        username,
        message,
        createdAt:moment(now.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',markup)
})
socket.on('locationMessage',(url)=>{
    console.log(url)    
    const markup = Mustache.render($locatioMessageTemplate,{
        url        
    })
    $message.insertAdjacentHTML('beforeend',markup)
})
socket.on('roomData',({room,users})=>{
    const markup =Mustache.render($sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = markup
})

$btn_msg.addEventListener('click',(e)=>{
    e.preventDefault()
    //disabled
    $btn_msg.setAttribute('disabled','disabled')
    const message = $input.value
    socket.emit('sendMessage',message,(error)=>{
        //enable
        $btn_msg.removeAttribute('disabled')
        $input.value = ''
        $input.focus()
        if(error){
            return console.log(error);            
        }

    })
})


document.querySelector('#btn-share-location').addEventListener('click',(e)=>{
    e.preventDefault()
    if(!navigator.geolocation){
        return alert('Geolocation is not supported in your browser...')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            lat:position.coords.latitude,
            long:position.coords.longitude})
        // console.log(position);
    })
    
})

socket.emit('join', { username, room }, (error) => {
  if(error){
      alert(error)
      location.href = '/'
  }
})