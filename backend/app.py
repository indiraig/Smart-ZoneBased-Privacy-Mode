import os
import speech_recognition as sr
from flask import Flask, jsonify
import pyttsx3

app = Flask(__name__)

# Initialize the TTS engine
engine = pyttsx3.init()

# Function to speak the text
def talk(audio):
    engine.say(audio)
    engine.runAndWait()

# Function to recognize speech from microphone
def recognize_speech():
    recog = sr.Recognizer()

    with sr.Microphone() as source:
        print("Listening...")
        audio = recog.listen(source)

    try:
        command = recog.recognize_google(audio)
        print("You said:", command)
        return command
    except sr.UnknownValueError:
        print("Sorry, I could not understand that.")
        return None
    except sr.RequestError as e:
        print(f"Error with the speech recognition service: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

@app.route('/start-recognition', methods=['POST'])
def start_recognition():
    try:
        # Start the speech recognition
        command = recognize_speech()

        if command:
            command = command.lower()

            # Process the command
            if 'enable privacy mode on dbc' in command:
                print("Privacy mode enabled for DBC-front door.")
                talk("Privacy mode enabled for DBC-front door.")
                return jsonify({'zone': 'DBC-front door'}), 200

            elif 'enable privacy mode on xcam3' in command:
                print("Privacy mode enabled for Xcam3 - Living room.")
                talk("Privacy mode enabled for Xcam3 - Living room.")
                return jsonify({'zone': 'Xcam3 - Living room'}), 200

            elif 'enable privacy mode on xcam2' in command:
                print("Privacy mode enabled for Xcam2 - Bedroom.")
                talk("Privacy mode enabled for Xcam2 - Bedroom.")
                return jsonify({'zone': 'Xcam2 - Bedroom'}), 200

            else:
                talk("Sorry, I could not recognize the zone.")
                return jsonify({'error': 'Could not recognize the zone'}), 400
        else:
            talk("Sorry, I could not hear anything.")
            return jsonify({'error': 'No command recognized'}), 400

    except Exception as e:
        print(f"Error during recognition: {e}")
        return jsonify({'error': 'Server error during recognition'}), 500


if __name__ == '__main__':
    app.run(debug=True)
