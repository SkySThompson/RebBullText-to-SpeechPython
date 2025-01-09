document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("microphone");
    const stopButton = document.getElementById("stopButton");
    const chatbox = document.getElementById("chatbox");
    const listeningIndicator = document.createElement("div");
    const liveTranscription = document.createElement("div");
    const respondButton = document.getElementById("respondButton");

    listeningIndicator.textContent = "Listening...";
    listeningIndicator.style.display = "none";
    liveTranscription.textContent = "You said: ";
    liveTranscription.style.display = "none";

    chatbox.appendChild(listeningIndicator);
    chatbox.appendChild(liveTranscription);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const synth = window.speechSynthesis;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    startButton.addEventListener("click", function() {
        recognition.start();
        listeningIndicator.style.display = "block";
        liveTranscription.style.display = "block";
        stopButton.style.display = "block";
        startButton.classList.add("active");
        console.log("Voice recognition started");
    });

    stopButton.addEventListener("click", function() {
        recognition.stop();
        listeningIndicator.style.display = "none";
        stopButton.style.display = "none";
        respondButton.style.display = "block";
        startButton.classList.remove("active");
        console.log("Voice recognition stopped");
    });

    recognition.onresult = function(event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                const userInput = event.results[i][0].transcript;
                liveTranscription.textContent = `You said: ${userInput}`;
                addMessage("User", userInput);
                respondButton.onclick = function() {
                    fetch('/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: userInput })
                    })
                    .then(response => response.json())
                    .then(data => {
                        addMessage("Bot", data.response);
                        speak(data.response);
                        if (data.image_url) {
                            showImage(data.image_url);
                        }
                        respondButton.style.display = "none";
                    });
                };
            } else {
                interimTranscript += event.results[i][0].transcript;
                liveTranscription.textContent = `You said: ${interimTranscript}`;
            }
        }
    };

    recognition.onerror = function(event) {
        listeningIndicator.style.display = "none";
        liveTranscription.style.display = "none";
        stopButton.style.display = "none";
        startButton.classList.remove("active");
        console.error("Speech recognition error:", event.error);
        addMessage("Error", "Sorry, I did not understand that.");
    };

    function addMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${sender}: ${message}`;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    }

    function showImage(url) {
        const imageElement = document.createElement("img");
        imageElement.src = url;
        imageElement.alt = "Red Bull Image";
        imageElement.className = "response-image";
        chatbox.appendChild(imageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
//
const bgImageEl = document.getElementById("bg-image");

window.addEventListener("scroll", () => {
  updateImage();
});

function updateImage() {
  bgImageEl.style.opacity = 1 - window.pageYOffset / 900;
  bgImageEl.style.backgroundSize = 160 - window.pageYOffset / 12 + "%";
}

//The cool cursor Effect
