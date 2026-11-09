/**
 * Team chat example — channel switching, message rendering and the composer.
 * In-memory only (no backend); swap `channels` for a real data source.
 */

const channels = {
  general: {
    topic: "Company-wide announcements and chat",
    messages: [
      { author: "Jamie Diaz", initials: "JD", time: "9:02 AM", text: "Morning all — standup in 10." },
      { author: "Alex Kim", initials: "AK", time: "9:03 AM", text: "On it, just finishing a build." },
      { author: "Riya Patel", initials: "RP", time: "9:10 AM", text: "Pushed the new pricing page for review 🎉" },
    ],
  },
  random: {
    topic: "Non-work banter",
    messages: [
      { author: "Tom Nilsson", initials: "TN", time: "8:45 AM", text: "Anyone else's coffee machine possessed today?" },
      { author: "Sam Lee", initials: "SL", time: "8:47 AM", text: "Every day, Tom. Every day." },
    ],
  },
  engineering: {
    topic: "Build failures, deploys, on-call",
    messages: [
      { author: "Alex Kim", initials: "AK", time: "7:58 AM", text: "Deploy to staging is green." },
      { author: "You", initials: "YO", time: "8:01 AM", text: "Nice, kicking off the smoke tests now." },
    ],
  },
};

const messageList = document.getElementById("message-list");
const channelTitle = document.getElementById("channel-title");
const channelTopic = document.getElementById("channel-topic");
const composerInput = document.getElementById("composer-input");
const composerForm = document.getElementById("composer-form");
const memberSidebar = document.getElementById("member-sidebar");
const toggleMembersBtn = document.getElementById("toggle-members");

function renderMessage({ author, initials, time, text }) {
  const row = document.createElement("div");
  row.className = "chat-message";
  row.innerHTML = `
    <span class="wds-avatar">${initials}</span>
    <div class="chat-message-body">
      <div class="chat-message-meta">
        <span class="chat-message-author">${author}</span>
        <span class="chat-message-time">${time}</span>
      </div>
      <div class="chat-message-text"></div>
    </div>
  `;
  row.querySelector(".chat-message-text").textContent = text;
  return row;
}

function renderChannel(name) {
  const channel = channels[name];
  if (!channel) return;
  channelTitle.textContent = name;
  channelTopic.textContent = channel.topic;
  composerInput.placeholder = `Message #${name}`;
  messageList.replaceChildren(...channel.messages.map(renderMessage));
  messageList.scrollTop = messageList.scrollHeight;
}

document.querySelectorAll(".chat-channel-link[data-channel]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".chat-channel-link[data-channel]").forEach((l) => l.removeAttribute("aria-current"));
    link.setAttribute("aria-current", "page");
    renderChannel(link.dataset.channel);
  });
});

composerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = composerInput.value.trim();
  if (!text) return;
  const current = document.querySelector('.chat-channel-link[aria-current="page"]').dataset.channel;
  const message = { author: "You", initials: "YO", time: "Just now", text };
  channels[current].messages.push(message);
  messageList.appendChild(renderMessage(message));
  messageList.scrollTop = messageList.scrollHeight;
  composerInput.value = "";
});

toggleMembersBtn.addEventListener("click", () => {
  memberSidebar.classList.toggle("wds-hidden");
});

renderChannel("general");
