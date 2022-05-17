// External Dependencies
// import React from 'react'
// import { act, fireEvent, render, screen } from '@testing-library/react'
import { mount, flushPromises } from '@vue/test-utils'
import { expect } from 'vitest';

// Internal Dependencies
import {
    mockAutocompleteSuccessResponse,
    mockAutocompleteFailureResponse
} from '../mockApi'
import AddressAutocomplete from './AddressAutocomplete.vue'

const mockPost = vi.fn()
const handleSelect = vi.fn()

global.fetch = mockPost

describe('Autocomplete', () => {
    it('renders correctly', async() => {
        // Mock fetch response
        mockPost.mockReturnValueOnce(
            Promise.resolve({
                json: () => mockAutocompleteSuccessResponse
            })
        )

        const wrapper = mount(AddressAutocomplete, {
            data: () => ({ addresses: [] })
        })

        // Verify initial rendering
        expect(wrapper.find('input[placeholder="Search for an address"]').isVisible()).toBeTruthy()

        // Simulate user input
        await wrapper.find('input').trigger('focus')
        await wrapper.find('input').trigger('input')
        await flushPromises()

        let listItemTextContent = wrapper.text()

        // Verify suggestion renderings
        const suggestions = wrapper.findAll('div').filter(element =>
            element.classes().includes("lob-typeahead-list-item")
        )

        expect(suggestions).toHaveLength(3)

        expect(listItemTextContent).toContain('123 Sesame St,')
        expect(listItemTextContent).toContain('123 Bowser\'s Castle,')
        expect(listItemTextContent).toContain('123 Micky\'s Clubhouse,')

        // Simulate selection
        await suggestions[0].trigger('click')

        // Verify correct suggestion is rendered
        listItemTextContent = wrapper.text()
        expect(listItemTextContent).not.toContain('123 Bowser\'s Castle,')
        expect(listItemTextContent).not.toContain('123 Micky\'s Clubhouse,')
    })

    it('fires callback functions as expected', async() => {
        // Mock fetch response
        mockPost.mockReturnValueOnce(
            Promise.resolve({
                json: () => mockAutocompleteSuccessResponse
            })
        )

        const wrapper = mount(AddressAutocomplete, {
            data: () => ({ addresses: [] }),
            attrs: {
                onOnSelect: handleSelect
            }
        })

        // Trigger suggestion options
        await wrapper.find('input').trigger('focus')
        await wrapper.find('input').trigger('input')
        await flushPromises()

        // Trigger selection, selects 2nd option because the first has an additional class
        await wrapper.find('[class="lob-typeahead-list-item"]').trigger('click')

        expect(handleSelect).toHaveBeenCalledOnce()
        expect(handleSelect).toHaveBeenCalledWith({
            label: "123 Bowser's Castle Mushroom Kingdom JA 12345",
            value: {
                primary_line: "123 Bowser's Castle",
                city: 'Mushroom Kingdom',
                state: 'JA',
                zip_code: '12345'
            }
        })
    })

    it('handles errors as expected', async() => {
        // Mock fetch response
        mockPost.mockReturnValueOnce(
            Promise.resolve({
                json: () => mockAutocompleteFailureResponse
            })
        )

        const wrapper = mount(AddressAutocomplete, {
            data: () => ({ addresses: [] })
        })

        // Trigger suggestion options
        await wrapper.find('input').trigger('focus')
        await wrapper.find('input').trigger('input')
        await flushPromises()

        // Confirm error was sent
        expect(Object.keys(wrapper.emitted())).toContain('onError')
        expect(wrapper.emitted().onError).toHaveLength(1)
        expect(wrapper.emitted().onError[0]).toEqual([{
            code: "invalid_api_key",
            message: "Your API key is not valid. Please sign up on lob.com to get a valid api key.",
            status_code: 401,
        }])
    })
})