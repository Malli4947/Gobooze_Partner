import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {useColorScheme} from '../components/ColorSchemeContext';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfileInputTextView from '../components/ProfileInputTextView';
import ProfileGenderSelector from '../components/ProfileGenderSelector';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../components/CustomButton';
import ImagePickerOptionAlert from '../components/ImagePickerOptionAlert';

const PersonalDetailsScreen = props => {
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [imageObject, setImageObject] = React.useState('');
  const [name, setName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [gender, setGender] = React.useState();
  const [imgPickerVisible, setImgPickerVisible] = React.useState(false);
  // --
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDarkTheme = colorScheme === 'dark';
  const darkThemeText = isDarkTheme && {
    color: COLORS.dark_primary_text,
  };
  const darkSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };
  const viewBgColor = isDarkTheme && {backgroundColor: COLORS.dark_con};
  const handleSavePress = () => {};

  // ----------------- Button enable & disable -----------------
  React.useEffect(() => {
    if (
      name.length > 3 &&
      mobileNumber.length == 10 &&
      emailAddress.length > 5 &&
      gender > -1
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, mobileNumber, emailAddress, gender]);

  // ----------------- Pick image from gallery -----------------
  const imagePickerFromGallery = () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: false, maxHeight: 200, maxWidth: 200},
      response => {
        if (response && response.assets) {
          console.log('DEBUG: response: ', response.assets[0].fileName);
          setImageObject(response.assets[0]);
        }
      },
    );
  };

  // --------------- Pick image from camera -----------------
  const imagePickerFromCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
        cameraType: 'front',
      },
      response => {
        if (response && response.assets) {
          console.log('DEBUG: response: ', response.assets[0].fileName);
          setImageObject(response.assets[0]);
        }
      },
    );
  };

  const handleImagePickerSlection = option => {
    if (option === 0) {
      // Camera
      imagePickerFromCamera();
    } else if (option === 1) {
      // Gallery
      imagePickerFromGallery();
    } else if (option === 2) {
      // Remove photo
      setImageObject('');
      console.log(imageObject);
    }
  };

  return (
    <View style={[styles.container, viewBgColor]}>
      <ImagePickerOptionAlert
        modalVisible={imgPickerVisible}
        isShowRemovePhotoOption={imageObject && imageObject.uri}
        selectedOption={handleImagePickerSlection}
        dismissModal={() => setImgPickerVisible(false)}
      />
      <View style={{marginTop: Platform.OS === 'ios' ? insets.top + 5 : 12}}>
        <Text style={[styles.navBarTitle, darkThemeText]}>
          Personal Details
        </Text>
        <View style={[styles.seperator, darkSeperator]} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.profileImgContainer,
              isDarkTheme && {
                backgroundColor: COLORS.dark_theme_background,
                borderColor: COLORS.dark_disabled_background,
              },
            ]}>
            <Image
              style={[
                styles.profileImg,
                imageObject && imageObject.uri && styles.profileCustomImage,
                isDarkTheme && {tintColor: COLORS.dark_primary_text},
              ]}
              source={
                imageObject && imageObject.uri
                  ? {uri: imageObject.uri}
                  : IMAGES.USER
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => setImgPickerVisible(!imgPickerVisible)}
            style={[
              styles.choseImageContainer,
              isDarkTheme && {borderColor: '#FFFFFF99'},
            ]}>
            <Image
              style={[
                styles.choseImgIcon,
                isDarkTheme && {tintColor: COLORS.light_con},
              ]}
              source={IMAGES.EXPORT}
            />
            <Text style={[styles.choseImageText, darkThemeText]}>
              Choose Profile Image
            </Text>
          </TouchableOpacity>
        </View>
        <ProfileInputTextView
          heading="Full Name"
          onChangeText={val => setName(val)}
          placeholder="Enter your full name"
        />
        <ProfileInputTextView
          heading="Mobile Number"
          placeholder="000-000-0000"
          onChangeText={val => setMobileNumber(val)}
          isMobileInput={true}
        />
        <ProfileInputTextView
          heading="Email Address"
          onChangeText={val => setEmailAddress(val)}
          placeholder="Enter email address"
        />

        <ProfileGenderSelector
          heading="Your Gender"
          selectedOption={option => {
            // 0: MALE, 1: FEMALE, 2: OTHERS
            setGender(option);
          }}
        />
      </ScrollView>

      <View style={[styles.bottomContainer, viewBgColor]}>
        <View style={[styles.seperator, darkSeperator, {height: 3}]} />
        <View style={{paddingHorizontal: 20}}>
          <CustomButton
            buttonText="Save details"
            disabled={buttonDisabled}
            handleClick={handleSavePress}
            textStyle={
              isDarkTheme
                ? buttonDisabled
                  ? {color: '#FFFFFF99'}
                  : {color: '#FFF'}
                : buttonDisabled
                ? {color: '#1D2433A6'}
                : {color: '#FFF'}
            }
            buttonStyle={[
              {
                backgroundColor: isDarkTheme
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
    backgroundColor: '#FFF',
  },
  navBarTitle: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rWidth(18),
    alignSelf: 'center',
  },
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(9),
    width: '100%',
    marginTop: rHeight(15),
  },
  imageContainer: {
    marginTop: rHeight(30),
    backgroundColor: 'transparent',
  },
  profileImgContainer: {
    width: rHeight(100),
    height: rHeight(100),
    backgroundColor: COLORS.light_theme_background,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.ligth_grey,
  },
  profileImg: {
    width: rWidth(50),
    height: rHeight(50),
    alignSelf: 'center',
  },
  profileCustomImage: {
    width: rWidth(100),
    height: rHeight(100),
    borderRadius: 99,
  },
  choseImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light_primary_opacity,
    alignSelf: 'center',
    paddingHorizontal: rWidth(12),
    paddingVertical: rHeight(6),
    borderRadius: 8,
    marginTop: rHeight(20),
    backgroundColor: '#1018280D',
  },
  choseImgIcon: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: rWidth(8),
    tintColor: COLORS.light_primary_text,
  },
  choseImageText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(13),
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? rHeight(30) : rHeight(20),
    backgroundColor: 'transparent',
  },
});
