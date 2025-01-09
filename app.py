from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
import pyttsx3
import threading

app = Flask(__name__)

# Initialize the recognizer and text-to-speech engine
recognizer = sr.Recognizer()
tts_engine = pyttsx3.init()

# Function to convert text to speech
def speak(text):
    def run_speak():
        tts_engine.say(text)
        tts_engine.runAndWait()
    threading.Thread(target=run_speak).start()

# Function to recognize speech and return the text
def recognize_speech():
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I did not understand that.")
            return ""
        except sr.RequestError:
            print("Sorry, my speech service is down.")
            return ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = ""
    image_url = ""
    if "hello" in user_input.lower():
        response = "Hey there! How's it going? You can ask me about Red Bull products, events, or extreme sports."
    elif "product" in user_input.lower():
        response = "Red Bull has some awesome energy drinks to keep you pumped! We've got the classic Red Bull Energy Drink, Red Bull Sugarfree, and Red Bull Zero. Each one has its own unique flavor and benefits. Which one do you want to know more about?"
        image_url = "https://example.com/redbull_product.jpg"
    elif "event" in user_input.lower():
        response = "Red Bull throws some epic events like the Red Bull Air Race, Red Bull Rampage, and Red Bull Cliff Diving. These events are all about pushing the limits and showcasing incredible talent. Want to dive into any specific event?"
        image_url = "https://example.com/redbull_event.jpg"
    elif "extreme sport" in user_input.lower():
        response = "Red Bull is all about extreme sports like skydiving, snowboarding, and more. We support athletes who push the boundaries and achieve the extraordinary. Which extreme sport gets your adrenaline pumping?"
        image_url = "https://example.com/redbull_extreme_sport.jpg"
    elif "exit" in user_input.lower() or "bye" in user_input.lower():
        response = "Catch you later! Stay energized with Red Bull!"
    else:
        response = "Red Bull is known for its energy drinks and involvement in extreme sports and events. What would you like to know more about?"
        image_url = "https://example.com/redbull_default.jpg"
    
    speak(response)
    return jsonify({"response": response, "image_url": image_url})

if __name__ == '__main__':
    app.run(debug=True)
