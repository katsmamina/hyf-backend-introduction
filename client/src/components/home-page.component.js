import { fetchChannels, fetchMessagesForChannel } from "../api-calls/calls.js";
import { state } from "../state/state.js";
import { sendMessage, channelClicked, addChannel } from "../handlers/handlers.js";

export const homePage = async () => {
  const el = document.createElement('div');
  el.style = 'height:100%;';

  const headerEl = document.createElement('div');
  headerEl.classList.add('header');
  headerEl.innerHTML = getHeaderInnerHtml();
  el.appendChild(headerEl);

  const mainEl = document.createElement('div');
  mainEl.classList.add('main');

  const channelListingsEl = document.createElement('div');
  channelListingsEl.classList.add('listings');
  mainEl.appendChild(channelListingsEl);

  const messageHistoryEl = document.createElement('div');
  messageHistoryEl.classList.add('message-history');
  mainEl.appendChild(messageHistoryEl);

  el.appendChild(mainEl);

  state.username = prompt("Please enter your username");

  const footerEl = document.createElement('div');
  footerEl.classList.add('footer');
  footerEl.innerHTML = 
  `
  <div class="user-menu"><span class="user-menu_profile-pic"></span>
  <button id="btn-add-channel">
    Add channel
  </button>
  <span class="user-menu_username">${state.username}</span></div>
  <div class="input-box">
    <input id="chat-field" class="input-box_text" type="text"/>
  </div>
  `;
  el.appendChild(footerEl);

  registerUpdates(headerEl, channelListingsEl, messageHistoryEl);

  // register event handlers:
  document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
  });

  channelListingsEl.addEventListener('click', channelClicked);
  footerEl.addEventListener('click', addChannel);

  return el;
}

const registerUpdates = (headerEl, channelListEl, messagesEl) => {
  setInterval(async () => {
    headerEl.innerHTML = getHeaderInnerHtml();
    const messages = await fetchMessagesForChannel(state.currentChannelId);
    const channels = await fetchChannels();
    channelListEl.innerHTML = getChannelListInnerHtml(channels);
    messagesEl.innerHTML = getMessagesInnerHtml(messages);
  }, 300);
}

const getChannelListInnerHtml = (channels) => {
  const channelEntriesHtml = channels.map(c => {
    if (state.currentChannelId === c.id) {
      return `<li data-channel-id="${c.id}" data-channel-name="${c.name}" class="channel active"><a data-channel-id="${c.id}" data-channel-name="${c.name}" class="channel_name">
      <span data-channel-id="${c.id}" data-channel-name="${c.name}"><span data-channel-id="${c.id}" data-channel-name="${c.name}" class="prefix">#</span>${c.name}</span></a></li>`;
    } else {
      return `<li data-channel-id="${c.id}" data-channel-name="${c.name}" class="channel"><a data-channel-id="${c.id}" data-channel-name="${c.name}" class="channel_name">
      <span data-channel-id="${c.id}" data-channel-name="${c.name}"><span data-channel-id="${c.id}" data-channel-name="${c.name}" class="prefix">#</span>${c.name}</span></a></li>`;
    }
  }).join('');

  return `
  <div class="listings_channels">
    <h2 class="listings_header">Channels</h2>
    <ul class="channel_list">
      ${channelEntriesHtml}
    </ul>
  </div>
      `;
}

const getMessagesInnerHtml = (messages) => {
  return messages.map(m => `
  <div class="message">
    <a class="message_profile-pic" href=""></a>
    <a class="message_username" href="">${m.user}</a>
    <span class="message_timestamp">${m.date.toString()}</span>
    <span class="message_star"></span>
    <span class="message_content">
     ${m.text}
    </span>
  </div>
  `).join('');
}

const getHeaderInnerHtml = () => {
  return `
<div class="team-menu">Team Awesome</div>
<div class="channel-menu"><span class="channel-menu_name"><span class="channel-menu_prefix">#</span>                ${state.currentChannelName}</span></div>
  `;
}

/**
 * `
  <div class="header">
    <div class="team-menu">Team Awesome</div>
    <div class="channel-menu"><span class="channel-menu_name"><span class="channel-menu_prefix">#</span>                admin</span></div>
  </div>
  <div class="main">
    <div class="listings">
      <div class="listings_channels">
        <h2 class="listings_header">Channels</h2>
        <ul class="channel_list">
          <li class="channel active"><a class="channel_name"><span class="unread">0</span><span><span class="prefix">#</span>admin</span></a></li>
          <li class="channel"><a class="channel_name"><span class="unread">10</span><span><span class="prefix">#</span>general</span></a></li>
        </ul>
      </div>
    </div>
    <div class="message-history">
      <div class="message"><a class="message_profile-pic" href=""></a><a class="message_username" href="">Chika</a><span class="message_timestamp">1:31 AM</span><span class="message_star"></span><span class="message_content">Slack Technologies, Inc. (originally Tiny Speck) is a computer software startup founded in 2009, with personnel located in Vancouver, San Francisco and Dublin. The core team is largely drawn from the founders of Ludicorp, the company that created Flickr. Slack is the fastest company to receive a billion dollar valuation.</span></div>
      <div class="message"><a class="message_profile-pic" href=""></a><a class="message_username" href="">Chika</a><span class="message_timestamp">1:31 AM</span><span class="message_star"></span><span class="message_content">Rather than trying to make your own, use RocketMail instead.</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="user-menu"><span class="user-menu_profile-pic"></span><span class="user-menu_username">Chika</span></div>
    <div class="input-box">
      <input class="input-box_text" type="text"/>
    </div>
  </div>
  `
 */