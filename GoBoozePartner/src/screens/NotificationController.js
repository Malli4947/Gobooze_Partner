import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
//latest changes
const NotificationController = props => {
  useEffect(() => {
    // Create a channel for Android notifications
    PushNotification.createChannel(
      {
        channelId: 'your-channel-id', // Replace with your desired channel ID
        channelName: 'Your Channel Name', // Channel name
        channelDescription: 'A channel to categorize your notifications', // Description
        sound: 'default', // Sound for notifications
        importance: PushNotification.Importance.HIGH, // Importance level
        vibrate: true, // Vibration
      },
      created => console.log(`CreateChannel returned '${created}'`),
    );

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        channelId: 'your-channel-id', // Use the channel ID here
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
      });
    });

    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
