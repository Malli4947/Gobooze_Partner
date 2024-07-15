import { View, Text,StyleSheet,StatusBar, Pressable } from 'react-native'
import React from 'react'
import COLORS from '../constants/Colors'
import {useColorScheme} from '../components/ColorSchemeContext';
import Avatar from '../assets/Avatar.svg'
import {GRAPHIK_FONT} from '../constants/Constant';
import CustomStatusBar from '../components/CustomStatusBar';
import { rHeight, rWidth } from '../constants/PixelSize';
import Clock from '../assets/ClockBlue.svg'
import Arrow from '../assets/arrowRightBlack.svg'
import Task from '../assets/TaskSquare.svg'

import {useSafeAreaInsets} from 'react-native-safe-area-context';
const ProfileScreen = () => {
    const colorScheme = useColorScheme();
    const isDarkTheme = colorScheme === 'dark';
    const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
    const insets = useSafeAreaInsets();
   
  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
     
      <View style={{marginTop: insets.top}}>
      <View style={[{backgroundColor:'#ffff',padding:16,margin:0,flexDirection:'row',alignItems:'center',borderBottomColor:COLORS.light_disabled_background,borderBottomWidth:1},isDarkTheme && styles.dark_container ]}>
       <Avatar width={70} height={70} />
      <View style={{marginLeft:rHeight(10)}}>
        <Text style={{color:'#000',fontSize:rWidth(16), fontFamily: GRAPHIK_FONT.MEDIUM,}}>Marsha</Text>
        <Text style={{color:'#000',fontSize:rWidth(16), fontFamily: GRAPHIK_FONT.MEDIUM,}}>marsha@gmail.com</Text>
      </View>
      </View>
      </View>
      
      <View style={{marginTop:rHeight(10)}}>
        <Pressable style={{flexDirection:'row',alignItems:'center',padding:16,borderBottomColor:'#D3178A',borderBottomWidth:1}}>
<Clock style={{marginTop:rHeight(5)}}/>
<Text style={{color:'#D3178A',fontSize:rWidth(20), fontFamily: GRAPHIK_FONT.MEDIUM,marginLeft:rWidth(10)}}>Histroy</Text>
<Arrow style={{position:'absolute',right:16,marginTop:rHeight(6)}}/>
        </Pressable>
        <Pressable style={{flexDirection:'row',alignItems:'center',padding:16,borderBottomColor:'#D3178A',borderBottomWidth:1}}>
<Task style={{marginTop:rHeight(5)}}/>
<Text style={{color:'#D3178A',fontSize:rWidth(20), fontFamily: GRAPHIK_FONT.MEDIUM,marginLeft:rWidth(10)}}>Partner Instructions</Text>
<Arrow style={{position:'absolute',right:16,marginTop:rHeight(6)}}/>
        </Pressable>
      </View>
    </View>
  )
}

export default ProfileScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff',
    //   position:'relative',
    //   top:-100,
    },
    dark_container: {
      backgroundColor: COLORS.dark_con,
    },
})