// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import TutorialTip from 'components/tutorial/tutorial_tip/tutorial_tip';
import {Constants, Preferences} from 'utils/constants';

describe('components/tutorial/tutorial_tip/tutorial_tip', () => {
    jest.mock('actions/telemetry_actions.jsx');

    const currentUserId = 'currentUserId';
    const requiredProps = {
        currentUserId,
        title: <>{'title'}</>,
        step: 1,
        currentStep: 1,
        autoTour: false,
        isAdmin: false,
        actions: {
            closeRhsMenu: jest.fn(),
            savePreferences: jest.fn(),
            setFirstChannelName: jest.fn(),
            setProductMenuSwitcherOpen: jest.fn(),
        },
        screen: <></>,
        placement: 'right',
    };

    test('should match snapshot', () => {
        const wrapper = shallow(<TutorialTip {...requiredProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should have called both closeRhsMenu and savePreferences', () => {
        const savePreferences = jest.fn();
        const closeRhsMenu = jest.fn();
        const setFirstChannelName = jest.fn();
        const setProductMenuSwitcherOpen = jest.fn();

        const props = {...requiredProps, actions: {closeRhsMenu, savePreferences, setFirstChannelName, setProductMenuSwitcherOpen}};
        const wrapper = shallow<TutorialTip>(
            <TutorialTip {...props}/>,
        );

        wrapper.instance().handleNext();

        const expectedPref = [
            {
                user_id: currentUserId,
                category: Preferences.TUTORIAL_STEP,
                name: currentUserId,
                value: (requiredProps.currentStep + 1).toString(),
            },
            {
                user_id: currentUserId,
                category: Preferences.TUTORIAL_STEP_AUTO_TOUR_STATUS,
                name: currentUserId,
                value: Constants.AutoTourStatus.ENABLED.toString(),
            },
        ];

        expect(closeRhsMenu).toHaveBeenCalledTimes(1);
        expect(savePreferences).toHaveBeenCalledTimes(1);
        expect(savePreferences).toHaveBeenCalledWith(currentUserId, expectedPref);
    });

    test('should have called mockEvent.preventDefault when skipTutorial', () => {
        const mockEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLAnchorElement>;

        const props = {...requiredProps};
        const wrapper = shallow<TutorialTip>(
            <TutorialTip {...props}/>,
        );

        wrapper.instance().skipTutorial(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    test('should have called both closeRhsMenu and savePreferences when skipTutorial', () => {
        const savePreferences = jest.fn();
        const closeRhsMenu = jest.fn();
        const setFirstChannelName = jest.fn();
        const setProductMenuSwitcherOpen = jest.fn();
        const mockEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLAnchorElement>;

        const props = {...requiredProps, actions: {closeRhsMenu, savePreferences, setFirstChannelName, setProductMenuSwitcherOpen}};
        const wrapper = shallow<TutorialTip>(
            <TutorialTip {...props}/>,
        );

        wrapper.instance().skipTutorial(mockEvent);

        const expectedPref = [{
            user_id: currentUserId,
            category: Preferences.TUTORIAL_STEP,
            name: currentUserId,
            value: Constants.TutorialSteps.FINISHED.toString(),
        }];

        expect(savePreferences).toHaveBeenCalledTimes(1);
        expect(savePreferences).toHaveBeenCalledWith(currentUserId, expectedPref);
    });

    test('handleSavePreferences next skip admin steps for non admins', () => {
        const props = {
            currentUserId,
            title: <>{'title'}</>,
            step: 5,
            currentStep: 5,
            autoTour: false,
            isAdmin: false,
            actions: {
                closeRhsMenu: jest.fn(),
                savePreferences: jest.fn(),
                setFirstChannelName: jest.fn(),
                setProductMenuSwitcherOpen: jest.fn(),
            },
            screen: <></>,
            placement: 'right',

        };
        const wrapper = shallow<TutorialTip>(
            <TutorialTip {...props}/>,
        );

        wrapper.instance().handleSavePreferences(false, true);

        // current tip is 5, but tip 6, START_TRIAL is only for admins and is skipped to tip 7
        expect(props.actions.savePreferences).toHaveBeenCalledWith('currentUserId', [
            {category: 'tutorial_step', name: 'currentUserId', user_id: 'currentUserId', value: '7'},
            {category: 'tutorial_step_auto_tour_status', name: 'currentUserId', user_id: 'currentUserId', value: '1'},
        ]);
    });

    test('handleSavePreferences skip previous admin steps for non admins', () => {
        const props = {
            currentUserId,
            title: <>{'title'}</>,
            step: 7,
            currentStep: 7,
            autoTour: false,
            isAdmin: false,
            actions: {
                closeRhsMenu: jest.fn(),
                savePreferences: jest.fn(),
                setFirstChannelName: jest.fn(),
                setProductMenuSwitcherOpen: jest.fn(),
            },
            screen: <></>,
            placement: 'right',

        };
        const wrapper = shallow<TutorialTip>(
            <TutorialTip {...props}/>,
        );

        wrapper.instance().handleSavePreferences(false, false);

        // current tip is 7, but tip 6, START_TRIAL is only for admins and is skipped to tip 5
        expect(props.actions.savePreferences).toHaveBeenCalledWith('currentUserId', [
            {category: 'tutorial_step', name: 'currentUserId', user_id: 'currentUserId', value: '5'},
            {category: 'tutorial_step_auto_tour_status', name: 'currentUserId', user_id: 'currentUserId', value: '1'},
        ]);
    });
});
