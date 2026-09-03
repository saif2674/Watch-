(function () {
  const btn = document.createElement("a");
  btn.href = "https://wa.me/923370596139?text=" + encodeURIComponent("Hello WatchHub, I have a question.");
  btn.target = "_blank";
  btn.className = "whatsapp-float-btn";
  btn.title = "Chat with us on WhatsApp";
  btn.innerHTML = "&#128172;";
  document.body.appendChild(btn);
})();
