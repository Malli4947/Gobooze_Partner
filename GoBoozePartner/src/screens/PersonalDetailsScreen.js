import * as React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {useColorScheme} from '../components/ColorSchemeContext';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfileInputTextView from '../components/ProfileInputTextView';
import ProfileGenderSelector from '../components/ProfileGenderSelector';
import CustomButton from '../components/CustomButton';

const PersonalDetailsScreen = props => {
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const handleSavePress = () => {};

  return (
    <View style={[
        {flex: 1},
        colorScheme == 'dark'
          ? {backgroundColor: COLORS.dark_theme_background}
          : {backgroundColor: COLORS.light_theme_background},
      ]}>
      <View style={{marginTop: insets.top + 5}}>
        <Text style={[styles.navBarTitle]}>Personal Details</Text>
        <View style={styles.seperator} />
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image style={styles.profileImg} />
          <TouchableOpacity style={[styles.choseImageContainer]}>
            <Image style={styles.choseImgIcon} />
            <Text style={styles.choseImageText}>Choose Profile Image</Text>
          </TouchableOpacity>
        </View>
        <ProfileInputTextView
          heading="Full Name"
          placeholder="Enter your full name"
        />
        <ProfileInputTextView
          heading="Mobile Number"
          placeholder="000-000-0000"
          isMobileInput={true}
        />
        <ProfileInputTextView
          heading="Email Address"
          placeholder="Enter email address"
        />

        <ProfileGenderSelector heading="Your Gender" />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={[styles.seperator, {height: 2}]} />
        <View style={{paddingHorizontal: 20}}>
          <CustomButton
            buttonText="Save details"
            disabled={buttonDisabled}
            handleClick={handleSavePress}
            textStyle={{color: COLORS.light_primary_opacity}}
            buttonStyle={[
              {
                backgroundColor:
                  colorScheme === 'dark'
                    ? buttonDisabled
                      ? COLORS.dark_disabled_background
                      : COLORS.primary_pink
                    : buttonDisabled
                    ? COLORS.ligth_grey
                    : COLORS.primary_pink,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBarTitle: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rWidth(18),
    alignSelf: 'center',
  },
  seperator: {
    backgroundColor: COLORS.ligth_grey,
    height: rHeight(7),
    width: '100%',
    marginTop: rHeight(12),
  },
  imageContainer: {
    marginTop: rHeight(30),
  },
  profileImg: {
    backgroundColor: COLORS.ligth_grey,
    width: rWidth(100),
    height: rHeight(100),
    alignSelf: 'center',
    borderRadius: 99,
  },
  choseImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light_primary_opacity,
    alignSelf: 'center',
    paddingHorizontal: rWidth(15),
    paddingVertical: rHeight(7),
    borderRadius: 8,
    marginTop: rHeight(20),
    backgroundColor: '#1018280D'
  },
  choseImgIcon: {
    width: rWidth(22),
    height: rHeight(22),
    backgroundColor: COLORS.light_primary_opacity,
    marginRight: rWidth(8),
  },
  choseImageText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 30,
    alignSelf: 'center',
  },
});
