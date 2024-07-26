import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import COLORS from './constants/Colors';
import {rHeight, rWidth} from './constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from './constants/Constant';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

const Instructions = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
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
          Instructions
        </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rWidth(16),
    borderBottomColor: COLORS.light_disabled_background,
    borderBottomWidth: 1,
    paddingBottom: rHeight(16),
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
  menuImg: {
    width: rHeight(30),
    height: rHeight(30),
  },
  headerText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    color: '#000',
    paddingLeft: rWidth(16),
    fontSize: rWidth(14),
  },
});

export default Instructions;
