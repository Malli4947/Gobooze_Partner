import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIoS from '@react-native-community/push-notification-ios';
//latest changes
const NotificationController = props => {
  PushNotification.configure({
    onNotification: notification => {
      if (notification) {
        console.log(notification);
      }
    },
  });

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      //notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
  useEffect(() => {
    // Create a channel for Android notifications
    PushNotification.createChannel(
      {
        channelId: 'your-channel-id', // Replace with your desired channel ID
        channelName: 'Your Channel Name', // Channel name
        channelDescription: 'A channel to categorize your notifications', // Description
        soundName: 'sound.mp3', // Sound for notifications
        importance: PushNotification.Importance.HIGH, // Importance level
        vibrate: true, // Vibration
      },
      created => console.log(`CreateChannel returned '${created}'`),
    );
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      console.log(remoteMessage);
      // const {notification, messageId} = remoteMessage;
      // if (Platform.OS === 'ios') {
      //   PushNotificationIoS.addNotificationRequest({
      //     id: messageId,
      //     title: notification.title,
      //     body: notification.body,
      //     sound: 'default',
      //   });
      //   // notification = remoteMessage;
      //   // onNotification(notification);
      // } else {
      //   console.log("About to send the local notification: ");
      //   PushNotification.localNotification({
      //     channelId: 'your-channel-id', // Use the channel ID here
      //     message: remoteMessage.notification.body,
      //     title: remoteMessage.notification.title,
      //     bigPictureUrl: remoteMessage.notification.android.imageUrl,
      //     smallIcon: remoteMessage.notification.android.imageUrl,
      //     playSound:true,
      //     soundName:'sound.mp3',
      //     vibrate:false,
      //   });
      // }
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('This is the remote message: ');
      console.log(remoteMessage);
      const {notification, messageId} = remoteMessage;
      if (Platform.OS === 'ios') {
        PushNotificationIoS.addNotificationRequest({
          id: messageId,
          title: notification.title,
          body: notification.body,
          sound: 'sound.mp3',
        });
        // notification = remoteMessage;
        // onNotification(notification);
      } else {
        console.log('About to send the local notification: ');
        PushNotification.localNotification({
          channelId: 'your-channel-id', // Use the channel ID here
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          bigPictureUrl: remoteMessage.notification.android.imageUrl,
          smallIcon: remoteMessage.notification.android.imageUrl,
          playSound: true,
          soundName: 'sound.mp3',
          vibrate: false,
        });
      }
    });

    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
