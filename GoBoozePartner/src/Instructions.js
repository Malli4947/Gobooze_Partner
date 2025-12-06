import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler
} from 'react-native';
import React,{useEffect} from 'react';
import COLORS from './constants/Colors';
import {rHeight, rWidth} from './constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from './constants/Constant';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Instructions = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ProfileScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);
  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
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
      <ScrollView style={{padding:16,marginTop:rHeight(16)}}>
        <View>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}> Order Acceptance and Preparation</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}> Order Notification: </Text> 
      Receive and accept delivery requests through the app. Review the order details carefully, including the list of items, delivery address, and special instructions.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}> Preparation Check: </Text>
      Ensure that the items you are picking up match the order details. Double-check quantities and types of items to prevent errors.</Text>
     </View>
     <View style={{marginTop:rHeight(10)}}>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}> Delivery Process</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}> Navigation: </Text>
      
      Use the app's navigation feature or a reliable GPS to find the most efficient route to the delivery location.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Customer Communication: </Text> 
      Contact the customer if necessary, especially if you are having trouble locating the address or if there are any delays.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Age Verification: </Text> 
      Upon delivery, verify the customer's age by checking a valid ID. The app may require you to scan the ID or enter details to confirm age compliance.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Alcohol Handling: </Text> 
      Ensure that the alcohol is handled with care and not consumed by anyone during the delivery process. Keep the items in their original packaging and avoid exposing them to direct sunlight or extreme temperatures.</Text>
      </View>
      <View style={{marginTop:rHeight(10)}}>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}> Contactless Delivery and Safety</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}> Contactless Delivery: </Text> 
      If contactless delivery is requested, follow the instructions provided in the app. This may include leaving the package at the door and notifying the customer without physical contact.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Safety Measures: </Text> 
      Follow all health and safety protocols, including wearing a mask if required, sanitizing hands, and maintaining social distancing.</Text>
     
      </View>
      <View style={{marginTop:rHeight(10)}}>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}>Customer Interaction</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}> Professionalism: </Text> 
      Be polite and professional when interacting with customers. Address any questions or concerns they may have.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Handling Issues: </Text> 
      If a customer is unable to provide a valid ID or appears intoxicated, do not complete the delivery. Report the incident through the app and return the items to the store.</Text>
     
      </View>
      <View style={{marginTop:rHeight(10)}}>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}>Emergency and Support</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}>Emergency Situations:  </Text> 
      In case of an emergency, such as an accident or safety concern, prioritize safety and contact local authorities if necessary.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Support Contact:  </Text> 
      Use the app's support feature to reach out for help or report issues that cannot be resolved independently.</Text>
     
      </View>
      <View style={{marginTop:rHeight(10)}}>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1]}>App Usage and Troubleshooting</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12)}]}>Using the App: </Text> 
      Ensure you are familiar with all features of the GoboozePartner app, including order management, navigation, and customer communication.</Text>
      <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontFamily:GRAPHIK_FONT.REGULAR,fontSize:rWidth(12),marginTop:rHeight(15)}]}> <Text style={[styles.textHeader,  isDarkTheme &&styles.dtext1,{fontSize:rWidth(12),}]}>Troubleshooting: </Text> 
      Contact support if you experience technical issues with the app or have questions about its functionality.</Text>
     
      </View>
      <View style={{height:rHeight(50)}}/>
      </ScrollView>
    </SafeAreaView>
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
     marginTop:rHeight(16)
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
  textHeader:{fontSize:rWidth(16),fontFamily:GRAPHIK_FONT.SEMIBOLD,color:`#000`},
  dtext1: {
    color: COLORS.dark_disabled_text,
  },
});

export default Instructions;
