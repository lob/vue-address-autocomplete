// External Dependencies
import base64 from 'base-64'

export const postAutocompleteAddress = (
    apiKey,
    addressPrefix,
    isStaging = false,
    additionalAddressData
) => {
    const domain = isStaging ? 'lob-staging' : 'lob';
    const url =
        `https://api.${domain}.com/v1/us_autocompletions?valid_addresses=true&case=proper`
    const init = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64.encode(apiKey + ':')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address_prefix: addressPrefix,
            ...additionalAddressData
        })
    }

    return fetch(url, init)
}

export const postAutocompleteInternationalAddress = (
    apiKey,
    addressPrefix,
    country,
    isStaging = false,
    additionalAddressData
) => {
    const domain = isStaging ? 'lob-staging' : 'lob';
    const url =
        `https://api.${domain}.com/v1/intl_autocompletions`
    const init = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64.encode(apiKey + ':')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address_prefix: addressPrefix,
            country,
            ...additionalAddressData
        })
    }

    return fetch(url, init)
}

export const postVerifyAddress = (apiKey, address, isStaging = false) => {
    const payload = typeof address === 'string' ? { address } : address
    const domain = isStaging ? 'lob-staging' : 'lob'
    const url = `https://api.${domain}.com/v1/us_verifications`
    const init = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64.encode(apiKey + ':')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    return fetch(url, init)
}

export const postVerifyInternationalAddress = (
    apiKey,
    address,
    countryCode,
    isStaging = false
) => {
    const domain = isStaging ? 'lob-staging' : 'lob'
    const url = `https://api.${domain}.com/v1/intl_verifications`
    const init = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64.encode(apiKey + ':')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, country: countryCode })
    }

    return fetch(url, init)
}