/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 console.disableYellowBox = true;

import React, {Component} from 'react';
import {
  AppState,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';

import Helpshift from 'helpshift-react-native';
import IconBadge from 'react-native-icon-badge';

import {
  HELPSHIFT_API_KEY,
  HELPSHIFT_DOMAIN,
  HELPSHIFT_IOS_APP_ID,
  HELPSHIFT_ANDROID_APP_ID
} from './helpshift.config.json'

const cifs = {
  'verified': ['b', 'true'],
  'number_of_rides': ['n', '12'],
  'street': ['sl', '343 sansome']
}

const user = {
  name: 'Test Person',
  email: "test@person.com",
  identifier: 'testperson1',
  // authToken: 'iR20RTW0IRw0+MexN2wgb89Pj/ih1FZHEg+++SIKvxY='
}

const config = {
  apiKey: HELPSHIFT_API_KEY,
  domain: HELPSHIFT_DOMAIN,
  appId: Platform.select({ ios: HELPSHIFT_IOS_APP_ID, android: HELPSHIFT_ANDROID_APP_ID }),
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 300,
  user: user,
  cifs: cifs
}

type Props = {};
export default class App extends Component<Props> {

  constructor(props){
    super(props);

    this.state = {
      showChat: false,
      unreadMessages: 0
    }
  }

  componentDidMount() {
    if (!HELPSHIFT_API_KEY || !HELPSHIFT_DOMAIN) alert('Add config to helpshift.config.json!')
    AppState.addEventListener('change', nextAppState => this._handleAppStateChange(nextAppState));
    Helpshift.eventEmitter.addListener('Helpshift/SessionEnded', () => this.setState({ showChat: false }));
    this._getUnreadMessagesCount();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', nextAppState => this._handleAppStateChange(nextAppState));
    Helpshift.eventEmitter.removeListener('Helpshift/SessionEnded', () => this.setState({ showChat: false }));
  }

  _handleAppStateChange(nextAppState){
    if ( nextAppState === 'active' ) {
      this._getUnreadMessagesCount();
    }
  };

  async _getUnreadMessagesCount(){
    let count = await Helpshift.requestUnreadMessagesCount();
    this.setState({ unreadMessages: count });
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={() => this.setState({ showChat: !this.state.showChat, unreadMessages: !this.state.showChat ? 0 : this.state.unreadMessages })}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{`${this.state.showChat ? "Hide" : "Show"} Chat`}</Text>
          </View>
        </TouchableOpacity>

        {this.state.showChat ? <Helpshift config={config} style={{ flex: 1, height: Dimensions.get('window').height - 300, width: Dimensions.get('window').width }} /> : null}

        <IconBadge
          MainElement={
            <View style={{
              backgroundColor:'#489EFE',
              width:50,
              height:50,
              margin:6
            }}/>
          }
          BadgeElement={ <Text style={{color:'#FFFFFF'}}>{this.state.unreadMessages}</Text> }
          IconBadgeStyle={{width:30, height:30, backgroundColor: '#FF00EE'}}
        />

      </View>
    )
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      height: 50,
      backgroundColor: '#313840',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
      marginBottom: 50,
      width: 275,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 20
    }
  });