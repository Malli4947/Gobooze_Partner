import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {ColorSchemeProvider} from './src/components/ColorSchemeContext';
import AppNavigator from './src/navigation/GoBoozeNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableLatestRenderer} from 'react-native-maps';
import configureStore from './src/redux/store';
import { Provider } from 'react-redux';

LogBox.ignoreAllLogs();
const store = configureStore();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    enableLatestRenderer();
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  return (
    <ColorSchemeProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </GestureHandlerRootView>
    </ColorSchemeProvider>
  );
}

export default App;
