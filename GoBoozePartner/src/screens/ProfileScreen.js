import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  onPress,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLORS from '../constants/Colors';
import {useColorScheme} from '../components/ColorSchemeContext';
import Avatar from '../assets/Avatar.svg';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import CustomStatusBar from '../components/CustomStatusBar';
import {rHeight, rWidth} from '../constants/PixelSize';
import Clock from '../assets/ClockBlue.svg';
import Arrow from '../assets/arrowRightBlack.svg';
import Task from '../assets/TaskSquare.svg';
import MessageBox from '../assets/MessageBox.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Logout from '../assets/Logout.svg';
import MyProfile from '../assets/MyProfile.svg';
import OrderHistroy from './OrderHistroy';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const insets = useSafeAreaInsets();
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    FetchDetails();
  }, []);

  const FetchDetails = async () => {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    try {
      const fetchDetails = await fetch(
        `https://devapigobooze.codefactstech.com/admin/api/partner/get-partner/${userId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );
      const data = await fetchDetails.json();
      setProfileData(data);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const LogOut = async () => {
    try {
      await AsyncStorage.removeItem('USER_DATA');
      navigation.navigate('Onboarding');
    } catch (error) {
      console.log(error);
    }
  };

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
          Profile Info
        </Text>
      </View>
      <View style={{marginTop: insets.top}}>
        <View
          style={[
            {
              backgroundColor: '#ffff',
              padding: 16,
              margin: 0,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: COLORS.light_disabled_background,
              borderBottomWidth: 1,
            },
            isDarkTheme && styles.dark_container,
          ]}>
          <Avatar width={50} height={60} />
          <View style={{marginLeft: rHeight(10)}}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={
                  isDarkTheme
                    ? COLORS.dark_primary_text
                    : COLORS.light_primary_text
                }
              />
            ) : (
              <>
                {profileData ? (
                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: rWidth(14),
                        fontFamily: GRAPHIK_FONT.REGULAR,
                        paddingLeft: rWidth(16),
                      },
                      isDarkTheme && styles.dark_text,
                    ]}>
                    {profileData.data.full_name}
                  </Text>
                ) : (
                  <Text style={{color: '#000'}}>Loading...</Text>
                )}
                {profileData ? (
                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: rWidth(14),
                        fontFamily: GRAPHIK_FONT.REGULAR,
                        marginTop: rHeight(5),
                        paddingLeft: rWidth(16),
                      },
                      isDarkTheme && styles.dark_text,
                    ]}>
                    {profileData.data.email}
                  </Text>
                ) : (
                  <Text style={{color: '#000'}}>Loading@gmail.com</Text>
                )}
                {profileData ? (
                  <Text
                    style={[
                      {
                        color: '#000',
                        fontSize: rWidth(14),
                        fontFamily: GRAPHIK_FONT.REGULAR,
                        marginTop: rHeight(5),
                        paddingLeft: rWidth(16),
                      },
                      isDarkTheme && styles.dark_text,
                    ]}>
                    {profileData.data.phone}
                  </Text>
                ) : (
                  <Text style={{color: '#000'}}>000000000</Text>
                )}
              </>
            )}
          </View>
        </View>
      </View>
      <View style={{marginTop: rHeight(5)}}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomColor: COLORS.light_disabled_background,
            borderBottomWidth: 1,
          }}
          onPress={() => {
            navigation.navigate('OrderHistroy');
          }}>
          <Clock
            style={{
              marginTop: rHeight(5),
            }}
          />
          <Text
            style={[
              {
                color: '#000',
                fontSize: rWidth(14),
                fontFamily: GRAPHIK_FONT.REGULAR,
                marginLeft: rWidth(10),
              },
              darkTextStyle,
            ]}>
            Order History
          </Text>
          <Arrow
            style={{position: 'absolute', right: 16, marginTop: rHeight(6)}}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomColor: COLORS.light_disabled_background,
            borderBottomWidth: 1,
          }}
          onPress={() => {
            navigation.navigate('Instructions');
          }}>
          <Task style={{marginTop: rHeight(5)}} />
          <Text
            style={[
              {
                color: '#000',
                fontSize: rWidth(14),
                fontFamily: GRAPHIK_FONT.REGULAR,
                marginLeft: rWidth(10),
              },
              darkTextStyle,
            ]}>
            Partner Instructions
          </Text>
          <Arrow
            style={{position: 'absolute', right: 16, marginTop: rHeight(6)}}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomColor: COLORS.light_disabled_background,
            borderBottomWidth: 1,
          }}
          onPress={() => {
            navigation.navigate('Support');
          }}>
          <MessageBox style={{marginTop: rHeight(5)}} />
          <Text
            style={[
              {
                color: '#000',
                fontSize: rWidth(14),
                fontFamily: GRAPHIK_FONT.REGULAR,
                marginLeft: rWidth(10),
              },
              darkTextStyle,
            ]}>
            Support/Help
          </Text>
          <Arrow
            style={{position: 'absolute', right: 16, marginTop: rHeight(6)}}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomColor: COLORS.light_disabled_background,
            borderBottomWidth: 1,
          }}
          onPress={() => {
            LogOut();
          }}>
          <Logout style={{marginTop: rHeight(5), marginLeft: rWidth(5)}} />
          <Text
            style={[
              {
                color: '#000',
                fontSize: rWidth(14),
                fontFamily: GRAPHIK_FONT.REGULAR,
                marginLeft: rWidth(10),
              },
              darkTextStyle,
            ]}>
            LogOut
          </Text>
          <Arrow
            style={{position: 'absolute', right: 16, marginTop: rHeight(6)}}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileScreen;

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
});
