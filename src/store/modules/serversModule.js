import { bus } from "../../main";
import { router } from "./../../router";
import Vue from "vue";

const state = {
  selectedServerID: null,
	servers: {},
  channelsIDs: {},
  serverMembers: [],
};

const getters = {
  servers(state) {
    return state.servers;
  },
  channelsIDs(state) {
    return state.channelsIDs;
  },
  serverMembers(state) {
    return state.serverMembers;
  },
  selectedServerID(state) {
    return state.selectedServerID
  }
};

const actions = {
  AddChannelsIDs(context, {serverID, channelsIDs}) {
    context.commit('ADD_CHANNELS_IDS', {serverID, channelsIDs});
  },
  setServers(context, servers) {
    context.commit('SET_SERVERS', servers);
  },
  setServer(context, server) {
    context.commit('SET_SERVER', server);
  },
  removeServer(context, serverID) {
    context.commit('REMOVE_SERVER', serverID);
  },
  addServerMembers(context, serverMembersArr) {
    context.commit('ADD_SERVER_MEMBERS', serverMembersArr)
  },
  removeServerMember (context, {uniqueID, server_id}) {
    context.commit('REMOVE_SERVER_MEMBER', {uniqueID, server_id})
  },
  setSelectedServerID(context, serverID) {
    context.commit('SET_SELECTED_SERVER_ID', serverID)
  },
  addServerMember(context, serverMember) {
    context.commit('ADD_SERVER_MEMBER', serverMember)
  },
  removePresences(context, server_id) {
    const members = context.getters.serverMembers.filter(m => m.server_id === server_id)
    const friends = context.rootGetters.user.friends;
    for (let member of members) {
      if (!friends[member.uniqueID]) {
        context.dispatch('members/updatePresence', {uniqueID: member.uniqueID, status: null}, {root: true})
      }
      context.commit('REMOVE_SERVER_MEMBER', {uniqueID: member.uniqueID, server_id})
    }
  },
  removeServerChannel (context, {server_id, channelID}) {
    const filter = context.state.channelsIDs[server_id].filter(c => {
      return c !== channelID
    })
    context.commit('SET_CHANNEL_IDs', {serverID: server_id, channelIDs: filter})
  }
};

const mutations = {
  SET_CHANNEL_IDs(state, {serverID, channelIDs}) {
    Vue.set(state.channelsIDs, serverID, channelIDs)
  },
  ADD_CHANNELS_IDS(state, {serverID, channelsIDs}) {
    const previousChannels = state.channelsIDs[serverID] || []
    Vue.set(state.channelsIDs, serverID, [...new Set([...previousChannels, ...channelsIDs])]);
  },
  SET_SERVERS(state, servers) {
    state.servers = servers;
  },
  SET_SERVER(state, server) {
		Vue.set(state.servers, server.server_id, server);
  },
  REMOVE_SERVER(state, serverID) {
    Vue.delete(state.servers, serverID);
  },
  ADD_SERVER_MEMBERS(state, serverMembersArr) {

    for (let members of serverMembersArr) {
      if (!state.serverMembers.find(sm => sm.uniqueID === members.uniqueID && sm.server_id === members.server_id)){
        state.serverMembers.push(members)
      }
    }
  },
  ADD_SERVER_MEMBER(state, serverMember) {
    const exists = state.serverMembers.find(sm => sm.uniqueID === serverMember.uniqueID && sm.server_id === serverMember.server_id)
    if (exists) return;
    state.serverMembers.push(serverMember);
  },
  REMOVE_SERVER_MEMBER(state, {uniqueID, server_id}) {
    state.serverMembers = state.serverMembers.filter(m => m.uniqueID !== uniqueID && m.server_id === server_id);
  },
  SET_SELECTED_SERVER_ID(state, serverID){
    state.selectedServerID = serverID;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
