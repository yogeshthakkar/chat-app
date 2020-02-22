const users = []

const addUser = ({id,username,room})=>{
    
    // clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate data
    if(!username || !room){
        return{
            error:'Username and room are required...'
        }
    }
    //checking for exsisting user
    const exisistingUSer = users.find((user)=>{
        return user.username === username && user.room === room
    })
    
    //validate user
    if(exisistingUSer){
        return{
            error:'Username is in use!!!'
        }
    }

    //store user

    const user = {id,username,room}
    users.push(user)
    
    return{user}
} 

const removeUser = (id)=>{
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
   return users.find((user)=>user.id === id)    
}

const getUsersInRoom = (room)=>{
    const rm = room.trim().toLowerCase()
    return users.filter((user)=>user.room.trim().toLowerCase() === rm)    
 }
 
 module.exports={
     addUser,
     removeUser,
     getUser,
     getUsersInRoom
 }