import { GoogleSignin, GoogleSigninButton, isErrorWithCode } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';



export default function GoogleLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        iosClientId: '480918748504-96eo9ab0g4uac9p4r7kshh2fep039k9g.apps.googleusercontent.com',
        webClientId: '480918748504-lh71qqa9t1hnf1pkdcc5ps2mtsscmsnr.apps.googleusercontent.com ',
        offlineAccess: true,
      })
    }
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true)
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()
      console.log(response)
      setIsSubmitting(false)
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.error(error.message)
      }
      setIsSubmitting(false)
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200 }}
        placeholder="Email Address"
        onChangeText={(text) => console.log(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginTop: 10 }}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => console.log(text)}
      />

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => { handleGoogleSignIn() }}
        disabled={isSubmitting}
      />;
      <TouchableOpacity style={{ marginTop: 10 }}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 10 }}>
        <Text>Don't have an account?</Text>
      </TouchableOpacity>
    </View>

  )
}
