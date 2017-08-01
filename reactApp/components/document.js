var React = require('react');
var ReactDOM = require('react-dom');
import {Editor,EditorState,convertToRaw, convertFromRaw, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';
import {styles} from '../../build/styles';
import io from 'socket.io-client';
import { Button, SplitButton, MenuItem } from 'react-bootstrap';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';

const { Map } = require('immutable')

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

const styleMap = {
  'red': {
    color: 'red',

  },
  'black': {
    color: 'black',

  },
  'green':{
    color:'green'
  },
  'twenty':{
    fontSize:'20px'
  },
  'thirty':{
    fontSize:'30px'
  },
  'twelve':{
    fontSize:'12px'
  },
  'fifteen':{
    fontSize:'15px'
  },
  'ten':{
    fontSize:'10px'
  },
  'five':{
    fontSize:'5px'
  },
  'blueish':{
    backgroundColor:'#848EF6'
  },
  'yellowish':{
    backgroundColor:'#F4F684'
  },
  'greenish':{
    backgroundColor:'#8DF684'
  },
  'redish':{
    backgroundColor:'#F69E84'
  },
  'pinkish':{
    backgroundColor:'#F5AAF0'
  },
  'purpleish':{
    backgroundColor:'#DFAAF5'
  },

};

const blockRenderMap = Map({
  'center': {
    element: 'div'
  },
  'rightAlign': {
    element: 'div'
  },
  'leftAlign': {
    element: 'div'
  },
  'justify': {
    element: 'div'
  },

});

// keep support for other draft default block types and add our myCustomBlock type
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      title:"loading document..",
      error:null,
      saved:null,
      collaborator:"",
      open:false,
    };
    this.saveDocument=this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleHistory= this.handleHistory.bind(this);
    this.handleShare= this.handleShare.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this)
    this.previousHighlight = null;

this.socket = io('http://localhost:3000');

this.socket.on('helloBack', ({color}) => {
  console.log('you just joined');
  this.setState({ownColor: color+'ish'})
});
this.socket.on('userJoined', () => {
  console.log("user joined");
});
this.socket.on('userLeft', () => {
  console.log("user left");
});
this.socket.on("receiveNewContent", stringifiedContent => {
  const contentState = convertFromRaw(JSON.parse(stringifiedContent.content));
  const newEditorState = EditorState.createWithContent(contentState);
  this.setState({ editorState: newEditorState});
});
this.socket.on('receiveNewCursor', incomingSelectionObj => {
  //console.log('inc', incomingSelectionObj);
  this.setState({color:incomingSelectionObj.color});
console.log("highlight color:",this.state.color)
  let editorState = this.state.editorState;
  const ogEditorState = editorState;
  const ogSelection = editorState.getSelection();

  const incomingSelectionState = ogSelection.merge(incomingSelectionObj.selection);

  const temporaryEditorState = EditorState.forceSelection(ogEditorState, incomingSelectionState);

  this.setState({ editorState : temporaryEditorState, color:incomingSelectionObj.color}, () => {
    const winSel = window.getSelection();
    //console.log('winSel',winSel)
    if(winSel.anchorNode){
      const range = winSel.getRangeAt(0);
      const rects = range.getClientRects()[0];
      // console.log("range", range);
      // console.log("rects", rects);
      if(rects){
        const { top, left, bottom } = rects;
        this.setState({ editorState: ogEditorState, top, left, height: bottom - top});
      }

    }


  });



});
this.socket.emit('join', {doc: this.props.match.params.docId});

}

