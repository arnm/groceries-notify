import * as SecureStore from 'expo-secure-store';
export const ZIPCODE_KEY = 'groceries-notify-zipCode';

export async function setZips(codes: string[]) {
    await SecureStore.setItemAsync(ZIPCODE_KEY, JSON.stringify(codes));
}

export async function getZips(): Promise<string[]> {
    const raw = await SecureStore.getItemAsync(ZIPCODE_KEY);

    if (raw) {
        return JSON.parse(raw);
    }

    return [];
}
