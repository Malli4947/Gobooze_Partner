import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;


export const rWidth = size => shortDimension / guidelineBaseWidth * size;
export const rHeight = size => longDimension / guidelineBaseHeight * size;
