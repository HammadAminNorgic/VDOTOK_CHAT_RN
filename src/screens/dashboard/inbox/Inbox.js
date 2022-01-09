import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import * as MVDOTOK from '../../../assets/js/vdotok-messaging';
import RNFS from 'react-native-fs';


import Container from '../../../components/Container';
import AppHeader from '../../../components/AppHeader';
import InputField from '../../../components/InputField';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen/index';
import Fonts from '../../../themes/Fonts';
import ResponsiveText from '../../../components/ResponsiveText';
import {Chats} from '../../../components/DummyData';
import ChatCard from '../../../components/ChatCard';
import {Colors} from '../../../themes/Colors';
import {logoutUser, storeUserInfo} from '../../../redux/user/actions';
import {
  manageAllMessages,
  manageFilesObject,
  manageOnlineUsers,
  manageSendingQueue,
  manageTypingUsers,
  selectCurrentChannel,
  storeAllUsers,
  storeGroups,
} from '../../../redux/groups/actions';
import Group from '../../../services/Group';
import SingleUserCard from '../../../components/HashtagCard';
import CreateGroupUserCard from '../../../components/CreateGroupUserCard';
import Snackbar from 'react-native-snackbar';
import Button from '../../../components/Button';
import Spinner from 'react-native-spinkit';

