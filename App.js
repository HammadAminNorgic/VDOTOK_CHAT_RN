import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
// import * as PUBSUB from "PubSub";
import Navigation from './src/navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux';

const App = () => {


  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
  },
};
