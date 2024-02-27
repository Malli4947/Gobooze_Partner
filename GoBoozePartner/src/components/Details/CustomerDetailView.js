import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {IMAGES} from '../../constants/Constant';
import DetailsView from '../DetailsView';

const CustomerDetailView = ({orderId, mobileNumber, name}) => {

  return (
    <View style={{}}>
      <DetailsView id="0" image={IMAGES.BOX} title={'Order:'} value={orderId} />
      <DetailsView
        id="1"
        image={IMAGES.CUSTOMER}
        title={'Customer:'}
        value={name}
      />
      <DetailsView
        id="2"
        image={IMAGES.BOX}
        title={'Mobile Number:'}
        value={mobileNumber}
      />
    </View>
  );
};

export default CustomerDetailView;

const styles = StyleSheet.create({});
