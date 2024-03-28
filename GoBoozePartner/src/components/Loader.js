import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import COLORS from "../constants/Colors";
import { useColorScheme } from "./ColorSchemeContext";

const Loader = ({loading}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark'

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={[styles.modalBackground, isDarkTheme && {backgroundColor:  "#00000095"}]}>
        <View style={[styles.activityIndicatorWrapper, isDarkTheme && {backgroundColor:  "#000000"}]}>
          <ActivityIndicator color={COLORS.pink_light} animating={loading} size={"large"} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Loader;
