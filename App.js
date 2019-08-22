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
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  NativeModules
} from 'react-native';

import Helpshift from 'helpshift-react-native'
import HelpshiftConfig from './helpshift.config.json'

type Props = {};
export default class App extends Component<Props> {

  componentDidMount() {
    Helpshift.init(
      HelpshiftConfig['HELPSHIFT_API_KEY'],
      HelpshiftConfig['HELPSHIFT_DOMAIN'],
      Platform.select({
        ios: HelpshiftConfig['HELPSHIFT_IOS_APP_ID'],
        android: HelpshiftConfig['HELPSHIFT_ANDROID_APP_ID']
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity onPress={() => Helpshift.showConversation()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Chat with Support</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Helpshift.showFAQs()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Show FAQs</Text>
            </View>
          </TouchableOpacity>
      </View>
    )
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      height: 50,
      backgroundColor: '#313840',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50,
      width: 275,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 20
    }
  });