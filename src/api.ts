
export interface HEBStore {
    address1: string
    allowAtgCurbside: boolean
    city: string
    id: string
    isCurbside: boolean
    name: string
    storeHours: string
}

export interface HEBNextTimeslot {
    nextAvailableTimeslotDate: string
    serviceAvailable: boolean
}

export interface HEBStoreItem {
    distance: number
    store: HEBStore
    supportsMedTimeslot: boolean
    storeNextAvailableTimeslot: HEBNextTimeslot
}

export interface HEBStoreQueryResult {
    stores: HEBStoreItem[]
}

export async function fetchStores(zipCode: string): Promise<HEBStoreQueryResult> {
    const response = await fetch('https://www.heb.com/commerce-api/v1/store/locator/address', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: zipCode,
            curbsideOnly: true,
            nextAvailableTimeslot: true
        }),
    });

    if (response.status !== 200) {
        throw new Error(await response.text());
    }

    return await response.json();
}
