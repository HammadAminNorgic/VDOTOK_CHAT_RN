import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Modal,
  Dimensions
} from 'react-native';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ResponsiveText from './ResponsiveText';
import Fonts from '../themes/Fonts';
import ImageZoom from 'react-native-image-pan-zoom';

import Spinner from 'react-native-spinkit';

import {Colors} from '../themes/Colors';
import {connect} from 'react-redux';
import VideoPlayer from 'react-native-video-player';
import FileViewer from "react-native-file-viewer";

const MessageBubble = props => {
  const {currentmsgs, item, key, index, sending} = props;
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  // console.log(item);

  return (
    <View style={styles.container}>
      {/* {item.type==='text' && ( */}
      <View
        style={{
          flexDirection: 'row',
          alignSelf:
            props.item.from !== props.user.ref_id ? 'flex-start' : 'flex-end',
          paddingHorizontal: wp('4'),
        }}>
        {props.item.from !== props.user.ref_id && (
          <View style={styles.headerprofileImageContainer}>
            <View style={styles.headerProfileImage}>
              <ResponsiveText>
                {props.allUsers
                  .find(e => e.ref_id == props.item.from)
                  .username.substring(0, 1)
                  .toUpperCase()}
              </ResponsiveText>
            </View>
          </View>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.item.from === props.user.ref_id && (
            <View style={{alignItems: 'flex-end', marginHorizontal: 10}}>
              {!sending && (
                <ResponsiveText
                  style={{
                    fontSize: 3.5,
                    fontFamily: Fonts.RobotoMedium,
                    opacity: 0.5,
                  }}>
                  Read {props.item.seen_by.length}
                </ResponsiveText>
              )}
              <ResponsiveText style={{fontSize: 3, opacity: 0.5}}>
                {new Date(props.item.date).toLocaleTimeString()}
              </ResponsiveText>
            </View>
          )}
          <View>
            {props.item.from !== props.user.ref_id && (
              <View style={{alignItems: 'flex-start', marginBottom: 2}}>
                {
                  <ResponsiveText style={{fontSize: 3.2, opacity: 0.5}}>
                    {
                      props.allUsers.find(e => e.ref_id == props.item.from)
                        .username
                    }
                  </ResponsiveText>
                }
              </View>
            )}

            <View
              style={{
                borderTopRightRadius:
                  props.item.from !== props.user.ref_id ? wp('4') : 0,
                borderTopLeftRadius:
                  props.item.from !== props.user.ref_id ? 0 : wp('4'),
                borderBottomLeftRadius: wp('4'),
                borderBottomRightRadius: wp('4'),
                overflow: 'hidden',
                backgroundColor: 'red',
                justifyContent: 'center',
                backgroundColor:
                  props.item.from !== props.user.ref_id ? '#F2F2F2' : '#fcf3b8',
              }}>
              {item.type === 'text' && (
                <ResponsiveText
                  style={{
                    backgroundColor:
                      props.item.from !== props.user.ref_id
                        ? '#F2F2F2'
                        : '#fcf3b8',
                    // alignSelf: sent_by !== 1 ? 'flex-start' : 'flex-end',
                    maxWidth: wp('50'),
                    padding: wp('3'),
                    fontSize: 3,
                    fontFamily: Fonts.OpenSansRegular,
                    // marginTop: wp('1'),
                  }}>
                  {item.content}
                </ResponsiveText>
              )}
              {item.type === 'image' && (
                <View style={styles.postImage}>
                  {item.loading ? (
                    <>
                    <View style={{position:'absolute',zIndex:2,backgroundColor:'red',padding:5,backgroundColor:'rgba(255,255,255,0.9)',borderRadius:10}}>
                    <Spinner
                      isVisible={true}
                      size={35}
                      type={'Wave'}
                      color={Colors.Primary}
                    />
                    </View>
                    <Image
                    source={{uri: props.filesObject[props.item.id]}}
                    style={styles.postImage}
                  />
                  </>
                  ) : (
                    <TouchableOpacity activeOpacity={0.9} onPress={async()=>{
                      // await  FileViewer.open(`file://${RNFS.DownloadDirectoryPath}/${item.content}.${item.ext}`);
                      setSelectedImage(props.filesObject[props.item.id]);
                      setImageModal(true);

                    }}>
                    <Image
                      source={{uri: props.filesObject[props.item.id]}}
                      style={styles.postImage}
                    />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {item.type === 'video' && (
                <View
                  style={{
                    height: 200,
                    width: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {item.loading ? (
                    <>
                      <Spinner
                        isVisible={true}
                        size={35}
                        type={'Wave'}
                        color={Colors.Primary}
                      />
                      <ResponsiveText style={{marginTop: 10}}>
                        Video
                      </ResponsiveText>
                    </>
                  ) : (
                    <>
                      <VideoPlayer
                        video={{
                          uri:props.item.from !== props.user.ref_id?`file://${RNFS.DownloadDirectoryPath}/${item.content}.${item.ext}`:props.filesObject[props.item.id],
                        }}
                        videoWidth={200}
                        videoHeight={200}
                        thumbnail={{
                          uri: 'https://i.picsum.photos/id/866/1600/900.jpg',
                        }}
                      />
                    </>
                  )}
                </View>
              )}
              {item.type === 'audio' && (
                <View
                  style={{
                    height: 50,
                    width: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {item.loading ? (
                    <>
                      <Spinner
                        isVisible={true}
                        size={20}
                        type={'Wave'}
                        color={Colors.Primary}
                      />
                      <ResponsiveText style={{marginTop: 5}}>
                        Audio
                      </ResponsiveText>
                    </>
                  ) : (
                    <>
                      <VideoPlayer
                        video={{
                          uri: props.item.from !== props.user.ref_id?`file://${RNFS.DownloadDirectoryPath}/${item.content}.${item.ext}`:props.filesObject[props.item.id],
                        }}
                        videoWidth={200}
                        videoHeight={50}
                        // style={{zIndex:2}}
                        thumbnail={{
                          uri: 'https://i.picsum.photos/id/866/1600/900.jpg',
                        }}
                      />
                      <View style={{position: 'absolute'}} pointerEvents="none">
                    <ResponsiveText style={{zIndex: 1}}>
                      Audio File
                    </ResponsiveText>
                  </View>
                    </>
                  )}
                  
                </View>
              )}
              {item.type === 'file' && (
                <View style={{alignItems:'center',justifyContent:"center",paddingHorizontal:15}}>
                  {item.loading ? (
                    <View style={{padding:10}}>
                    <Spinner
                      isVisible={true}
                      size={35}
                      type={'Wave'}
                      color={Colors.Primary}
                    />
                      </View>

                  ) : (
                    <TouchableOpacity
                    style={{alignItems:'center',justifyContent:'center',padding:10}}
                      onPress={async() => {
                        // console.log('hellow',`file://${RNFS.DownloadDirectoryPath}/${item.content}.${item.ext}`,RNFS.DocumentDirectoryPath,RNFS.DownloadDirectoryPath,RNFS.PicturesDirectoryPath,RNFS.ExternalStorageDirectoryPath,RNFS.DownloadDirectoryPath);
                       await  FileViewer.open(props.item.from !== props.user.ref_id?`file://${RNFS.DownloadDirectoryPath}/${item.content}.${item.ext}`:props.filesObject[props.item.id]);
                        // Linking.openURL(props.filesObject[props.item.id])
                        // .catch(
                        //   err => {console.error("Couldn't load page", err)}
                        // )
                      }}>
                      <Image source={item.ext==='pdf'?require('../assets/icons/pdf.png'):item.ext==='xlsx'?require('../assets/icons/xlsx.png'):item.ext==='txt'?require('../assets/icons/txt.png'):item.ext==='docx'?require('../assets/icons/docx.png'):item.ext==='json'?require('../assets/icons/json.png'):require('../assets/icons/file.png')} style={{height:40,width:40,resizeMode:'contain',marginBottom:5}}/>
                      <ResponsiveText style={{textDecorationLine: 'underline',color:'blue'}}>{item.ext} File</ResponsiveText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {/*  */}
            </View>
            {props.item.from !== props.user.ref_id && (
              <View style={{alignItems: 'flex-start', marginTop: 2}}>
                {
                  <ResponsiveText style={{fontSize: 2.8, opacity: 0.5}}>
                    {new Date(props.item.date).toLocaleTimeString()}
                  </ResponsiveText>
                }
              </View>
            )}
          </View>
          {sending && (
            <ActivityIndicator
              color={Colors.Primary}
              style={{height: 3, width: 3, marginLeft: 15}}
            />
          )}
        </View>
      </View>
      {/* )} */}
      {/* {false && (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: sent_by !== 1 ? 'flex-start' : 'flex-end',
              paddingHorizontal: wp('4'),
            }}>
            {sent_by !== 1 && (
              <View style={styles.headerprofileImageContainer}>
                <Image
                  source={{uri: profile_image}}
                  style={styles.headerProfileImage}
                />
              </View>
            )}
            <View
              style={{
                backgroundColor: sent_by !== 1 ? '#EEEEEE' : '#B7DEFF',
                // alignSelf: sent_by !== 1 ? 'flex-start' : 'flex-end',
                maxWidth: wp('63'),
                padding: wp('4'),
                borderTopRightRadius: sent_by !== 1 ? wp('6') : 0,
                borderTopLeftRadius: sent_by !== 1 ? 0 : wp('6'),
                borderBottomLeftRadius: wp('6'),
                borderBottomRightRadius: wp('6'),
                fontSize: 3,
                fontFamily: Fonts.OpenSansRegular,
                marginTop: wp('1'),
                justifyContent: 'space-between',
                alignItems: sent_by !== 1 ? 'flex-start' : 'flex-end',
              }}>
              <Image source={{uri: image_url}} style={styles.postImage} />
              {text.length > 0 && (
                <ResponsiveText style={styles.imageText}>{text}</ResponsiveText>
              )}
            </View>
          </View>
        )} */}
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={imageModal}
            onRequestClose={() => {
              setImageModal(false);
              setSelectedImage(null);
            }}>
            <View style={styles.imageViewerContainer}>
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zindex: 0,
                  opacity: 0.3,
                }}
                color={'black'}
                size={'large'}
              />
              <TouchableOpacity
                onPress={() => {
                  setImageModal(false);
                  setSelectedImage(null);
                }}
                style={{
                  padding: 5,
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  zIndex: 20,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                <Image
                  source={require('../assets/icons/cross.png')}
                  style={{height: 40, width: 40, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={wp(100)}
                imageHeight={hp(100)}>
                <Image
                  source={{uri: selectedImage}}
                  style={{
                    height: hp(100),
                    width: wp(100),
                    resizeMode: 'contain',
                  }}
                />
              </ImageZoom>
            </View>
          </Modal>
    </View>
  );
};
const mapStateToProps = state => {
  return {
    user: state.user.user,
    currentChannel: state.group.currentChannel,
    allRoomsMessages: state.group.allRoomsMessages,
    sendingQueue: state.group.sendingQueue,
    allUsers: state.group.allUsers,
    filesObject: state.group.filesObject,
  };
};

export default connect(mapStateToProps, null)(MessageBubble);

const styles = {
  container: {
    marginVertical: wp('2'),
    // flex: 1,
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textStyle: {},
  headerProfileImage: {
    height: wp('7'),
    width: wp('7'),
    borderRadius: wp('7'),
    backgroundColor: Colors.PrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',

    // resizeMode:'contain'
    // padding:wp('5')
  },
  headerprofileImageContainer: {
    height: wp('10'),
    width: wp('10'),
    borderRadius: wp('10'),
    borderWidth: wp('0.6'),
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3'),
  },
  postImage: {
    height: wp('38'),
    width: wp('35'),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:1
    // margin:10
    // resizeMode: 'contain',
  },
  imageText: {
    marginTop: wp('3'),
    fontSize: 3,
    fontFamily: Fonts.OpenSansRegular,
  },
  imageViewerContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  // bubble:
};
