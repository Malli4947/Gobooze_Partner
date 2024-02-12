import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

const ColorSchemeContext = createContext();

export const ColorSchemeProvider = ({children}) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({colorScheme: newColorScheme}) => {
        setColorScheme(newColorScheme);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ColorSchemeContext.Provider value={{colorScheme}}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = React.useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return 'dark'
  return context.colorScheme;
};
