import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import PageHeader from '../../components/PageHeader';

const Favorites = () => {
  return (
    <View style={styles.container}>
      <PageHeader title="Proffys Disponíveis" />
    </View>
  );
};

export default Favorites;
