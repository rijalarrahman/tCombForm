import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  AppRegistry
} from 'react-native';
import t from 'tcomb-form-native';
import ImagePicker from 'react-native-image-picker';

const Form = t.form.Form;

const Gender = t.enums({
  L: 'Laki-laki',
  P: 'Perempuan'
});

// here we are: define your domain model
const Menu = t.struct({
  name: t.String,              // a required string
  email: t.maybe(t.String),  // an optional string
  noNumber: t.Number,               // a required number
  gender: Gender,
});

const options = {
  fields:{
    name:{
      label: 'Nama',
      placeholder:'Masukan Nama',
    },
    email:{
      label:'Email',
      placeholder:'Masukan Email',
    },
    noNumber:{
      label:'Nomor Telepon',
      placeholder:'Masukan Nomor Telepon',
    },
    gender:{
      label:'Jenis Kelamin',
      nullOption: {value: '', text: 'Jenis Kelamin',},
    },
  },
  auto:'placeholders',

  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class tCombForm extends Component{
  onUpload(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
        });
      }
    });
  }
  state = {
    avatarSource: null,
  }

  constructor(){
    super();
    this.state = {
      view:[],
    };
  }


   onPress(){
    const imagePicture = this.state.avatarSource;
    // call getValue() to get the values of the form
    const Form = this.refs.form.getValue();
    const pusher = Object.assign({Form, imagePicture});
    if (imagePicture == null) {
      return;
    }
      let viewPush = this.state.view;

      viewPush.push(pusher);
      this.setState({
        view: viewPush,
        avatarSource: null,
      });
    }

  renderRow(status, index){
    return(
      <View key={index}>
        <Text>{status.Form.name}</Text>
        <Text>{status.Form.email}</Text>
        <Text>{status.Form.noNumber}</Text>
        <Text>{status.Form.gender}</Text>
        <Image
          source={status.imagePicture}
          style={{width: 100, height: 100}}
        />
      </View>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <View>
          <ScrollView>
          {/* display */}
          <View style={{backgroundColor:'#FFF', borderRadius:2, height:100, borderWidth:1, justifyContent:'center'}} onPress={() => this.onUpload()}>

            <TouchableOpacity style={styles.buttonUpload} onPress={() => this.onUpload()} underlayColor='#FFF'>
              <Text style={styles.buttonText}>Unggah</Text>
              <Image source={this.state.avatarSource} style={{width:330, height:220}}/>
            </TouchableOpacity>
          </View>

          <Text>{this.state.nama}</Text>

          <Form
            ref="form"
            type={Menu}
            options={options}
          />

          <TouchableHighlight style={styles.buttonSave} onPress={(status) => this.onPress(status)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableHighlight>

          {this.state.view.map((status, index)=> this.renderRow(status, index))}
          </ScrollView>
        </View>
      </View>
    )
  }
}

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title:{
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText:{
    fontSize: 18,
    color: 'black',
    alignSelf: 'center'
  },
  buttonSave:{
    height:36,
    backgroundColor:'#eff4f7',
    borderColor:'#eff4f7',
    borderWidth:1,
    borderRadius:8,
    marginBottom:10,
    alignSelf:'stretch',
    justifyContent:'center'
  },
  buttonUpload:{
    height:110,
    marginBottom:10,
    alignSelf:'stretch',
    justifyContent:'center',
    paddingTop:70
  },
});
