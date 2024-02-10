import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {ColorSchemeProvider} from './src/components/ColorSchemeContext';
import AppNavigator, { GBSplashNavigator } from './src/navigation/GoBoozeNavigation';

LogBox.ignoreAllLogs();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  return (
    <ColorSchemeProvider>
    <AppNavigator />
      {/* {showSplash && <GBSplashNavigator />}
      {showSplash === false && <AppNavigator />} */}
    </ColorSchemeProvider>
  );
}

export default App;