class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      Client: {},
      fetchingGroups: true,
      fetchingUsers: true,
      createChatModal: false,
      createGroupChat: false,
      searchText: '',
      searchGroupText: '',
      selectedUsers: [],
      groupNameModal: false,
      groupName: '',
      createGroupLoading: false,
      groupnameError: '',
      loadingModal: true,
      groupToRename: {},
      renameGroupPopup: false,
      renameValue: '',
      renamingGroup:false,
      renameError:'',
      refreshing:false
    };
    this.openRowRefs = [];
  }
  refresh=()=>{
    this.setState({refreshing:true})
    this.getAllUsers();
    this.getGroups();
  }

  onRowDidOpen = (rowKey, rowMap) => {
    this.openRowRefs.push(rowMap[rowKey]);
}
closeAllOpenRows() {
  this.openRowRefs.forEach(ref => {
    ref && ref.closeRow && ref.closeRow();
  });
}
  renameGroup = () => {
    if (this.state.renameValue.trim().length === 0) {
      this.setState({ renameError: "Please Enter Group Name !" });
    } else {
      this.setState({ renamingGroup: true });
      let data = {
        group_title: this.state.renameValue.trim(),
        group_id: this.state.groupToRename.id,
      };
      //console.log("==>", data);

      Group.renameGroup(data, this.props.user.auth_token)
        .then((res) => {
          //console.log("res on rename-->", res);
          if (res.data.status == 200) {
            ToastAndroid.showWithGravity(
              'Name Updated!',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );

            let tempgroups = [...this.props.groups];
            let indexx = tempgroups.findIndex(
              (e) => e.id === this.state.groupToRename.id
            );
            //console.log("group to rename index==>", indexx);
            tempgroups[indexx].group_title = data.group_title;
            this.props.setGroups([...tempgroups]);
            this.setState({
              renameGroupPopup: false,
              groupToRename: {},
              renamingGroup: false,
              renameError: "",
              renameValue: "",
            });
          }else{
            alert(res.data.message)
          }
        })
        .catch((err) =>
         console.log(err)
        )
        .finally(() => {
          this.setState({ renamingGroup: false,renameValue: "", });
        this.closeAllOpenRows()

        });
    }
  };

  deleteGroupPopup = (group) => {
    if (group.admin_id !== this.props.user.user_id) {
      
      ToastAndroid.showWithGravity(
        'Only admin can delete !',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      
     
    } else {
    this.deleteChat(group)
    }
  };

  deleteChat = (group) => {
    this.setState({ loadingModal: true });
    let data = {
      group_id: group.id,
    };
    Group.deleteGroup(data, this.props.user.auth_token)
      .then((res) => {
        //console.log("res on delete group==>", res);
        if (res.data.status == 200) {
          // if (
          //   this.props.currentChannel && this.props.currentChannel.channel_key ===
          //   group.channel_key
          // ) {
          //   this.props.setCurrentChannel(null);
          // }
          let tempgroups = [...this.props.groups];
          let indexx = tempgroups.findIndex(
            (e) => e.id === group.id
          );
          //console.log("group to delete index==>", indexx);
          tempgroups.splice(indexx, 1);
          this.props.setGroups([...tempgroups]);

          let mngonline = this.props.onlineUsers;
          delete mngonline[group.channel_name];
          this.props.manageOnlineUsers({ ...mngonline });

          let allMessages = this.props.allRoomsMessages;
          delete allMessages[group.channel_name];
          this.props.manageAllMessages({ ...allMessages });

          let typingobjj = this.props.typingUsers;
          delete typingobjj[group.channel_name];
          this.props.manageTypingUsers({ ...typingobjj });

          this.state.Client.UnSubscribe({
            key: group.channel_key,
            channel: group.channel_name,
          });
         
        }
      })
      .catch((err) => {
        //console.log("err on delete group==>", err);
      })
      .finally(() => {
        this.setState({ loadingModal: false });
        this.closeAllOpenRows()
      });
  };

  createOnetoOnegroup = user => {
    //console.log('one to one user===>', user);
    this.setState({loadingModal: true});
    let data = {
      group_title: `${user.full_name}-${this.props.user.full_name}`,
      participants: [user.user_id],
      auto_created: 1,
    };
    Group.createNewGroup(data, this.props.user.auth_token)
      .then(res => {
        //console.log('res on create one to one group==>', res);
        if (res.data.status === 200) {
          if (res.data.group.channel_key && res.data.group.channel_name) {
            if (!res.data.is_already_created) {
              let mngonline = this.props.onlineUsers;
              mngonline[res.data.group.channel_name] = [];
              this.props.manageOnlineUsers(mngonline);

              let allMessages = this.props.allRoomsMessages;
              allMessages[res.data.group.channel_name] = [];
              this.props.manageAllMessages(allMessages);

              let typingObj = this.props.typingUsers;
              typingObj[res.data.group.channel_name] = [];
              this.props.manageTypingUsers({...typingObj});

              let tempgroups = this.props.groups;
              tempgroups.unshift(res.data.group);
              this.props.setGroups([...tempgroups]);
              this.state.Client.Subscribe({
                key: res.data.group.channel_key,
                channel: res.data.group.channel_name,
              });
              ToastAndroid.showWithGravity(
                'Chat Created',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
              this.setState({
                createChatModal: false,
                createGroupChat: false,
                searchText: '',
                searchGroupText: '',
                selectedUsers: [],
                groupNameModal: false,
                groupName: '',
                createGroupLoading: false,
                groupnameError: '',
              });
            } else {
              // this.props.setCurrentChannel(res.data.group);
              ToastAndroid.showWithGravity(
                'Chat Already Present',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
            }
            // this.props.getGroups();
          } else {
            alert('channel Key or channel name is missing in api response ');
          }
        } else {
          alert(`${res.data.message}`);
        }
      })
      .catch(err => {
        //console.log('err on create one to one group==>', err);
        alert(`Unknown Error on create group Api`);
      })
      .finally(() => {
        this.setState({loadingModal: false});
      });
  };

  createGroup = () => {
    if (this.state.groupName.trim().length === 0) {
      this.setState({groupnameError: 'Please Enter Group Name !'});
    } else {
      this.setState({createGroupLoading: true, groupnameError: ''});
      let data = {
        group_title: this.state.groupName.trim(),
        participants: this.state.selectedUsers,
        auto_created: 0,
      };
      Group.createNewGroup(data, this.props.user.auth_token)
        .then(res => {
          //console.log('res on creategroup==>', res);
          if (res.data.status === 200) {
            // this.props.getGroups();
            if (res.data.group.channel_key && res.data.group.channel_name) {
              if (!res.data.is_already_created) {
                let mngonline = this.props.onlineUsers;
                mngonline[res.data.group.channel_name] = [];
                this.props.manageOnlineUsers({...mngonline});

                let allMessages = this.props.allRoomsMessages;
                allMessages[res.data.group.channel_name] = [];
                this.props.manageAllMessages({...allMessages});

                let typingObj = this.props.typingUsers;
                typingObj[res.data.group.channel_name] = [];
                this.props.manageTypingUsers({...typingObj});

                let tempgroups = this.props.groups;
                tempgroups.unshift(res.data.group);
                this.props.setGroups([...tempgroups]);
                this.state.Client.Subscribe({
                  key: res.data.group.channel_key,
                  channel: res.data.group.channel_name,
                });
                ToastAndroid.showWithGravity(
                  'Group Created !',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              } else {
                ToastAndroid.showWithGravity(
                  'Chat Already Exists !',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
                // this.props.setCurrentChannel(res.data.group);
              }

              this.setState({
                createChatModal: false,
                createGroupChat: false,
                searchText: '',
                searchGroupText: '',
                selectedUsers: [],
                groupNameModal: false,
                groupName: '',
                createGroupLoading: false,
                groupnameError: '',
              });
            } else {
              this.setState({
                createGroupLoading: false,
                groupnameError:
                  'channel Key or channel name is missing in api response !',
              });
            }
          } else {
            this.setState({groupnameError: res.data.message});
          }
        })
        .catch(err => {
          //console.log('err on create group==>', err);
          this.setState({
            groupnameError: 'Unknown Error',
            createGroupLoading: false,
          });
        });

      //console.log(data);
    }
  };
  selectUsertoCreateGroup(user) {
    //console.log('onclick single user==>', user);
    if (this.state.selectedUsers.findIndex(e => e == user.user_id) > -1) {
      let arr = [...this.state.selectedUsers];
      arr.splice(
        this.state.selectedUsers.findIndex(e => e == user.user_id),
        1,
      );
      this.setState({selectedUsers: [...arr]});
    } else {
      if (this.state.selectedUsers.length < 4) {
        this.setState({
          selectedUsers: this.state.selectedUsers.concat(user.user_id),
        });
      } else {
        ToastAndroid.showWithGravity(
          'Cannot Select More than 4 participants',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    }
  }

  getAllUsers = () => {
    let data = {};
    this.setState({fetchingUsers: true});
    Group.getAllUsers({}, this.props.user.auth_token)
      .then(res => {
        //console.log('res on allUsers==>', res);
        if (res.data.status === 200) {
          if (res.data.users.length !== this.props.allUsers.length) {
            //console.log('length not equal');
            this.props.storeAllUsers([...res.data.users]);
          }
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        //console.log('err on getallusers', err);
        // alert('some thing went wrong')
      })
      .finally(() => {
        this.setState({fetchingUsers: false});
      });
  };
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.setCurrentChannel(null);
      this.closeAllOpenRows()
    });
    this.getAllUsers();

    setTimeout(() => {
      this.initializeChatSdk();
    }, 50);
  }
  componentWillUnmount() {
    //console.log('unmounting login');
    this.disconnectSDK();
  }

  subscribeChannels = groups => {
    groups.forEach(e => {
      // this.state.Client.UnSubscribe(e);
      this.state.Client.Subscribe(e);
    });
  };

  disconnectSDK = () => {
    this.state.Client.Disconnect();
  };

  setOnlineSubscribers = res => {
    let onlineObject = this.props.onlineUsers;
    let arr = [];
    res.who.forEach(e => {
      //console.log('in for each-->', e);
      if (arr.findIndex(a => a.username == e.username) == -1) {
        //console.log('subscribing user-->', e);
        arr.push(e);
      }
    });
    onlineObject[res.channel] = arr;
    this.props.manageOnlineUsers({...onlineObject});
  };

  setUserOffline = res => {
    let onlineObject = this.props.onlineUsers;
    let arr = [...new Set(onlineObject[res.channel])];
    let ind = arr.findIndex(e => e.username === res.who.username);

    if (ind > -1) {
      arr.splice(ind, 1);
      onlineObject[res.channel] = [...arr];
      this.props.manageOnlineUsers({...onlineObject});
    }
  };

  setUserOnline = res => {
    let onlineObject = this.props.onlineUsers;
    let arr = [...new Set(onlineObject[res.channel])];
    let ind = arr.findIndex(e => e.username === res.who.username);
    //console.log('setting online->', res.who, ind);

    if (ind == -1) {
      //console.log('pushing online->', res.who);
      arr.push(res.who);
      onlineObject[res.channel] = [...arr];
      this.props.manageOnlineUsers({...onlineObject});
    }
  };

  onOtherMessageReceived = response => {
    let res = response;
    //console.log('** on message from other in funct-->', res);

    if (res.type == 'typing') {
      if (res.content == '1') {
        let tempTyping = this.props.typingUsers;
        let arr = [...new Set(tempTyping[res.to])];
        let indexx = arr.findIndex(e => e === res.from);
        if (indexx == -1) {
          arr.push(res.from);
          tempTyping[res.to] = [...arr];
          this.props.manageTypingUsers({...tempTyping});
        }
      } else if (res.content == '0') {
        let tempTyping = this.props.typingUsers;
        let arr = [...new Set(tempTyping[res.to])];
        let indexx = arr.findIndex(e => e === res.from);

        if (indexx > -1) {
          arr.splice(indexx, 1);
          tempTyping[res.to] = [...arr];
          this.props.manageTypingUsers({...tempTyping});
        }
      }
    }

    if (res.receiptType) {
      //console.log('** this is receipt model message', res);
      if (res.receiptType === 3) {
        let msgobj = this.props.allRoomsMessages;
        let currentmsgsAray = [...new Set(msgobj[res.to])];
        let indexx = currentmsgsAray.findIndex(e => e.id === res.messageId);
        if (indexx > -1) {
          if (currentmsgsAray[indexx].seen_by) {
            if (
              currentmsgsAray[indexx].seen_by.findIndex(l => l == res.from) > -1
            ) {
            } else {
              currentmsgsAray[indexx].seen_by.push(res.from);
              msgobj[res.to] = [...currentmsgsAray];
              this.props.manageAllMessages({...msgobj});
            }
          }
        }
      }
    }

    if (res.type === 'text') {
      let msgobj = this.props.allRoomsMessages;
      let currentmsgsAray = [...new Set(msgobj[res.to])];
      res['send_receipt'] = false;
      if (
        this.props.currentChannel &&
        res.to === this.props.currentChannel.channel_name
      ) {
        let receipt = {
          messageId: res.id,
          receiptType: 3,
          from: this.props.user.ref_id,
          key: res.key,
          to: res.to,
          date: new Date().getTime(),
        };
        this.state.Client.SendReceipt(receipt);
        res['send_receipt'] = true;
      }
      currentmsgsAray.push(res);
      msgobj[res.to] = [...currentmsgsAray];
      this.props.manageAllMessages({...msgobj});
    }

    if (res.type !== 'text' && res.type !== 'typing' && !res.receiptType) {
      if (!res.content) {
        let object = {};
        object['content'] = '';
        object['date'] = new Date().getTime();
        object['ext'] = res.ext;
        object['filename'] = res.filename;
        object['from'] = res.from;
        object['id'] = res.id;
        object['isBuffering'] = res.isBuffering;
        object['isGroupMessage'] = res.isGroupMessage;
        object['key'] = res.key;
        object['seen_by'] = res.seen_by;
        object['size'] = res.size;
        object['status'] = res.status;
        object['subtype'] = res.subtype;
        object['to'] = res.to;
        object['type'] = res.type;
        object['seen_by'] = [];
        object['loading'] = true;
        object['send_receipt'] = false;

        if (
          this.props.currentChannel &&
          res.to === this.props.currentChannel.channel_name
        ) {
          let receipt = {
            messageId: res.id,
            receiptType: 3,
            from: this.props.user.ref_id,
            key: res.key,
            to: res.to,
            date: new Date().getTime(),
          };
          this.state.Client.SendReceipt(receipt);
          object['send_receipt'] = true;
        }

        // object['content']=res.id
        let msgobj = this.props.allRoomsMessages;
        let currentmsgsAray = [...new Set(msgobj[res.to])];
        let msgindex = currentmsgsAray.findIndex(e => e.id == res.id);
        if (msgindex == -1) {
          currentmsgsAray.push(object);
          msgobj[res.to] = [...currentmsgsAray];
          this.props.manageAllMessages({...msgobj});
        }
      } else if (res.content) {
        const path = `file://${RNFS.DownloadDirectoryPath}/${res.id}.${res.ext}`;
                        //console.log('path-->',path);
                        RNFS.writeFile(path,res.content.split('base64,')[1], 'base64')
                          .then(success => {
                            //console.log('FILE WRITTEN: ', );
                            let msgobj = this.props.allRoomsMessages;
        let currentmsgsAray = [...new Set(msgobj[res.to])];
        let indexx = currentmsgsAray.findIndex(e => e.id == res.id);
        if (indexx > -1) {
          let temp = this.props.filesObject;
          temp[res.id] = path;
          this.props.manageFilesObject({...temp});

          currentmsgsAray[indexx]['content'] = res.id;
          currentmsgsAray[indexx]['loading'] = false;

          msgobj[res.to] = [...currentmsgsAray];

          this.props.manageAllMessages({...msgobj});
        }
                          })
                          .catch(err => {
                            //console.log('File Write Error: ', err.message);
                            alert(err.message)
                          });
        
      }
    }
  };
  onMyMessageReceived = res => {
    // console.log('** on my msg in funct-->', res.type === 'text', res);
    if (res.type === 'text') {
      let sendingqueue = [...this.props.sendingQueue];
      //console.log('** on my msg in funct-->sending queue-->', sendingqueue);

      let indexx = sendingqueue.findIndex(e => e == res.id);
      // //console.log(
      //   '** on my msg in funct-->sending queue--> ',
      //   indexx,
      //   sendingqueue,
      // );
      if (indexx > -1) {
        sendingqueue.splice(indexx, 1);
        this.props.manageSendingQueue([...sendingqueue]);
      }
    }
    if (res.type !== 'text' && res.type !== 'typing' && !res.receiptType) {
      if (!res.content) {

        let temp = this.props.filesObject;
        temp[res.id] = res.size; //just for now will be changed later .. gettign local path in size
        this.props.manageFilesObject({...temp});

        let object = {};
        object['content'] = res.id;
        object['date'] = new Date().getTime();
        object['ext'] = res.ext;
        object['filename'] = res.filename;
        object['from'] = res.from;
        object['id'] = res.id;
        object['isBuffering'] = res.isBuffering;
        object['isGroupMessage'] = res.isGroupMessage;
        object['key'] = res.key;
        object['seen_by'] = res.seen_by;
        object['localpath'] = res.localpath;
         object['size'] = res.size;
        object['status'] = res.status;
        object['subtype'] = res.subtype;
        object['to'] = res.to;
        object['type'] = res.type;
        object['seen_by'] = [];
        object['loading'] = true;
        let msgobj = {...this.props.allRoomsMessages};
        let currentmsgsAray = [...msgobj[res.to]];
        let msgindex = currentmsgsAray.findIndex(e => e.id == res.id);
        if (msgindex == -1) {
          currentmsgsAray.push(object);
          msgobj[res.to] = [...currentmsgsAray];
          this.props.manageAllMessages({...msgobj});
        
        }
      } else if (res.content) {

                              //console.log('FILE WRITTEN: ', );
                              let msgobj = this.props.allRoomsMessages;
          let currentmsgsAray = [...new Set(msgobj[res.to])];
          let indexx = currentmsgsAray.findIndex(e => e.id == res.id);
          if (indexx > -1) {
            currentmsgsAray[indexx]['loading'] = false;
            msgobj[res.to] = [...currentmsgsAray];
            this.props.manageAllMessages({...msgobj});
          }
                            
                    
          
        

      
      }
    }
  };

  getGroups = () => {
    this.setState({fetchingGroups: true, loadingModal: true});
    // this.props.setCurrentChannel(null);
    Group.getGroups(null, this.props.user.auth_token)
      .then(res => {
        //console.log('res on getgroups-->', res);
        if (res.data.status === 200) {
          let grpsToSubscribe = [];
          let manageOnlineObj = {};
          let allRoomsMessages = this.props.allRoomsMessages;
          let typingObj = {};
          let newArrayOfGroups = [];
          let sendingQueue=[]

          if (res.data.groups.length > 0) {
            res.data.groups.forEach(e => {
              if (e.channel_name.length > 0 && e.channel_key.length > 0) {
                manageOnlineObj[e.channel_name] = [];
                if (!allRoomsMessages.hasOwnProperty(e.channel_name)) {
                  allRoomsMessages[e.channel_name] = [];
                }
                typingObj[e.channel_name] = [];

                grpsToSubscribe.push({
                  key: e.channel_key,
                  channel: e.channel_name,
                });

                newArrayOfGroups.push(e);
              }
            });
            this.props.manageOnlineUsers(manageOnlineObj);
            this.props.manageAllMessages({...allRoomsMessages});
            this.props.manageTypingUsers(typingObj);
            this.props.manageSendingQueue([...sendingQueue])

            this.subscribeChannels(grpsToSubscribe);
          }

          this.props.setGroups([...newArrayOfGroups]);
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        //console.log('err on getgroups==>', err);
      })
      .finally(() => {
        this.setState({
          loading: false,
          fetchingGroups: false,
          loadingModal: false,
          refreshing:false
        });
      });
  };

  initializeChatSdk = () => {
    // //console.log(
    //   'Mvdotk init-->',
    //   'host',
    //   `${this.props.user.messaging_server_map.protocol}://${this.props.user.messaging_server_map.host}:${this.props.user.messaging_server_map.port}`,
    //   'ref id->',
    //   this.props.user.ref_id,
    //   'auth token->',
    //   this.props.user.authorization_token,
    // );
    let Client = new MVDOTOK.Client({
      projectID: '176GK5IN',
      secret: '3d9686b635b15b5bc2d19800407609fa',
      host: `${this.props.user.messaging_server_map.protocol}://${this.props.user.messaging_server_map.host}:${this.props.user.messaging_server_map.port}`,
    });
    //console.log('client after initializing==>', Client);
    Client.Register(
      this.props.user.ref_id,
      this.props.user.authorization_token,
    );

    Client.on('connect', res => {
      //console.log('**res on connect sdk', res);
      ToastAndroid.showWithGravity(
        'SDK Connected',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      this.getGroups();
    });

    Client.on('subscribed', response => {
      //console.log('**res on subscribe  ', response);
      this.setOnlineSubscribers(response);
    });

    Client.on('online', response => {
      //console.log('**res on online  ', response);
      this.setUserOnline(response);
    });

    Client.on('create', response => {
      //console.log('**res on create  ', response);
    });

    Client.on('offline', response => {
      //console.log('**res on offline  ', response);
      this.setUserOffline(response);
    });

    Client.on('message', response => {
      //console.log('**res on message ', response);
      if (response.from == this.props.user.ref_id) {
        this.onMyMessageReceived(response);
      } else {
        this.onOtherMessageReceived(response);
      }
    });

    Client.on('messagesent', response => {
      // //console.log("**res on messagesent ",response);
    });

    this.setState({Client: Client});
  };

  cardPress = (unreadmsgs, item, index) => {
    if (unreadmsgs.length > 0) {
      unreadmsgs.forEach(e => {
        let receipt = {
          messageId: e.id,
          receiptType: 3,
          from: this.props.user.ref_id,
          key: e.key,
          to: e.to,
          date: new Date().getTime(),
        };
        //console.log('** before sendingreceipt');
        this.state.Client.SendReceipt(receipt);
        let msgobj = this.props.allRoomsMessages;
        let currentmsgsAray = msgobj[item.channel_name];
        let indexx = currentmsgsAray.findIndex(a => a.id == e.id);

        //console.log('this is message in loop->', currentmsgsAray[indexx]);
        if (index > -1) {
          currentmsgsAray[indexx].send_receipt = true;
          msgobj[item.channel_name] = [...currentmsgsAray];
          this.props.manageAllMessages({...msgobj});
        }
      });
    }
    this.props.setCurrentChannel(item);
    this.props.navigation.navigate('Messages', {
      // profile_image,
      // user_name,
      // time,
      // unseen_messsages,
      // last_message,
      Client: this.state.Client,
    });
  };
  render() {
    return (
      <Container
        barStyle={'dark-content'}
        statusBarColor={Colors.PrimaryLight}
        style={{flex: 1}}>
        <AppHeader
          titleLeftAlign
          containerStyle={styles.header}
          // left={
          //   <View style={styles.leftIconContainer}>
          //     {this.state.fetchingGroups ? (
          //       <View style={{height: wp(8), width: wp(8)}}>
          //         <LottieView
          //           source={require('../../../assets/json/refresh.json')}
          //           autoPlay
          //           loop
          //         />
          //       </View>
          //     ) : (
          //       <Image
          //         source={require('../../../assets/icons/refresh.png')}
          //         style={styles.HeaderleftIcon}
          //       />
          //     )}
          //   </View>
          // }
          body={
            <ResponsiveText style={styles.headertitle}>Inbox</ResponsiveText>
          }
          // leftPress={() => {
          //   if (!this.state.fetchingGroups) {
          //     this.getAllUsers();
          //     this.getGroups();
          //   }
          // }}
         
          
        />
        <View style={styles.clearFix} />
        <SwipeListView
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
        onRowDidOpen={this.onRowDidOpen}
        // closeOnRowOpen={false}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.hiddenView}>
              <View style={styles.singleHiddenButton}>
                <TouchableOpacity onPress={()=>{
                  if(data.item.auto_created==0){
                    this.setState({
                      groupToRename: data.item,
                      renameGroupPopup: true,
                      renameValue: data.item.group_title,
                    })
                  }else{
                    //console.log(rowMap);
                    ToastAndroid.showWithGravity(
                      'Only rename group chats ',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                    );
                  }
                }} style={styles.editButton}>
                  <Image
                    source={require('../../../assets/icons/edit.png')}
                    style={styles.buttonImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.singleHiddenButton}>
                <TouchableOpacity onPress={()=>this.deleteGroupPopup(data.item)} style={styles.deleteButton}>
                  <Image
                    source={require('../../../assets/icons/delete.png')}
                    style={styles.buttonImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          leftOpenValue={0}
          rightOpenValue={-100}
          // stopLeftSwipe={1}
          disableRightSwipe
          closeOnRowPress={true}
          closeOnScroll={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                {this.state.loading ? (
                  <View style={{height: 200, width: 200}}>
                    {/* <LottieView
                      source={require('../../../assets/json/loading.json')}
                      autoPlay
                      loop
                    /> */}
                  </View>
                ) : (
                  <>
                    <View style={{height: 200, width: 300, opacity: 0.6}}>
                      <LottieView
                        source={require('../../../assets/json/chat.json')}
                        autoPlay
                        loop
                      />
                    </View>
                    <ResponsiveText
                      style={{opacity: 0.7, color: Colors.Primary}}>
                      You dont't have any conversation!
                    </ResponsiveText>
                    <ResponsiveText
                      style={{opacity: 0.7, color: Colors.Primary}}>
                      Please Start one!
                    </ResponsiveText>
                    <ResponsiveText
                      style={{opacity: 0.7, color: Colors.Primary}}>
                      or pull to refresh
                      
                    </ResponsiveText>
                   
                    
                  </>
                )}
              </View>
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: wp('5.5'),
            paddingTop: wp('4'),
            flexGrow: 1,
          }}
          data={this.props.groups}
          renderItem={({item, index}) => {
            let length =
              this.props.onlineUsers[item.channel_name].filter(
                u => u.username !== this.props.user.ref_id,
              ).length || 0;

            let unreadmsgs =
              this.props.allRoomsMessages[item.channel_name].filter(
                e => e.send_receipt === false,
              ) || [];
            let channelMessages =
              this.props.allRoomsMessages[item.channel_name];
            let typingchannel = this.props.typingUsers[item.channel_name] || [];
            return (
              //               

              <ChatCard
                key={item.id}
                item={item}
                // profile_image={item.profile_image}
                user={this.props.user}
                user_name={item.group_title}
                time={
                  item.auto_created == 0 ? (
                    <ResponsiveText style={{color: 'green'}}>
                      {length + 1}/{item.participants.length}
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
                unseen_messsages={unreadmsgs.length}
                last_message={
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
                          } and ${
                            typingchannel.length - 1
                          } others are Typing...`}
                    </ResponsiveText>
                  ) : unreadmsgs.length > 0 ? (
                    <ResponsiveText style={{fontFamily: Fonts.RobotoMedium}}>
                      Misread Messages
                    </ResponsiveText>
                  ) : channelMessages.length > 0 ? (
                    <ResponsiveText
                      numberOfLines={1}
                      style={{
                        fontFamily: Fonts.OpenSansRegular,
                        fontSize: 3.7,
                        maxHeight: wp('6'),
                        color: '#3A3A3A',
                        opacity: 0.7,
                      }}>
                      {channelMessages[channelMessages.length - 1].from ==
                      this.props.user.ref_id
                        ? 'You: '
                        : `${
                            this.props.allUsers.find(
                              e =>
                                e.ref_id ==
                                channelMessages[channelMessages.length - 1]
                                  .from,
                            ).username
                          }: `}
                      {channelMessages[channelMessages.length - 1].type ==
                      'text'
                        ? channelMessages[channelMessages.length - 1].content
                        : channelMessages[channelMessages.length - 1].type ==
                          'image'
                        ? 'Sent an Image.'
                        : channelMessages[channelMessages.length - 1].type ==
                          'audio'
                        ? 'Sent an Audio.'
                        : channelMessages[channelMessages.length - 1].type ==
                          'video'
                        ? 'Sent a video.'
                        : channelMessages[channelMessages.length - 1].type ==
                          'file'
                        ? 'Sent a file.'
                        : 'other'}
                    </ResponsiveText>
                  ) : (
                    <ResponsiveText
                      style={{
                        fontFamily: Fonts.OpenSansRegular,
                        fontSize: 3.5,
                        maxHeight: wp('6'),
                        color: '#3A3A3A',
                        opacity: 0.7,
                      }}>
                      No message yet
                    </ResponsiveText>
                  )
                }
                onPressCard={() => this.cardPress(unreadmsgs, item, index)}
                navigation={this.props.navigation}
              />
            );
          }}
          keyExtractor={(item, index) => `${index}`}
        />
       
        

        <TouchableOpacity onPress={() => {
            this.setState({createChatModal: true});
          }} style={{height:60,width:60,borderRadius:60,backgroundColor:"rgba(26, 2, 83, 0.7)",position:'absolute',right:10,bottom:30,alignItems:'center',justifyContent:'center'}}>
        <View>
              <Image
                source={require('../../../assets/icons/addchat.png')}
                style={styles.headerNotificationIcon}
              />
              {/* <View style={styles.notificationBadge} /> */}
            </View>
        </TouchableOpacity>
        {/* modal start */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.createChatModal}
          onRequestClose={() => {
            this.setState({createChatModal: false, searchText: ''});
          }}>
          <View style={styles.createChatModalContainer}>
            <AppHeader
              titleLeftAlign
              containerStyle={styles.modalHeader}
              left={
                <View style={styles.leftIconContainer}>
                  <Image
                    source={require('../../../assets/icons/left_chevron2.png')}
                    style={styles.HeaderleftIconBack}
                  />
                </View>
              }
              leftPress={() => {
                this.setState({createChatModal: false, searchText: ''});
                // if(!this.state.fetchingGroups){
                //   this.getGroups()
                // }
              }}
              body={
                <ResponsiveText style={styles.headertitle}>
                  New Chat
                </ResponsiveText>
              }
              right={
                <View>
                  <Image
                    source={require('../../../assets/icons/createGroup.png')}
                    style={styles.headerGroupIcon}
                  />
                  {/* <View style={styles.notificationBadge} /> */}
                </View>
              }
              rightPress={() =>
                this.setState({
                  createGroupChat: true,
                  searchText: '',
                  createChatModal: false,
                })
              }
            />
            <AppHeader
              containerStyle={{backgroundColor: Colors.PrimaryLight}}
              body={
                <InputField
                  value={this.state.searchText}
                  onChangeText={e => this.setState({searchText: e})}
                  leftIcon={
                    <Image
                      source={require('../../../assets/icons/search.png')}
                      style={styles.searchIcon}
                    />
                  }
                  inputField={styles.searchText}
                  containerStyle={styles.headerSearchbar}
                  placeholder={'Search'}
                />
              }
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyContainer}>
                    {this.state.fetchingUsers ? (
                      <View style={{height: 200, width: 200}}>
                        <LottieView
                          source={require('../../../assets/json/loading.json')}
                          autoPlay
                          loop
                        />
                      </View>
                    ) : (
                      <>
                        <View style={{height: 300, width: 300, opacity: 0.6}}>
                          <LottieView
                            source={require('../../../assets/json/empty.json')}
                            autoPlay
                            loop
                          />
                        </View>
                        <ResponsiveText
                          style={{
                            opacity: 0.7,
                            color: Colors.Primary,
                            marginTop: 20,
                          }}>
                          No User Found
                        </ResponsiveText>
                      </>
                    )}
                  </View>
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: wp('5.5'),
                // paddingTop: wp('4'),
                flexGrow: 1,
              }}
              data={
                this.state.searchText.trim().length === 0
                  ? this.props.allUsers
                  : this.props.allUsers.filter(e =>
                      e.full_name
                        .toLowerCase()
                        .startsWith(this.state.searchText.toLowerCase()),
                    )
              }
              renderItem={({item, index}) => {
                return (
                  <SingleUserCard
                    onPressChatIcon={e => {
                      this.createOnetoOnegroup(e);
                    }}
                    key={index}
                    item={item}
                    navigation={this.props.navigation}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
        </Modal>
        {/* modal ends */}

        {/* group chat Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.createGroupChat}
          onRequestClose={() => {
            this.setState({
              createGroupChat: false,
              searchGroupText: '',
              selectedUsers: [],
            });
          }}>
          <View style={styles.createChatModalContainer}>
            <AppHeader
              titleLeftAlign
              containerStyle={styles.modalHeader}
              left={
                <View style={styles.leftIconContainer}>
                  <Image
                    source={require('../../../assets/icons/left_chevron2.png')}
                    style={styles.HeaderleftIconBack}
                  />
                </View>
              }
              leftPress={() => {
                this.setState({
                  createGroupChat: false,
                  searchGroupText: '',
                  selectedUsers: [],
                });
                // if(!this.state.fetchingGroups){
                //   this.getGroups()
                // }
              }}
              body={
                <ResponsiveText style={styles.headertitle}>
                  New Group Chat
                </ResponsiveText>
              }
              right={
                <View>
                  {this.state.selectedUsers.length > 0 && (
                    <Image
                      source={require('../../../assets/icons/tick.png')}
                      style={styles.headerTickIcon}
                    />
                  )}
                </View>
              }
              rightPress={() => {
                if (this.state.selectedUsers.length > 0) {
                  this.setState({groupNameModal: true});
                }
              }}
            />
            <AppHeader
              containerStyle={{backgroundColor: Colors.PrimaryLight}}
              body={
                <InputField
                  value={this.state.searchGroupText}
                  onChangeText={e => this.setState({searchGroupText: e})}
                  leftIcon={
                    <Image
                      source={require('../../../assets/icons/search.png')}
                      style={styles.searchIcon}
                    />
                  }
                  inputField={styles.searchText}
                  containerStyle={styles.headerSearchbar}
                  placeholder={'Search'}
                />
              }
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyContainer}>
                    {this.state.fetchingUsers ? (
                      <View style={{height: 200, width: 200}}>
                        <LottieView
                          source={require('../../../assets/json/loading.json')}
                          autoPlay
                          loop
                        />
                      </View>
                    ) : (
                      <>
                        <View style={{height: 300, width: 300, opacity: 0.6}}>
                          <LottieView
                            source={require('../../../assets/json/empty.json')}
                            autoPlay
                            loop
                          />
                        </View>
                        <ResponsiveText
                          style={{
                            opacity: 0.7,
                            color: Colors.Primary,
                            marginTop: 20,
                          }}>
                          No User Found
                        </ResponsiveText>
                      </>
                    )}
                  </View>
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: wp('5.5'),
                // paddingTop: wp('4'),
                flexGrow: 1,
              }}
              data={
                this.state.searchGroupText.trim().length === 0
                  ? this.props.allUsers
                  : this.props.allUsers.filter(e =>
                      e.full_name
                        .toLowerCase()
                        .startsWith(this.state.searchGroupText.toLowerCase()),
                    )
              }
              renderItem={({item, index}) => {
                return (
                  <CreateGroupUserCard
                    pressCard={e => {
                      //console.log(e);
                      this.selectUsertoCreateGroup(e);
                      // ToastAndroid.showWithGravity(
                      //   "All Your Base Are Belong To Us",
                      //   ToastAndroid.LONG,
                      //   ToastAndroid.CENTER
                      // );
                    }}
                    createGroup={() => {
                      //console.log('createGroup');
                    }}
                    selected={this.state.selectedUsers.includes(item.user_id)}
                    // enableTick={true}
                    // selectedUsers={[]}
                    key={index}
                    item={item}
                    navigation={this.props.navigation}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
        </Modal>

        {/* groupchatmodal ends */}

        {/* group name modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.groupNameModal}
          onRequestClose={() => {
            //  this.setState({groupNameModal:false})
          }}>
          <View style={styles.GroupNameModalContainer}>
            <View style={styles.groupModalInnerContent}>
              <View style={styles.groupModalHeader}>
                <ResponsiveText style={styles.modalHeading}>
                  Enter Group Name
                </ResponsiveText>
                <TouchableOpacity
                  onPress={() => {
                    if (!this.state.createGroupLoading) {
                      this.setState({
                        groupNameModal: false,
                        groupName: '',
                        createGroupLoading: false,
                        groupnameError: '',
                      });
                    }
                  }}
                  style={styles.modalCloseIcon}>
                  <Image
                    source={require('../../../assets/icons/cross.png')}
                    style={styles.crossIcon}
                  />
                </TouchableOpacity>
              </View>
              <AppHeader
                containerStyle={{marginTop: 15, marginBottom: 15}}
                body={
                  <InputField
                    autoFocus
                    value={this.state.groupName}
                    onChangeText={e => this.setState({groupName: e})}
                    inputField={styles.searchText}
                    containerStyle={styles.enterNameInput}
                    placeholder={'Enter Here...'}
                  />
                }
              />
              {this.state.groupnameError ? (
                <ResponsiveText style={styles.errorText}>
                  {this.state.groupnameError}
                </ResponsiveText>
              ) : null}
              <Button
                onPress={() => {
                  this.createGroup();
                }}
                loading={this.state.createGroupLoading}
                containerStyle={{marginBottom: 10}}
                text={'Create Chat'}
              />
            </View>
          </View>
        </Modal>
        {/* group name modal closes */}

        {/* grp rename modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.renameGroupPopup}
          onRequestClose={() => {
             this.setState({renameGroupPopup:false})
          }}>
          <View style={styles.GroupNameModalContainer}>
            <View style={styles.groupModalInnerContent}>
              <View style={styles.groupModalHeader}>
                <ResponsiveText style={styles.modalHeading}>
                  Edit Group Name
                </ResponsiveText>
                <TouchableOpacity
                  onPress={() => {
                    if (!this.state.renamingGroup) {
                      this.setState({
                        groupToRename: {},
                        renameGroupPopup: false,
                        renameValue: '',
                        renamingGroup:false
                      });
                    }
                  }}
                  style={styles.modalCloseIcon}>
                  <Image
                    source={require('../../../assets/icons/cross.png')}
                    style={styles.crossIcon}
                  />
                </TouchableOpacity>
              </View>
              <AppHeader
                containerStyle={{marginTop: 15, marginBottom: 15}}
                body={
                  <InputField
                    autoFocus
                    value={this.state.renameValue}
                    onChangeText={e => this.setState({renameValue: e})}
                    inputField={styles.searchText}
                    containerStyle={styles.enterNameInput}
                    placeholder={'Enter Here...'}
                  />
                }
              />
              {this.state.renameError ? (
                <ResponsiveText style={styles.errorText}>
                  {this.state.renameError}
                </ResponsiveText>
              ) : null}
              <Button
                onPress={() => {
                  this.renameGroup();

                }}
                loading={this.state.renamingGroup}
                containerStyle={{marginBottom: 10}}
                text={'Update Name'}
              />
            </View>
          </View>
        </Modal>
        {/* grp rename modal ends */}

        {/* loading modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loadingModal}
          onRequestClose={() => {
            //  this.setState({groupNameModal:false})
          }}>
          <View style={styles.GroupNameModalContainer}>
            <View
              style={{padding: 10, backgroundColor: 'white', borderRadius: 10}}>
              <Spinner
                isVisible={true}
                size={35}
                type={'Wave'}
                color={Colors.Primary}
              />
            </View>
          </View>
        </Modal>

        {/* loading modal ends */}
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    reduxstoreUserInfo: user => dispatch(storeUserInfo(user)),
    reduxlogoutUser: () => dispatch(logoutUser()),
    setGroups: groups => dispatch(storeGroups(groups)),
    setCurrentChannel: channel => dispatch(selectCurrentChannel(channel)),
    storeAllUsers: users => dispatch(storeAllUsers(users)),
    manageTypingUsers: obj => dispatch(manageTypingUsers(obj)),

    manageOnlineUsers: obj => dispatch(manageOnlineUsers(obj)),
    manageAllMessages: messagesObj => dispatch(manageAllMessages(messagesObj)),

    manageSendingQueue: queueArray => dispatch(manageSendingQueue(queueArray)),
    manageFilesObject: filesObject => dispatch(manageFilesObject(filesObject)),
  };
};
const mapStateToProps = state => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);

const styles = {
  header: {
    backgroundColor: Colors.PrimaryLight,
  },
  modalHeader: {
    backgroundColor: Colors.PrimaryLight,
    height: wp(10),
  },
  leftIconContainer: {
    paddingVertical: 7,
    paddingRight: 5,
    opacity: 1,
    height: wp('6'),
    width: wp('6'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  HeaderleftIcon: {
    height: wp('6'),
    width: wp('6'),
    resizeMode: 'contain',

    // backgroundColor: 'red'
  },
  headerNotificationIcon: {
    height: wp('7'),
    width: wp('7'),
    resizeMode: 'contain',
    tintColor: 'white',
  },
  headertitle: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 5.3,
    color: Colors.Primary,
  },
  clearFix: {
    height: wp('0.4'),
    backgroundColor: '#E1E1E1',
    // marginBottom:wp('4')
  },
  notificationBadge: {
    height: wp('2.8'),
    width: wp('2.8'),
    backgroundColor: '#59EF0E',
    borderRadius: wp('2.8'),
    position: 'absolute',
    right: -4,
    top: -1.5,
    elevation: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createChatModalContainer: {
    height: '100%',
    width: wp(100),
    backgroundColor: '#f5f5f0',
    borderTopWidth: 1,
    borderTopColor: Colors.PrimaryLight,
  },
  HeaderleftIconBack: {
    height: wp('3.5'),
    width: wp('3.5'),
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  headerGroupIcon: {
    height: wp('8'),
    width: wp('8'),
    resizeMode: 'contain',
    tintColor: Colors.Primary,
  },
  headerTickIcon: {
    height: wp('6'),
    width: wp('6'),
    resizeMode: 'contain',
    tintColor: Colors.Primary,
  },

  headerSearchbar: {
    width: wp('90'),
    height: wp('11'),
    borderRadius: wp('10'),
    // marginLeft: -wp('2'),
    backgroundColor: '#F2F2F2',
    borderWidth: 0,
    // paddingLeft: wp('3'),
  },

  searchIcon: {
    height: wp('4.5'),
    width: wp('4.5'),
    resizeMode: 'contain',
    marginLeft: wp('1'),
  },
  searchText: {
    fontFamily: Fonts.RobotoBold,
    fontSize: wp('3.5'),
    // marginLeft: -wp('1.5'),
  },
  GroupNameModalContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(244, 223, 81, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupModalInnerContent: {
    // height:'30%',
    width: '80%',
    borderRadius: 10,
    overFlow: 'hidden',
    backgroundColor: 'white',
    paddingVertical: wp(3),
    paddingHorizontal: wp(5),
  },
  groupModalHeader: {
    height: 30,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // dispal
  },
  modalHeading: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 4.7,
    color: Colors.Primary,
  },
  modalCloseIcon: {
    padding: 5,
    // backgroundColor:'red'
  },
  crossIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.Primary,
  },
  enterNameInput: {
    width: wp('70%'),
    height: wp('11'),
    borderRadius: wp('10'),
    // marginLeft: -wp('2'),
    backgroundColor: 'rgba(244, 223, 81, 0.4)',
    borderWidth: 0,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 15,
    color: 'red',
    fontSize: 4.5,
  },
  hiddenView: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffe6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: wp('0.3'),
    borderColor: '#E1E1E1',
  },
  singleHiddenButton: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: '#ff8080',
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: 'white',
  },
  editButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: '#99ff99',
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: 'white',
  },
  buttonImg: {
    height: '50%',
    width: '50%',
    resizeMode: 'contain',
    tintColor:Colors.Primary
  },
};
