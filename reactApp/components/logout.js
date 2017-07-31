const logout=function(){
  fetch('http://localhost:3000/logout', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',

  })
  .then(resp=>resp.json())
  .then((resp)=>{
    console.log(resp);
    if(resp.success){
      console.log('logged successfully')
      this.props.history.push('/login')
    }

  })
  .catch(err=> {throw err})

}

export default logout
