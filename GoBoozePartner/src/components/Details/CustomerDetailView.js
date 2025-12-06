import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {IMAGES} from '../../constants/Constant';
import DetailsView from '../DetailsView';

const CustomerDetailView = ({orderId, mobileNumber, name, address = 'NA',instructions}) => {
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
      <DetailsView
        id="3"
        image={IMAGES.BOX}
        title={'Address:'}
        value={address}
      />
      <DetailsView
      style={{color:'#D3178A'}}
        id="4"
        image={IMAGES.BOX}
        title={'Instructions:'}
        value={instructions}
      />
    </View>
  );
};

export default CustomerDetailView;

const styles = StyleSheet.create({});
