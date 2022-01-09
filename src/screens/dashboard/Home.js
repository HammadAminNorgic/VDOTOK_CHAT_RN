import React, { Component } from 'react';
import { View,Text } from 'react-native';
import Container from '../../components/Container';
import ResponsiveText from '../../components/ResponsiveText';

class Home extends Component {
  render() {
    return (
     <Container>
         <ResponsiveText> Welcome Home</ResponsiveText>
     </Container>
    );
  }
}

export default Home;

const styles={
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"green"
    },
    text:{
        color:'white'
    }
}