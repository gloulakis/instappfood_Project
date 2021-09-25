import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No access to Gallery</Text>;
  }
  return (
    <View style={styles.fixedRatio}>
      <View style={styles.PickImage}>
          <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      </View>
      <View style={styles.Image}>
           {image && <Image source={{ uri: image }} style={styles.imageStyle} />}
      </View>
      <View style={styles.next}>
      <Button title="Next" onPress={() => navigation.navigate('Save', { image })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    shadowRadius :4,
    borderRadius:10
  },
  fixedRatio: {
    flex: 1,
    margin: '10%'
  },
  Image:{
    flex: 1,
    margin:'1%'
  },
  PickImage:{
    padding:10,
  },
  next:{
    margin:'10%'
  }

})