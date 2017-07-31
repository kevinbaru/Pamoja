import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';





/**
 * Dialog content can be scrollable.
 */
export default class documentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content:"" ,
      title:"",
      error:null,
      open:false,
  };
  this.handleOpen=this.handleOpen.bind(this)
  this.handleClose=this.handleClose.bind(this)
  //this.handleRestore=this.handleRestore.bind(this);

  }



  handleOpen(){
    this.setState({open: true});
  };

  handleClose(){
    this.setState({open: false});
  };
  componentDidMount(){
    console.log('Modallllll')
    //
    // let contenState=convertFromRaw(JSON.parse(this.props.content));
    // this.setState({content: contenState})
  }

  render() {
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



    return (
      <div>
        <RaisedButton label="Scrollable Dialog" onTouchTap={this.handleOpen} />
        <Dialog
          title="Scrollable Dialog"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
         <section>

         </section>

        </Dialog>
      </div>
    );
  }
}