onChange(editorState) {
  let bgcolor=this.state.ownColor;
  const selection = editorState.getSelection();

  if (this.previousHighlight) {
    try{
      console.log("I highlighted!")
      editorState = EditorState.acceptSelection(editorState, this.previousHighlight);
      console.log('ccccccclll',bgcolor)
      editorState = RichUtils.toggleInlineStyle(editorState, bgcolor);
      editorState = EditorState.acceptSelection(editorState, selection);
    }
    catch(e){
      console.log(e)
    }
    this.previousHighlight = null;
  }


  if (selection.getStartOffset() === selection.getEndOffset()) {
    console.log('moved cursor selection');
    this.socket.emit('cursorMove', selection);
  } else {
    console.log('cursor not moved bggggcolor',bgcolor)
    editorState = RichUtils.toggleInlineStyle(editorState, this.state.ownColor);
    this.previousHighlight = editorState.getSelection();

  }

  const contentState = editorState.getCurrentContent();
  const stringifiedContent = JSON.stringify(convertToRaw(contentState));

  this.socket.emit('newContent', stringifiedContent);



  this.setState({editorState});
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

  componentDidMount(){
    this.refs.editor.focus()
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

        if( resp &&  resp.docs && resp.docs.content){
          let raw=resp.docs.content;
          let contenState=convertFromRaw(JSON.parse(resp.docs.content));
          this.setState({
            editorState: EditorState.createWithContent(contenState)
          })

        }


      }else{
        this.setState({error:resp.error.errmsg})
      }

    })
    .catch(err=> {throw err})

  }

  componentWillUnmount(){
    this.socket.disconnect()
  }
  saveDocument(){
    const contenState=this.state.editorState.getCurrentContent();
    const stringifiedContent= JSON.stringify(convertToRaw(contenState))
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
          content:stringifiedContent,
        })
    })

    .then(resp=>resp.json())
    .then((resp)=>{
      console.log(resp);
      if(resp.success){
        this.setState({saved:resp.doc.date})

      }else{
        this.setState({error:resp.error.errmsg})
      }

    })
    .catch(err=> {throw err})

  }

  handleShare(){

    this.handleClose();
    const docId= this.props.match.params.docId
    fetch('http://localhost:3000/sharedoc', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body:JSON.stringify({
          docId:docId,
          collaborator:this.state.collaborator
        })


    })
    .then(resp=>resp.json())
    .then((resp)=>{
      console.log(resp);
      if(resp.success){
        console.log('shared successfully')

      }

    })
    .catch(err=> {throw err})

  }

  toggleInlineFormat(e,style,block) {
    e.preventDefault(),
    this.refs.editor.focus()

    if(block){
      console.log('styllleee',style)
      this.onChange(RichUtils.toggleBlockType(
        this.state.editorState,style
      ));
    }else{
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,style
    ));
  }
  }


  formatBS({icon, style,block}){
    return(
      <button type="button" onMouseDown={(e)=>this.toggleInlineFormat(e,style,block)} className="btn btn-primary"
        style={{backgroundColor:this.state.editorState.getCurrentInlineStyle().has(style)? '#12489B':'#196AE5'}}


        active>
        <span className={icon} aria-hidden="true"></span></button>
    )
  }


  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'center') {
      return 'Pcenter';
    };
    if (type === 'rightAlign') {
      return 'rightAlign';
    };
    if (type === 'leftAlign') {
      return 'leftAlign';
    };
    return null;
  }

  handleHistory(){
    this.saveDocument();
    this.props.history.push('/history/'+this.props.match.params.docId)
  }
  handleOpen(){
    this.setState({open: true});
  };
  handleClose(){
   this.setState({open: false});
 };


  handleChange(event) {
    this.setState({collaborator: event.target.value});
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Share"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleShare}
      />,
    ];

    let title=`${this.state.title}`
    return (
      <div style={styles.root}>
        <div>

        <AppBar
          title={title}
          iconElementLeft={<RaisedButton

            onTouchTap={() => this.props.history.push('/home')}
            icon={<FontIcon className="material-icons">home</FontIcon>}
            style={{margin:12}}
          />}
          iconElementRight={<FlatButton  onClick={this.logout} label="Logout" />}
          style={{marginBottom:30}}
        />

        <Toolbar>

            <ToolbarGroup>
              <RaisedButton
                backgroundColor='#5785F7'
                onTouchTap={this.handleHistory}
                icon={<FontIcon className="material-icons">history</FontIcon>}
                style={{margin:12}}
              />
             </ToolbarGroup>
           <ToolbarGroup>
             <RaisedButton
               backgroundColor='#5785F7'
               onTouchTap={this.handleOpen}
               icon={<FontIcon className="material-icons">share</FontIcon>}
               style={{margin:12}}
             />
           </ToolbarGroup>
           <ToolbarGroup>
             <RaisedButton
               backgroundColor='#5785F7'
                onTouchTap={this.saveDocument}
               icon={<FontIcon className="material-icons">save</FontIcon>}
               style={{margin:12}}
             />
           </ToolbarGroup>

        </Toolbar>


        <Dialog
          title="Share the Document"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

        Email: <input style={{borderColor:'#00BCD4'}} type="text" value={this.state.value} placeholder="Enter email" onChange={this.handleChange} />
        </Dialog>

        {this.state.top && (
          <div
            style={{
              position: 'absolute',
              backgroundColor: this.state.color,
              width: '2px',
              height: this.state.height,
              top: this.state.top,
              left: this.state.left
            }}
          >
          </div>
        )}

        <div className="btn-toolbar">
          <div className="btn-group">

              {this.formatBS({icon:"glyphicon glyphicon-bold",style:'BOLD'})}
              {this.formatBS({icon:"glyphicon glyphicon-italic",style:'ITALIC'})}
              <button className="btn btn-primary"
                style={{backgroundColor:this.state.editorState.getCurrentInlineStyle().has('UNDERLINE')? '#12489B':'#196AE5'}}
                onMouseDown={(e)=>this.toggleInlineFormat(e,'UNDERLINE')}>U</button>
              </div>


              <SplitButton style={{backgroundColor:'#196AE5'}} bsStyle='primary' title='Font Color' >

                <MenuItem style={{backgroundColor:'black', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'black')}  eventKey="1">standard</MenuItem>
                <MenuItem style={{backgroundColor:'green', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'green')} eventKey="2">green</MenuItem>
                <MenuItem style={{backgroundColor:'red', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'red')}  eventKey="4">red</MenuItem>
                <MenuItem style={{backgroundColor:'#F5AAF0', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'pinkish')}  eventKey="6">pink</MenuItem>
                <MenuItem style={{backgroundColor:'#DFAAF5', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'purpleish')}  eventKey="7">purple</MenuItem>
                <MenuItem style={{backgroundColor:'#F4F684', height:25}} onMouseDown={(e)=>this.toggleInlineFormat(e,'yellowish')}  eventKey="8">yellow</MenuItem>

              </SplitButton>

              <div className="btn-group">
                {this.formatBS({icon:"glyphicon glyphicon-align-left",style:'leftAlign',block:true})}
                {this.formatBS({icon:"glyphicon glyphicon-align-center",style:'center',block:true})}
                {this.formatBS({icon:"glyphicon glyphicon-align-justify",style:'justify',block:true})}
                {this.formatBS({icon:"glyphicon glyphicon-align-right",style:'rightAlign',block:true})}

                </div>

                <div className="btn-group">
                  {this.formatBS({icon:"glyphicon glyphicon-list",style:'unordered-list-item',block:true})}
                  {this.formatBS({icon:"glyphicon glyphicon-list",style:'ordered-list-item',block:true})}
                  {/* <RaisedButton
                    backgroundColor='#196AE5'
                    Color='white'
                    onMouseDown={(e)=>this.toggleInlineFormat(e,'black',true)}
                    icon={<FontIcon className="material-icons">format_list_numbered</FontIcon>}
                    style={{margin:0}}
                  />
                  */}
                  </div>


                  <SplitButton style={{backgroundColor:'#196AE5'}} bsStyle='primary' title='Font Size' >
                    <MenuItem  onMouseDown={(e)=>this.toggleInlineFormat(e,'five')}  eventKey="1">five</MenuItem>
                    <MenuItem  onMouseDown={(e)=>this.toggleInlineFormat(e,'ten')} eventKey="2">ten</MenuItem>
                    <MenuItem  onMouseDown={(e)=>this.toggleInlineFormat(e,'twelve')}  eventKey="5"> twelve</MenuItem>
                    <MenuItem onMouseDown={(e)=>this.toggleInlineFormat(e,'fifteen')}  eventKey="6">fifteen</MenuItem>
                    <MenuItem  onMouseDown={(e)=>this.toggleInlineFormat(e,'twenty')}  eventKey="7">twenty</MenuItem>
                    <MenuItem onMouseDown={(e)=>this.toggleInlineFormat(e,'thirty')}  eventKey="8">thirty</MenuItem>


                  </SplitButton>





            </div>
          </div>
            <div  className='container'>
            <div  style={styles.editor} onClick={this.focus}>
              <div className='container'>

              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                customStyleMap={styleMap}
                ref="editor"
                blockStyleFn={this.myBlockStyleFn}
                blockRenderMap={extendedBlockRenderMap}
              />
            </div>


            </div>
            </div>


          </div>
        );
      }
    }


    export default MyEditor;
