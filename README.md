# WeatherCraft

## Run on expo

```
npx expo start
```

## Build APK

1. `npx expo-doctor` to check if everything is alright, then `npx expo prebuild` to create/update the android folder.
2. Generate keystore file with:

```
keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000
```

3. Put the keystore file inside `android/app` folder.
4. Add below inside `signingConfigs` of `android/app/build.gradle` file:

```
release {
    storeFile file('your_key_name.keystore')
    storePassword 'password'
    keyAlias 'your_key_alias'
    keyPassword 'password'
}
```

5. Modify to `signingConfig signingConfigs.release` in buildTypes → release of `android/app/build.gradle` file.
6. `./gradlew assembleRelease` in the android folder.

APK will be generated in `android\app\build\outputs\apk\release`