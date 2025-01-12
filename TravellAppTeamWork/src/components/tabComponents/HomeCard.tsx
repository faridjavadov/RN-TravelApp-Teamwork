import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BaseNetwork } from '../../network/api';
import { getUserPlaces, saveUserPlaces } from '../../utils/storage/userSavedPlacesHelper';

const HomeCard = ({ item, textStyles }: any) => {
    const [data, setdata] = useState<any[]>([])
    const [alldata, setalldata] = useState<any[]>([])
    const [isSaved, setisSaved] = useState(false)
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const isFocused = useIsFocused();
    useEffect(() => {
        let network = new BaseNetwork();
        network.getAll('places').then((res) => {
          setalldata(res);
        })
      }, [])
    
      useEffect(() => {
            if (isFocused) {
                getUserPlaces().then((res: any) => {
                  setdata(res);
                  if (res.find((e: any) => e.id == item.id)) {                
                    setisSaved(true)
                    return;
                  }
                })
          
              }
      }, [isFocused])
    
    
    const Save = () => {
        if (!isSaved) {
            saveUserPlaces([...data, item])
            setdata([...data, item])
            setisSaved(true)
        }
        else {
            let filtered = data.filter(c => c.id != item.id)
            setdata(filtered)
            saveUserPlaces(filtered)
            setisSaved(false)
        }
    }

    useEffect(() => {
        getCurrentLocation().then(coords => {
            if (coords) {
                const { latitude, longitude } = coords;
                setLatitude(latitude);
                setLongitude(longitude);
            } else {
                console.log('Failed to get current location.');
            }
        });
    }, []);

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const toRadians = (degrees: number): number => {
        return degrees * (Math.PI / 180);
    };

    const pointA = { lat: item.lat, lon: item.long };
    const pointB = { lat: latitude, lon: longitude };

    const distance = calculateDistance(
        pointA.lat,
        pointA.lon,
        pointB.lat,
        pointB.lon
    );

    const getCurrentLocation = async (): Promise<GeolocationResponse['coords'] | null> => {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
            return new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    error => {
                        console.error('Error getting current location:', error);
                        reject(null);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            });
        } else {
            console.error('Location permission denied.');
            return null;
        }
    };

    const requestLocationPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'ios') {
            return true;
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Failed to request location permission:', error);
            return false;
        }
    };
    

    return (
        <View style={styles.restaurants}>
            <View style={styles.bookmarkWrapper}>
                <TouchableOpacity onPress={Save}
                >
                    <Image style={styles.bookmark}
                        source={isSaved ? require('../../assets/icons/savedbookmark.png') : require('../../assets/icons/bookmark.png')}
                    />
                </TouchableOpacity>
            </View>
            <Image source={{ uri: item.imageUrl }} style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, width: '100%', height: 200, resizeMode: "cover" }} />
            <View style={{ padding: 10 }}>
                <Text style={[styles.rstName, textStyles]}>{item.name}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={[styles.footerTexts, textStyles]}>
                    📍 {distance.toFixed(2)} km
                </Text>
                <Text style={[styles.footerTexts, textStyles]}>
                    🕘 {item.openCloseTime}
                </Text>
                <Text style={[styles.footerTexts, textStyles]}>
                    ⭐️ {item.rate}
                </Text>
            </View>
        </View>
    )
}

export default HomeCard

const styles = StyleSheet.create({
    headerWrapper: {
        marginVertical: 10
    },
    headerText: {
        fontWeight: '400',
        fontSize: 15,
        color: '#fff',
        marginBottom: 15,
        marginTop: 30,
    },
    restaurants: {
        width: 230,
        height: 300,
        borderWidth: 1,
        borderColor: '#262626',
        borderRadius: 12,
        marginRight: 15
    },
    rstName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    footerTexts: {
        color: '#E8E8E8',
        fontSize: 10,
        fontWeight: '500',
    },
    bookmark: {
        width: 15,
        height: 17,
    },
    bookmarkWrapper: {
        position: 'absolute',
        zIndex: 10,
        right: 10,
        top: 10,
        backgroundColor: '#1C1C1C',
        padding: 10,
        borderRadius: 50,
    },
    loading: {
        color: '#E0783E',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: 400 }],
    },
})