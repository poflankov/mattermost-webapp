// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getChannelStats, updateChannelMemberSchemeRoles, removeChannelMember, getChannelMember} from 'mattermost-redux/actions/channels';
import {haveIChannelPermission} from 'mattermost-redux/selectors/entities/roles';
import {Permissions} from 'mattermost-redux/constants';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {canManageMembers} from 'utils/channel_utils.jsx';

import ChannelMembersDropdown from './channel_members_dropdown.jsx';

function mapStateToProps(state, ownProps) {
    const {channel} = ownProps;
    const canChangeMemberRoles = haveIChannelPermission(
        state,
        channel.team_id,
        channel.id,
        Permissions.MANAGE_CHANNEL_ROLES,
    ) && canManageMembers(state, channel);
    const canRemoveMember = canManageMembers(state, channel);

    return {
        currentUserId: getCurrentUserId(state),
        canChangeMemberRoles,
        canRemoveMember,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getChannelMember,
            getChannelStats,
            updateChannelMemberSchemeRoles,
            removeChannelMember,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelMembersDropdown);
