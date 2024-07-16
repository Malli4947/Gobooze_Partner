import * as React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../constants/Colors';
import { useColorScheme } from './ColorSchemeContext';
import { GRAPHIK_FONT, IMAGES } from '../constants/Constant';
import { rHeight, rWidth } from '../constants/PixelSize';
import GBSegmentControl from './GBSegmentControl';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
const screenWidth = Dimensions.get('screen').width * 0.6;

const OrderNavigationBar = () => {
  const navigation = useNavigation();
  const [onlineOfflineIndex, setOnlineOfflineIndex] = React.useState(0);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  // Function to handle activation based on online/offline state
  const handleActivation = async (isActive) => {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    console.log( combinedData,' combinedData===============')
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    try {
      const obj = {
        is_active: isActive,
      };
  
      console.log('Sending request with object:', obj); // Log the object being sent
  
      const res = await axios.patch(
        'https://devapigobooze.codefactstech.com/admin/api/partner/update-partner-profile/663a87e2dff6fb111f5e4907',
        obj,
        {
          headers: {
            Authorization: `${accessToken}`, // Ensure accessToken is defined or imported
          },
        }
      );
  
      console.log('Update response:', res.data); // Log the response data
    } catch (error) {
      console.error('Error updating:', error.response || error.message || error); // Log the error
    }
  };
  

  // Badge component
  // const Badge = () => {
  //   return (
  //     <View style={styles.badgeView}>
  //       <Text style={styles.badgeText}>5</Text>
  //     </View>
  //   );
  // };

  return (
    <View style={[styles.container]}>
      {/* Menu button */}
      <TouchableOpacity
        style={[
          styles.menuContainer,
          isDarkTheme && {
            backgroundColor: '#23272F',
            borderColor: COLORS.dark_disabled_background,
          },
        ]}
        onPress={() => {
          navigation.navigate('ProfileScreen');
        }}>
        {/* <Badge /> */}
        <Image
          tintColor={isDarkTheme ? '#FFF' : undefined}
          resizeMode="contain"
          source={IMAGES.MENU}
          style={styles.menuImg}
        />
      </TouchableOpacity>

      {/* Spacer */}
      <View style={{ width: rWidth(35) }} />

      {/* Segment control for online/offline */}
      <GBSegmentControl
        width={screenWidth}
        tintColor={onlineOfflineIndex === 0 ? '#099A6A' : COLORS.red_error}
        segmentArray={['Online', 'Offline']}
        selectedIndex={onlineOfflineIndex}
        onValueChange={(index) => {
          setOnlineOfflineIndex(index);
          const isActive = index === 0; // Set isActive based on index (0 for Online, 1 for Offline)
          handleActivation(isActive); // Call function to update activation status
        }}
      />
    </View>
  );
};

export default OrderNavigationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
  },
  menuContainer: {
    width: rHeight(50),
    height: rHeight(50),
    borderRadius: rHeight(25),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImg: {
    width: rHeight(22),
    height: rHeight(22),
  },
  badgeView: {
    width: rHeight(20),
    height: rHeight(20),
    borderRadius: rHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red_error,
    position: 'absolute',
    top: -5,
    right: -8,
  },
  badgeText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(10),
    color: '#FFF',
  },
});
