import { Notifications } from 'expo';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { fetchStores } from './api';
import * as Storage from './storage';

const TASK_NAME = 'GROCERIES-NOTIFY-BACKROUND-TASK';

function sendNotification(title: string, body: string) {
    const now = new Date();
    const future = new Date(now);
    future.setMinutes(now.getMinutes() + 1);

    Notifications.scheduleLocalNotificationAsync(
        { title, body },
        { time: future }
    );
}

function task(): BackgroundFetch.Result {
    console.log(new Date(), 'inside task');

    Storage.getZips()
        .then(zips => {
            zips.forEach(zip => {
                console.log('checking availability for', zip);
                fetchStores(zip).then(({ stores }) => {
                    const available = stores.filter(store => store.storeNextAvailableTimeslot.nextAvailableTimeslotDate)
                    if (available.length > 0) {
                        console.log('sending notification');
                        sendNotification('H-E-B Curbside', `There are ${available.length} stores with availability near ${zip}`);
                    }

                })
            })
        })

    return BackgroundFetch.Result.NewData;
}

export function register() {
    BackgroundFetch.registerTaskAsync(TASK_NAME);
}

export function unregister() {
    BackgroundFetch.unregisterTaskAsync(TASK_NAME);
}

TaskManager.defineTask(TASK_NAME, task);
