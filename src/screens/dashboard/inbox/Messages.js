import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Container from '../../../components/Container';
import AppHeader from '../../../components/AppHeader';
import ResponsiveText from '../../../components/ResponsiveText';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen/index';
import Fonts from '../../../themes/Fonts';
import InputField from '../../../components/InputField';
import {messages} from '../../../components/DummyData';
import MessageBubble from '../../../components/MessageBubble';
// import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker'
import {Colors} from '../../../themes/Colors';
import {connect} from 'react-redux';
import {manageAllMessages, manageFilesObject, manageSendingQueue, selectCurrentChannel} from '../../../redux/groups/actions';
import LottieView from 'lottie-react-native';

const options = {
  title: 'Select Picture',
  quality: 0.75,
  storageOptions: {
    skipBackup: true,
  },
};

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: messages,
      text: '',
      payload: null,
    };
  }

  pickPayload = async() => {
    const {Client} = this.props.route.params;
    const pickerResult = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
      readContent:true
    })

    //console.log('picker result-->',pickerResult);
    if(pickerResult.size<=6000000){
    const filePath=Platform.OS === 'android'
    ? pickerResult.uri
    : pickerResult.uri.replace('file://', '')
  
  const fileBase64=await RNFS.readFile(filePath,"base64")


  let orignalBase64= "data:"+pickerResult.type+";"+"base64,"+fileBase64;
  //console.log("*base*",orignalBase64,'this is base64-->');

  

  //console.log("in sending file-->");
  let idd = new Date().getTime().toString();
  let type = "file";
  let filetype = pickerResult.type;
  if (filetype.includes("image")) {
    type = "image";
  } else if (filetype.includes("audio")) {
    type = "audio";
  } else if (filetype.includes("video")) {
    type = "video";
  }
  
  let object = {
    id: idd,
    from: this.props.user.ref_id,
    topic: this.props.currentChannel.channel_name,
    to: this.props.currentChannel.channel_name,
    key: this.props.currentChannel.channel_key,
    type: type,
    // isGroupMessage: this.props.currentChannel.auto_created == 0,
    date: idd,
    ext:pickerResult.name.split('.')[1],
    localpath:filePath

  };


  //console.log('this is object to be send-->',object);
  Client.SendFile(fileBase64,object,true);

  }
    else{
      alert('Cannot send file greater than 6 mb')
    }


  };
  _onBlur = () => {
    const {Client} = this.props.route.params;

    clearTimeout(this.timeOut);
    setTimeout(() => {
      //console.log("on blur-->");
      let typingMessage = {
        from: this.props.user.ref_id,
        content: "0",
        id: new Date().getTime().toString(),
        size: 0,
        key: this.props.currentChannel.channel_key,
        type: "typing",
        to: this.props.currentChannel.channel_name,
        isGroupMsg: this.props.currentChannel.auto_created == 0,
      };
     Client.SendMessage(typingMessage);
    }, 0);
  };

  sendMessage = () => {
    const {Client} = this.props.route.params;

    if (this.state.text.trim().length === 0) {
      //console.log("cannot send empty message==>");
    } else if (this.state.text.trim().length > 400) {
      //console.log("message cannot be greater then 400 characters==>");
      ToastAndroid.showWithGravity(
        'cannot send msg with characters greater then 400!',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
     
    } else {
      let idd = new Date().getTime().toString();
      let msg = {
        status: 1,
        size: 0,
        type: "text",
        isGroupMessage: this.props.currentChannel.auto_created == 0,
        from: this.props.user.ref_id,
        content: this.state.text.trim(),
        id: idd,
        date: new Date().getTime(),
        key: this.props.currentChannel.channel_key,
        to: this.props.currentChannel.channel_name,
      };
      let sendingqueue = [...this.props.sendingQueue];
      sendingqueue.push(idd);
      this.props.manageSendingQueue([...sendingqueue]);

      Client.SendMessage(msg);

      let msgobj = this.props.allRoomsMessages;
      let currentmsgsAray = [
        ...new Set(msgobj[this.props.currentChannel.channel_name]),
      ];
      msg["seen_by"] = [];
      currentmsgsAray.push(msg);
      msgobj[this.props.currentChannel.channel_name] = [...currentmsgsAray];
      this.props.manageAllMessages({ ...msgobj });
      this.setState({ text: "" });
      // this.nameInput.blur();
      this._onBlur();
      // this.nameInput.focus();
    }
  };
  componentDidMount(){
  
  }

  render() {
    const {chat, payload} = this.state;
    const {Client} = this.props.route.params;
    let typingchannel =
      (this.props.currentChannel && this.props.currentChannel.channel_name &&
        this.props.typingUsers[this.props.currentChannel.channel_name]) ||
      [];
    let length =
      this.props.onlineUsers[this.props.currentChannel.channel_name].filter(
        u => u.username !== this.props.user.ref_id,
      ).length || 0;

      let currentmsgs =
      this.props.allRoomsMessages[this.props.currentChannel.channel_name];

    //console.log('client-->', Client);
    return (
      <Container style={{flex: 1}}>
        <AppHeader
          titleLeftAlign
          containerStyle={styles.header}
          left={
            <View style={styles.leftIconContainer}>
              <Image
                source={require('../../../assets/icons/left_chevron2.png')}
                style={styles.HeaderleftIcon}
              />
            </View>
          }
          leftPress={() => this.props.navigation.goBack()}
          typing={
            typingchannel.length > 0 ? (
              <ResponsiveText style={{color: '#00AF59'}}>
                {typingchannel.length == 1
                  ? `${
                      this.props.allUsers.find(
                        e => e.ref_id == typingchannel[0],
                      ).username
                    } is Typing...`
                  : `${
                      this.props.allUsers.find(
                        e => e.ref_id == typingchannel[0],
                      ).username
                    } and ${typingchannel.length - 1} others are Typing...`}
              </ResponsiveText>
            ) : null
          }
          body={
            <ResponsiveText style={styles.headertitle}>
              {this.props.currentChannel.auto_created == 0
                ? this.props.currentChannel.group_title
                : this.props.currentChannel.group_title.includes('-')
                ? this.props.currentChannel.group_title
                    .split('-')
                    .find(e => e !== this.props.user.username)
                : this.props.currentChannel.group_title}
            </ResponsiveText>
          }
          right={
            this.props.currentChannel.auto_created == 0 ? (
              <ResponsiveText style={{color: 'green'}}>
                {length + 1}/{this.props.currentChannel.participants.length}
              </ResponsiveText>
            ) : (
              <ResponsiveText
                style={{
                  color: length > 0 ? 'green' : 'grey',
                  opacity: length > 0 ? 1 : 0.5,
                }}>
                {length > 0 ? 'Online' : 'offline'}
              </ResponsiveText>
            )
          }
        />
        <View style={styles.clearFix} />
        <FlatList
          ref={ref => (this.flatList = ref)}
      onContentSizeChange={()=>{
      this.flatList.scrollToEnd({animated: true});
      }}
      onLayout={()=>{
        this.flatList.scrollToEnd({animated: true});
        }}
          data={currentmsgs}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => {
            return (
              <MessageBubble
               currentmsgs={currentmsgs}
                  item={item}
                  key={item.id}
                  index={index}
                  sending={this.props.sendingQueue.findIndex((e) => e == item.id) > -1}
            
              />
              // <ResponsiveText>message received</ResponsiveText>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                {
                  <>
                    {/* <View style={{height: 300, width: 300, opacity: 0.6}}>
                          <LottieView
                            source={require('../../../assets/json/empty.json')}
                            autoPlay
                            loop
                          />
                        </View> */}
                    <ResponsiveText
                      style={{
                        opacity: 0.7,
                        color: Colors.Primary,
                        fontSize: 6,
                      }}>
                      No Messages Yet
                    </ResponsiveText>
                    <ResponsiveText
                      style={{
                        opacity: 0.7,
                        color: Colors.Primary,
                        marginTop: 10,
                      }}>
                      Send message to start conversation.
                    </ResponsiveText>
                  </>
                }
              </View>
            );
          }}
        />
        {payload && (
          <View
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              bottom: 80,
            }}>
            <View style={{height: 60, width: 60, marginLeft: 20}}>
              <Image
                source={{uri: this.state.payload.uri}}
                style={{height: 60, width: 60, borderRadius: 5}}
              />
              <TouchableOpacity
                onPress={() => this.setState({payload: null})}
                style={styles.imageCrossContainer}>
                <Image
                  source={require('../../../assets/icons/cross.png')}
                  style={styles.crossIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.sendInputContainer}>
          <InputField
            CameraPress={this.pickPayload}
            ref={(input) => {
              this.nameInput = input;
            }}
            onBlur={this._onBlur}
            CameraIcon={true}
            placeholder={'Write your message here ...'}
            inputField={{fontSize: wp('3.3')}}
            containerStyle={styles.SendInput}
            value={this.state.text}
            right={
              <View style={styles.sendButton}>
                <Image
                  source={require('../../../assets/icons/send.png')}
                  style={styles.sendIcon}
                />
              </View>
            }
            // placeholderTextColor={'#B7B7B7'}
            rightPress={
            
              this.state.text.trim().length > 0 || this.state.payload
                ? this.sendMessage
                : null
            }
            rightStyle={{padding: 0, marginRight: -5}}
            onChangeText={e => {this.setState({text: e})
            let typingMessage = {
              from: this.props.user.ref_id,
              content: "1",
              id: new Date().getTime().toString(),
              size: 0,
              key: this.props.currentChannel.channel_key,
              type: "typing",
              to: this.props.currentChannel.channel_name,
              isGroupMsg: this.props.currentChannel.auto_created == 0,
            };
            Client.SendMessage(typingMessage);
            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(() => {
              // this.nameInput.blur();
              this._onBlur();
            }, 3000);
          }}
          />
        </View>
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setCurrentChannel: channel => dispatch(selectCurrentChannel(channel)),
    manageAllMessages: (messagesObj) =>
      dispatch(manageAllMessages(messagesObj)),
    manageSendingQueue: (queueArray) =>
      dispatch(manageSendingQueue(queueArray)),
      manageFilesObject: (filesObject) =>
      dispatch(manageFilesObject(filesObject)),

    // reduxstoreUserInfo: (user) => dispatch(storeUserInfo(user)),
    // reduxlogoutUser: () => dispatch(logoutUser()),
    // setGroups: (groups) => dispatch(storeGroups(groups)),
  };
};
const mapStateToProps = state => {
  //console.log('redux state==>', state);
  return {
    user: state.user.user,
    groups: state.group.groups,
    currentChannel: state.group.currentChannel,
    onlineUsers: state.group.onlineUsers,
    allRoomsMessages: state.group.allRoomsMessages,
    typingUsers: state.group.typingUsers,
    allUsers: state.group.allUsers,
    sendingQueue: state.group.sendingQueue,
    filesObject: state.group.filesObject,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

const styles = {
  header: {
    backgroundColor: Colors.PrimaryLight,
  },
  leftIconContainer: {
    padding: 7,
  },
  HeaderleftIcon: {
    height: wp('3.5'),
    width: wp('3.5'),
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNotificationIcon: {
    height: wp('8'),
    width: wp('8'),
    resizeMode: 'contain',
  },
  headertitle: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 5.5,
  },
  clearFix: {
    height: wp('0.4'),
    backgroundColor: '#E1E1E1',
    // marginBottom:wp('4')
  },
  sendInputContainer: {
    height: wp('20'),
    width: wp('100'),
    // position: 'absolute',
    bottom: 0,
    // backgroundColor: 'green',
    borderTopWidth: wp('0.3'),
    borderTopColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingRight:0
  },
  SendInput: {
    width: wp('91'),
    backgroundColor: '#F2F2F2',
    paddingLeft: wp('4'),
    borderWidth: 0,
    borderRadius: wp('10'),
    height: wp('13'),
    paddingRight: 2,

    // marginBottom: wp('6'),
  },
  sendButton: {
    height: wp('10'),
    width: wp('10'),
    borderRadius: wp('10'),
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    height: wp('5.5'),
    width: wp('5.5'),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  contentContainer: {
    flexGrow: 1,
    // justifyContent: 'flex-end',
    paddingVertical: wp('2.2'),
  },
  imageCrossContainer: {
    backgroundColor: '#0089FF',
    position: 'absolute',
    height: 28,
    width: 28,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    right: -5,
    top: -5,
    borderWidth: 1,
    borderColor: 'white',
  },
  crossIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    tintColor: 'white',
  },
};
