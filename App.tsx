import React, { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, FlatList, SafeAreaView, View } from 'react-native';
import { Appbar, Button, Card, DefaultTheme, List, Provider as PaperProvider, Searchbar, Surface, Text } from 'react-native-paper';
import { BackButton, NativeRouter, Route, useHistory, useParams } from 'react-router-native';
import { fetchStores, HEBStoreItem } from './api';
import { register, unregister } from './background';
import * as Storage from './storage';


const StoreViewer: React.FC = () => {

    const { defaultZip } = useParams();

    const history = useHistory();
    const [zip, setZip] = useState<string>();
    const [zips, setZips] = useState<string[]>([]);
    const [stores, setStores] = useState<HEBStoreItem[]>([]);
    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            if (defaultZip && !zip) {
                setZip(defaultZip);
            }
        }

        if (zip?.length === 5) {
            setIsLoadingStores(true)
            fetchStores(zip)
                .then(({ stores }) => {
                    const available = stores.filter(store => store.storeNextAvailableTimeslot.nextAvailableTimeslotDate)
                    setStores(available);
                })
                .catch(e => {
                    console.log(e);
                    console.log(`error fetching stores for ${zip}`)
                })
                .finally(() => setIsLoadingStores(false));
        } else {
            setStores([]);
        }

        setInitialized(true);
    }, [zip]);

    useEffect(() => {
        if (!initialized) {
            Storage.getZips().then(zs => setZips(zs));
        } else {
            Storage.setZips(zips);
        }

        setInitialized(true);
    }, [zips]);

    const isSubscribed = zips.some(z => z === zip);

    return (
        <View>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => history.push('/')} />
                <Appbar.Content title='Subscribe to zip code' />
                <Appbar.Action
                    icon={isSubscribed ? 'bell-ring-outline' : 'bell-outline'}
                    onPress={() => {
                        if (isSubscribed) {
                            setZips(zips.filter(z => z !== zip));
                        } else {
                            if (zip?.length === 5) {
                                setZips(zips.concat([zip]));
                            }
                        }
                    }}
                />
            </Appbar.Header>

            <Searchbar
                keyboardType='numeric'
                placeholder='Search with zip code'
                onChangeText={zip => setZip(zip)}
                value={zip ? zip : ''}
                maxLength={5}
            />

            {
                isLoadingStores ?
                    <ActivityIndicator animating={true} /> :
                    <SafeAreaView>
                        <FlatList
                            data={stores}
                            renderItem={({ item }) => {
                                return (
                                    <List.Item
                                        title={item.store.name}
                                        description={new Date(item.storeNextAvailableTimeslot.nextAvailableTimeslotDate).toString()}
                                        onPress={() => console.log(`clicked ${item.store.name}`)}
                                    />
                                );
                            }}
                            keyExtractor={item => item.store.id}
                        />
                    </SafeAreaView>
            }
        </View>
    );
}

const Home: React.FC = () => {

    const history = useHistory();

    const [initialized, setInitialized] = useState(false);
    const [zips, setZips] = useState<string[]>([]);

    useEffect(() => {
        if (!initialized) {
            Storage.getZips().then(zips => setZips(zips));
        } else {
            Storage.setZips(zips);
        }

        setInitialized(true);
    }, [zips]);


    const onAppStateChange = (nextState: AppStateStatus) => {
        console.log('state change:', nextState)
        if (nextState === 'background') {
            Storage.getZips().then(zips => {
                if (zips.length === 0) {
                    console.log('unregistered background task');
                    unregister();
                } else {
                    console.log('registered background task');
                    register();
                }
            });
        }
    }

    useEffect(() => {
        AppState.addEventListener('change', onAppStateChange);
        return () => AppState.removeEventListener('change', onAppStateChange);
    }, []);

    return (
        <View>
            <Appbar.Header>
                <Appbar.Content title='H-E-B Curbside Subscriptions' />
                <Appbar.Action icon='bell-plus-outline' onPress={() => history.push('/stores')} />
            </Appbar.Header>

            <SafeAreaView>
                <FlatList
                    data={zips.map(zip => ({ zip }))}
                    ListEmptyComponent={
                        <Surface style={{ padding: 10 }}>
                            <Card>
                                <Card.Title title='You have no subscriptions' />
                                <Card.Content>
                                    <Text>Add a subscription to get notified.</Text>
                                </Card.Content>
                            </Card>
                        </Surface>
                    }
                    renderItem={({ item }) => {
                        return (
                            <Surface style={{ padding: 10 }}>
                                <Card>
                                    <Card.Title title={item.zip} />
                                    <Card.Actions>
                                        <Button icon='bell-off-outline' onPress={() => setZips(zips.filter(z => z !== item.zip))}>Unsubscribe</Button>
                                        <Button onPress={() => history.push(`/stores/${item.zip}`)}>View</Button>
                                    </Card.Actions>
                                </Card>
                            </Surface>
                        );
                    }}
                    keyExtractor={item => item.zip}
                />
            </SafeAreaView>
        </View >
    );
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#dc2d23',
        accent: '#00a0be'
    }
}

export default function() {
    return (
        <PaperProvider theme={theme}>
            <NativeRouter>
                <BackButton />
                <Route exact path="/" component={Home} />
                <Route path="/stores/:defaultZip?" component={StoreViewer} />
            </NativeRouter>
        </PaperProvider>
    )
}
