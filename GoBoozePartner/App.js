import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {ColorSchemeProvider} from './src/components/ColorSchemeContext';
import AppNavigator from './src/navigation/GoBoozeNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableLatestRenderer} from 'react-native-maps';

LogBox.ignoreAllLogs();

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
        <AppNavigator />
      </GestureHandlerRootView>

      {/* {showSplash && <GBSplashNavigator />}
      {showSplash === false && <AppNavigator />} */}
    </ColorSchemeProvider>
  );
}

export default App;
