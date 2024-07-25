import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import {rHeight, rWidth} from '../constants/PixelSize';
import React from 'react';
import COLORS from '../constants/Colors';
import {useColorScheme} from '../components/ColorSchemeContext';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import Arrow from '../assets/arrowRightBlack.svg';
import {useNavigation} from '@react-navigation/native';

const Support = () => {
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';

  const navigation = useNavigation();
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};

  const handleCallNow = () => {
    const url = `tel:${459216142}`;
    Linking.openURL(url);
  };
  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.menuContainer,
              isDarkTheme && {
                backgroundColor: '#23272F',
                borderColor: COLORS.dark_disabled_background,
              },
            ]}
            onPress={() => navigation.goBack()}>
            <Image
              tintColor={isDarkTheme && '#FFF'}
              resizeMode="contain"
              source={IMAGES.BACK}
              style={styles.menuImg}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              isDarkTheme && {
                backgroundColor: '#23272F',
                color: COLORS.light_con,
              },
            ]}>
            Help
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={[
              {
                fontFamily: GRAPHIK_FONT.MEDIUM,
                fontSize: rWidth(14),
                paddingTop: rWidth(16),
                color: '#000',
                marginTop: rHeight(16),
              },
              isDarkTheme && styles.dark_text,
            ]}>
            Don't find your Answer.
          </Text>
          <Text
            style={[
              {
                fontFamily: GRAPHIK_FONT.REGULAR,
                fontSize: rWidth(14),
                color: '#000',
                marginBottom: rHeight(16),
              },
              isDarkTheme && styles.dark_text,
            ]}>
            Contact with us
          </Text>
        </View>
        <View
          style={[
            {
              borderWidth: 1,
              margin: rWidth(16),
              padding: rWidth(14),
              borderRadius: rWidth(16),
              borderColor: '#000',
            },
            isDarkTheme && {
              borderColor: COLORS.dark_disabled_background,
            },
          ]}>
          <Text
            style={[
              {fontFamily: GRAPHIK_FONT.MEDIUM, color: '#000'},
              isDarkTheme && styles.dark_text,
            ]}>
            Email:
          </Text>
          <Text
            style={[
              {fontFamily: GRAPHIK_FONT.REGULAR, color: '#000'},
              isDarkTheme && styles.dark_text,
            ]}>
            contactus@gobooze.com.au
          </Text>
          <Text
            style={[
              {fontFamily: GRAPHIK_FONT.MEDIUM, color: '#000'},
              isDarkTheme && styles.dark_text,
            ]}>
            Contact Us:
          </Text>
          <Text
            style={[
              {fontFamily: GRAPHIK_FONT.REGULAR, color: '#000'},
              isDarkTheme && styles.dark_text,
            ]}>
            +61 459216142
          </Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: rWidth(16),
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary_pink,
            padding: rWidth(14),
            borderRadius: rWidth(16),
            alignItems: 'center',
          }}
          onPress={() => {
            handleCallNow();
          }}>
          <Text style={{color: '#fff'}}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  dark_container: {
    backgroundColor: COLORS.dark_con,
  },
  dark_text: {
    color: COLORS.dark_primary_text,
  },
  menuContainer: {
    width: rHeight(44),
    height: rHeight(44),
    borderRadius: rHeight(22),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    color: '#000',
    paddingLeft: rWidth(16),
    fontSize: rWidth(14),
  },
  menuImg: {
    width: rHeight(30),
    height: rHeight(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rWidth(16),
    borderBottomColor: COLORS.light_disabled_background,
    borderBottomWidth: 1,
    paddingBottom: rHeight(16),
    paddingTop: rHeight(16),
  },
});

export default Support;
