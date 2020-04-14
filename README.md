
# groceries-notify

Mobile application which will notify you when available Curbside Service is
available for [H-E-B][heb] grocery stores nearby.

# Development

1. Install `expo-cli`:
    ``` sh
    npm install -g expo-cli@latest
    ```
2. Install `android-studio`:
   ```sh
   brew cask install android-studio
   ```
3. Create new Virtual Device in ADV Manager
4. Launch new Device
5. Install expo client on device:
    ``` sh
    expo client:install:android
    ```
6. Install dependencies:
   ```sh
   yarn install
   ```
7. Run application:
    ``` sh
    yarn start

    # if you encounter error, it may be good start like so
    expo start --clear
    ```
8. Run on Android Emulator (with iOS you will need [extra setup steps for background tasks][ios-background-setup])

# References

- https://docs.expo.io/versions/v37.0.0/sdk/task-manager/
- https://docs.expo.io/versions/v37.0.0/sdk/background-fetch/
- https://docs.expo.io/versions/v37.0.0/guides/push-notifications/
- https://docs.expo.io/versions/v37.0.0/guides/using-fcm/
- https://docs.expo.io/versions/v37.0.0/react-native/network/

[heb]: https://www.heb.com/
[ios-background-setup]: https://docs.expo.io/versions/latest/sdk/task-manager/#background-modes-on-ios
