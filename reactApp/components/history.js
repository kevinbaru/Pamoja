var React = require('react');
import { Card, CardTitle,CardMedia,CardActions } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import DocumentModal from './documentModal'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import {Editor,EditorState,convertToRaw, convertFromRaw, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history:[] ,
      title:"",
      error:null,
      open:false,
  };
  this.handleRestore=this.handleRestore.bind(this);
  // this.handleOpen=this.handleOpen.bind(this)
  this.handleClose=this.handleClose.bind(this)

  }
  componentDidMount(){
    let docId= this.props.match.params.docId;
    fetch('http://localhost:3000/documents/'+docId, {
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
        this.setState({title:resp.docs.title})

        if( resp &&  resp.docs && resp.docs.history){
          // let raw=resp.docs.content;
          // let contenState=convertFromRaw(JSON.parse(resp.docs.content));
          this.setState({
            history: resp.docs.history,title:resp.docs.title
          })

        }


      }else{
        this.setState({error:resp.error.errmsg})
      }

    })
    .catch(err=> {throw err})

  }
  handleRestore(content){
    // const contenState=this.state.editorState.getCurrentContent();
    // const stringifiedContent= JSON.stringify(convertToRaw(contenState))
    const docId= this.props.match.params.docId
    fetch('http://localhost:3000/save/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body:JSON.stringify({
          docId:docId,
          content:content,
        })
    })

    .then(resp=>resp.json())
    .then((resp)=>{

      if(resp.success){
        console.log('suceess saved')
        this.props.history.push('/document/'+this.props.match.params.docId)

      }else{
        this.setState({error:resp.error.errmsg})
      }

    })
    .catch(err=> {throw err})


  }

  showModal(content) {
    // console.log(JSON.parse(content));
      this.setState({
        open: true,
        content: content
      });
      alert('show modal');
  }

  handleClose(){
    this.setState({
      open: false,
      content: ''
    });
  };

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return(
      <div>
        <h2>{this.state.title}'s Saved Versions </h2>
        {this.state.content && <DocumentModal open={this.state.open} handleClose={this.handleClose} content={this.state.content}/>}
      <div style = {{display:'flex', position: 'relative', flexFlow: 'row wrap', flexBasis: '80%'}} >
        {
          this.state.history.map((doc,index)=>{
            return(
              <MuiThemeProvider >
               <Card  style={{height:210, width:150, margin:20}}>
                 <CardMedia
                   overlay={<CardTitle  subtitle={doc.date} />}
                   onClick={() => this.showModal(doc.content)}
                   >
                     <img src="img/gdocs.jpg" alt="" height= "140" width="100"/>
                 </CardMedia>

                 <CardActions style={{ margin:0 , padding:0}}>


                  <FlatButton onClick={()=>this.handleRestore(doc.content)} style={{ color:'blue', width:2}} label="RESTORE" />
                </CardActions>
              </Card>
            </MuiThemeProvider>

            )
          })
        }
      </div>
      <button onClick={()=>this.props.history.push('/document/'+this.props.match.params.docId)  }> {'<'}Back to Doc</button>
      </div>

    )
  }


}
export default History
