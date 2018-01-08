import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  Alert,
  View
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'
import firebase from 'react-native-firebase'
import Display from 'react-native-display'

const androidConfig = {
  clientId: '79432361282-dp5kre7kn6aocu9i6h4q96q1bc3qv7ct.apps.googleusercontent.com',
  appId: '1:79432361282:android:b7978681486f180f',
  apiKey: 'AIzaSyDmsDj9ybFq71LBfiRDMUrQAR3p5cg557w',
  databaseURL:  'https://cygalexample.firebaseio.com',
  storageBucket: 'cygalexample.appspot.com',
  messagingSenderId: '79432361282',
  projectId: 'cygalexample',
  persistance: true,
};

const cygalexampleApp = firebase.initializeApp(androidConfig, 'cygalexample',);

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', rep_password: '', view: 'login', verification: false};
  }

  getRegistrationVisibility() {
    switch (this.state.view) {
      case 'login':
        return false;
      case 'registration':
        return true;
    }
  }

  alert(email, functionality, status) {
    var msg = '';
    switch (functionality) {
      case 'login':
        if (status) {
          msg = 'Login success!'
        } else {
          msg = 'Login error! Try again.'
        }
        break;
      case 'registration':
        if (status) {
          msg = 'Account created!'
        } else {
          msg = 'Error! Try again with other E-mail.'
        }
        break;
      default:
        break;
    }
       Alert.alert(
               email,
               msg,
               [
                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                   {text: 'OK', onPress: () => console.log('OK Pressed')},
               ],
                { cancelable: false }
         );
   };

  login() {
    switch (this.state.view) {
      case 'login':
      if (this.state.email === '' || this.state.password === '') {
        return;
      }
      cygalexampleApp.onReady().then((app) => {
         firebase.app('cygalexample').auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((user) => {
            this.alert(user.email, 'login', true);
          })
          .catch((err) => {
            this.alert(this.state.email, 'login', false);
          });
        });
        break;
      case 'registration':
        this.setState({view: 'login'})
        break;
      default:
        break;
    }
   };

  register() {
    switch (this.state.view) {
      case 'login':
        this.setState({view: 'registration'})
        break;
      case 'registration':
        if (this.state.email === '' || this.state.password === '' || this.state.rep_password === '') {
          return;
        }
        if (this.state.email.indexOf("@") === -1) {
          return;
        }
        if (!this.getPasswordVerification()) {
          return;
        } else {
          cygalexampleApp.onReady().then((app) => {
           firebase.app('cygalexample').auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
              this.alert(user.email, 'registration', true);
            })
            .catch((err) => {
              this.alert(this.state.email, 'registration', false);
            });
          });
        }
        break;
      default:
      break;
    }

  };

  getPasswordVerification() {
    if (this.state.rep_password === this.state.password) {
      return true;
    } else {
      return false;
    }
  };

   addRecord() {
     firebase.database().ref('abc').set('def');
   };

   showRecord() {
     firebase.database().ref('abc').on('value', (snapshot) => {
            var recordValue = "";
            if (snapshot.val()) {
                recordValue = snapshot.val();
            }
            this.myAlert(recordValue);
        });
   }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome!
        </Text>

        <Text style={styles.instructions}>
          Set your e-mail and password.
        </Text>
        <View style={styles.login}>
          <FormLabel>E-mail</FormLabel>
          <FormInput
            onChangeText={(email) => this.setState({email})} />
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})} />
          <Display enable={this.getRegistrationVisibility()}>
            <FormLabel>Repeat password</FormLabel>
            <FormInput
              secureTextEntry={true}
              borderBottomColor = '#330066'
              onChangeText={(rep_password) => this.setState({rep_password})} />
              <Button
                backgroundColor='#330066'
                title="Register"
                onPress={() => this.register()}/>
              <Text style={styles.or}>or</Text>
              <Button
                  backgroundColor='#9C9C9C'
                  title="Login"
                  onPress={() => this.login()}/>

          </Display>
          <Display enable={!this.getRegistrationVisibility()}>
            <Button
                backgroundColor='#330066'
                title="Login"
                onPress={() => this.login()}/>
            <Text style={styles.or}>or</Text>
            <Button
              backgroundColor='#9C9C9C'
              title="Register"
              onPress={() => this.register()}/>
          </Display>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 32,
  },
  login: {
    margin: 4,
  },
  or: {
    margin: 24,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('App', () => App);
