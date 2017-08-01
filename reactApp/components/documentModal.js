import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {Editor,EditorState,convertToRaw, convertFromRaw, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';


const { Map } = require('immutable')


/**
 * Dialog content can be scrollable.
 */

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


export default class DocumentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content:"" ,
      title:"",
      error:null,
      open:false,
  };
  // this.handleOpen=this.handleOpen.bind(this)
  // this.handleClose=this.handleClose.bind(this)
  //this.handleRestore=this.handleRestore.bind(this);

  }

  //
  //
  // handleOpen(){
  //   this.setState({open: true});
  // };
  //
  // handleClose(){
  //   this.setState({open: false});
  // };
  componentWillMount(){
    console.log(this.props.content);
    let contenState=convertFromRaw(JSON.parse(this.props.content));
    this.setState({
      editorState: EditorState.createWithContent(contenState)
    })
    console.log('Modallllll')
    //
    // let contenState=convertFromRaw(JSON.parse(this.props.content));
    // this.setState({content: contenState})
  }

  onChange(editorState) {
    //do nothing
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


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.handleClose}
      />,
    ];
    console.log(this.props);
    return (
      <div>
        <Dialog
          title="Scrollable Dialog"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
         <section>
           <Editor
             editorState={this.state.editorState}
             onChange={this.onChange.bind(this)}
             customStyleMap={styleMap}
             ref="editor"
             blockStyleFn={this.myBlockStyleFn.bind(this)}
             blockRenderMap={extendedBlockRenderMap}
           />
         </section>

        </Dialog>
      </div>
    );
  }
}
