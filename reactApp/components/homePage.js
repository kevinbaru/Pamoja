var React = require('react');
import { Card, CardTitle,CardMedia,CardActions,CardText } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    documents:[],
    valued:'',
    open:false
  };
    this.handleChange = this.handleChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleView = this.handleView.bind(this);
    this.getDocs = this.getDocs.bind(this);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this)

  }
  handleOpen(){
    this.setState({open: true});
  };
  handleClose(){
   this.setState({open: false});
 };


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    this.handleClose();
    fetch('http://localhost:3000/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body:JSON.stringify({
          title:this.state.value
        })


    })
    .then(resp=>resp.json())
    .then((resp)=>{

      if(resp.success){
        this.props.history.push('/document/'+resp.doc._id)

      }

    })
    .catch(err=> {throw err})

  }
  handleView(docId){
    this.props.history.push('/document/'+docId)
  }



  getDocs(){

    fetch('http://localhost:3000/documents', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

    .then(resp=>resp.json())
    .then((resp)=>{
      console.log(resp);
      if(resp.success){
        this.setState({documents:resp.docs})

      }

    })
    .catch(err=> console.log(err))

  }

  componentDidMount(){

    this.getDocs()

  }
logout(){
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

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];
    return(
        <div  >

          <AppBar
            title="Pamoja"

            iconElementRight={<FlatButton  onClick={this.logout} label="Logout" />}
            style={{marginBottom:30}}
          />

          <div className="container-fluid">
            <div>
        <RaisedButton primary={true} label="New Document" onTouchTap={this.handleOpen} />
        <Dialog
          title="Create New Document"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

        Name: <input style={{borderColor:'#00BCD4'}} type="text" value={this.state.value} placeholder="Enter name" onChange={this.handleChange} />
        </Dialog>
      </div>



        <h3>Your Documents</h3>

        <div style = {{display:'flex', flexFlow:'row wrap', flexBasis: '80%'}}  >

          {
            this.state.documents.reverse().map((doc)=>{
              return(
                <MuiThemeProvider >
                 <Card  style={{height:190, width:150, margin:20}}>
                   <CardMedia onClick={()=>this.handleView(doc._id)}
                     overlay={<CardTitle  subtitle={doc.title}  /> }
                     >
                       <img src="img/gdocs.jpg" alt="" height= "140" width="100"/>
                   </CardMedia>

                  <CardText style={{padding:8}}> {moment(doc.date).format('LLL')} </CardText>
                </Card>
              </MuiThemeProvider>

              )
            })
          }
        </div>
        </div>

        </div>


    )
  }

}

export default HomePage;
