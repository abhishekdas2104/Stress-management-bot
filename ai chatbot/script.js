
  $(function () {
    const $fab = $('#chatbotFAB');
    const $chat = $('#chatbotMain');
    const $close = $('#chatbotClose');
    const $msgs = $('#chatbotMessages');
    const $form = $('#chatbotInputForm');
    const $input = $('#chatbotUserInput');

    const API_KEY = 'AIzaSyACRwpzvc1oIbN4gVEtTSNPMsH8pJB_stY';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const stressKeywords = [
      "stress", "anxiety", "overwhelmed", "mental health", "panic", "tension",
      "nervous", "burnout", "worry", "sleep", "relax", "breathing", "mindfulness",
      "meditation", "self-care", "therapy", "counseling", "emotion", "calm",
      "focus", "overthinking", "coping", "peace", "relaxation", "deep breathing",
      "positive", "thoughts", "journaling", "rest", "balance", "exercise",
      "yoga", "resilience", "stress relief", "support", "inner peace", "healing",
    
      "mental fatigue", "brain fog", "detox", "reset", "grounding", "self-talk",
      "sleep hygiene", "unwind", "soothe", "wellness", "affirmations", "positivity",
      "self-love", "emotional support", "self-soothing", "distress", "cope",
      "emotional balance", "routine", "serotonin", "dopamine", "oxytocin",
      "endorphins", "calming", "letting go", "releasing stress", "nervous system",
      "parasympathetic", "self-regulation", "breathe", "guided meditation",
      "nature walk", "breakdown", "inner strength", "mental load", "emotional drain",
      "timeout", "reset", "mental clarity", "mindset", "mood", "wellbeing", "quotes", "home-meditation", "stressed", "breathing-exercises",
    ];

    const quickResponses = {
      "hello": "Hello! I'm here to help you manage stress. How can I assist you today?",
      "hi": "Hi there! Feeling stressed? I'm here to support you.",
      "hey": "Hey! Let’s talk about what’s on your mind.",
      "help": "I can assist with breathing exercises, mindfulness tips, or talking through stressors.",
      "thank you": "You're welcome! I'm always here when you need support.",
      "thanks": "Glad I could help. Take care of yourself!",
      "bye": "Goodbye! Take a deep breath and remember you're not alone.",
      "stressed": "It's okay to feel stressed. Let's work through it together.",
    };

    $fab.on('click', function () {
      $chat.addClass('open');
      setTimeout(function () {
        $input.focus();
      }, 350);
    });

    $close.on('click', function () {
      $chat.removeClass('open');
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      const val = $input.val().trim();
      if (!val) return;

      // Append user message
      $msgs.append(`<div class="flex items-start gap-2 justify-end"><div class="bg-purple-200 p-3 rounded-xl shadow text-indigo-900 max-w-xl">${escapeHTML(val)}</div></div>`);
      $input.val('');
      $msgs.scrollTop($msgs.prop('scrollHeight'));

      const lower = val.toLowerCase();

      if (quickResponses[lower]) {
        setTimeout(() => {
          appendBotMessage(quickResponses[lower]);
        }, 500);
        return;
      }

      const isRelevant = stressKeywords.some(keyword => lower.includes(keyword));
      if (!isRelevant) {
        setTimeout(() => {
          appendBotMessage("I specialize in stress management. Try asking about relaxation, sleep, or coping techniques.");
        }, 500);
        return;
      }

      // Typing animation
      const typingID = appendTyping();

      // Fetch from Gemini API
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: val }] }]
        })
      })
        .then(res => res.json())
        .then(data => {
          removeTyping(typingID);
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble fetching a response.";
          appendBotMessage(reply);
        })
        .catch(() => {
          removeTyping(typingID);
          appendBotMessage("⚠️ Something went wrong while contacting the server.");
        });
    });

    function appendTyping() {
      const typingID = 'typing-' + Date.now();
      $msgs.append(`<div id="${typingID}" class="flex items-start gap-2"><div class="bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-100 p-3 rounded-xl shadow text-gray-700 max-w-xl"><span class="typing-dots inline-block"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span></div></div>`);
      $msgs.scrollTop($msgs.prop('scrollHeight'));
      return typingID;
    }

    function removeTyping(id) {
      $('#' + id).remove();
    }

    function appendBotMessage(text) {
      $msgs.append(`<div class="flex items-start gap-2"><div class="bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-100 p-3 rounded-xl shadow text-gray-700 max-w-xl">${text}</div></div>`);
      $msgs.scrollTop($msgs.prop('scrollHeight'));
    }

    function escapeHTML(str) {
      return $('<div>').text(str).html();
    }
  });

