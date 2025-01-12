import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemeContext, Theme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../../assets/i18n/i18n'

const App: React.FC = () => {
      const { theme, toggleTheme } = useContext(ThemeContext);

      const [currentLanguage, setcurrentLanguage] = useState('en')

      const { t, i18n } = useTranslation();
  
      const changeLanguage = (language: string) => {
  
          i18n.changeLanguage(language)
              .then(res => {
                  setcurrentLanguage(language);
              })
  
      }
      const containerStyles = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#fff' : '#1c1c1c',
      };

      const buttonStyles = {
            backgroundColor: theme === 'dark' ? '#fff' : '#1c1c1c',
      };
      
      return (
            <View style={containerStyles}>
                  <TouchableOpacity onPress={toggleTheme} style={buttonStyles}>
                        {theme === 'dark' ? <Image source={require('../../assets/icons/moon.png')} style={buttonStyles}
                        /> : <Image source={require('../../assets/icons/Sun.png')} style={buttonStyles}
                        />}
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('az')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>Azerbaijani</Text>

                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('en')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>English</Text>

                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('ru')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>Russian</Text>

                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('tr')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>Turkish</Text>

                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('de')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>German</Text>

                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>changeLanguage('kr')}>
                        <Text style={{fontSize:30,fontWeight:'700',color:'white'}}>Korean</Text>

                  </TouchableOpacity>
            </View>
      );
};

export default App;

const styles = StyleSheet.create({

})
