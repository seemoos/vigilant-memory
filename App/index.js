import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { AuthSwitch, DeviceDimensions, ScreenTypes } from './Components';

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen
} from './Screens';

import {
  DeviceDimensionsActions,
  AccountActions,
} from './Store/Actions';

import { Colors } from './Theme';

class AppRouter extends Component {
  constructor(props) {
    super(props);

    this.connectedComponents = {
      AuthSwitch: connect(state => ({ ...state.auth }))(AuthSwitch),
      DeviceDimensions: connect(null, dispatch => ({
        onDimensionsChanged: deviceDimensions => dispatch(DeviceDimensionsActions.deviceDimensionsChanged(deviceDimensions))
      }))(DeviceDimensions),
      Login: connect(
        ({ deviceDimensions }) => ({ ...deviceDimensions }),
        dispatch => ({
          login: (email, password) => dispatch(AccountActions.login(email, password))
        })
      )(LoginScreen),
      Register: connect(
        ({ deviceDimensions }) => ({ ...deviceDimensions }),
        dispatch => ({
          register: (firstName, lastName, email, password, phone) => dispatch(AccountActions.register(firstName, lastName, email, password, phone))
        })
      )(RegisterScreen),
      Home: connect(({ deviceDimensions, auth }) => ({ ...deviceDimensions, ...auth }))(HomeScreen)
    };
  }
  render() {
    const ConnectedComponents = this.connectedComponents;

    return (
      <View style={styles.wrapperViewContainerStyle}>
        {/* <ConnectedComponents.AuthSwitch /> */}
        <ConnectedComponents.DeviceDimensions />

        <Router
          backAndroidHandler={() => {}}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.navBarTitleStyle}
          navBarButtonColor='#fff'
        >
          <Scene key='root' hideNavBar>
            <Scene key={ScreenTypes.auth}>
              <Scene
                key='login'
                initial
                hideNavBar
                title='Login'
                component={ConnectedComponents.Login}
              />
              <Scene
                key='register'
                // initial
                hideNavBar
                title='Register'
                component={ConnectedComponents.Register}
              />
            </Scene>
            <Scene key={ScreenTypes.app}>
              <Scene
                initial
                key='home'
                hideNavBar
                title='Home'
                component={ConnectedComponents.Home}
              />
            </Scene>
          </Scene>
        </Router>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperViewContainerStyle: {
    flex: 1
  },
  navBarStyle: {
    backgroundColor: Colors.brandColorHexCode
  },
  navBarTitleStyle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default AppRouter;
