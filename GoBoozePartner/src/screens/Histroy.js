import {View, Text} from 'react-native';
import React from 'react';
import Delivery from '../assets/Delivery history.svg';

const Histroy = () => {
  return (
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
          Profile Info
        </Text>
      </View>
    </View>
  );
};

export default Histroy;
