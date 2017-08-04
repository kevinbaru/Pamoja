var React = require('react');
import { Card, CardTitle,CardMedia,CardActions, CardText } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import DocumentModal from './documentModal'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import MyEditor from './document';
import moment from 'moment';

import {Editor,EditorState,convertToRaw, convertFromRaw, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history:[],
      title:"",
      error:null,
      open:false,
  };
  this.handleRestore=this.handleRestore.bind(this);
  // this.handleOpen=this.handleOpen.bind(this)
  this.handleClose=this.handleClose.bind(this)

  }
  componentDidMount(){
    // let docId= this.props.match.params.docId;
    let docId= this.props.docId;
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

          this.setState({
            history: resp.docs.history.reverse(),title:resp.docs.title
          })

        }


      }else{
        this.setState({error:resp.error.errmsg})
      }

    })
    .catch(err=> {throw err})

  }
  handleRestore(content){
    this.props.restorePage(content)

  }

  showModal(content) {
    // console.log(JSON.parse(content));
      this.setState({
        open: true,
        content: content
      });

  }

  handleClose(){
    this.setState({
      open: false,
      content: ''
    });
  };

  render(){

    return(
      <div>

        <h4 style={{marginTop:15, color:'blue',textAlign:'center'}}> Previous Versions </h4>
        {this.state.content && <DocumentModal restore={this.handleRestore} open={this.state.open} title={this.state.title} handleClose={this.handleClose} content={this.state.content}/>}
      <div style = {{display:'flex', position: 'relative', flexFlow: 'row wrap', flexBasis: '80%'}} >
        {
          this.state.history.map((doc,index)=>{
            return(
              <MuiThemeProvider >
               <Card  style={{height:210, width:150, margin:20}}>
                 <CardMedia
                   overlay={<CardTitle  subtitle={this.state.title} />}
                   onClick={() => this.showModal(doc.content)}
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

    )
  }


}
export default History
