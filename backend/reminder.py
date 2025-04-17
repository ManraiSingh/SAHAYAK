from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import firebase_admin
from firebase_admin import credentials, messaging

app = Flask(__name__)
CORS(app)  # ✅ Allow requests from any frontend (React, etc.)

# ✅ Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-key.json")  # Make sure this file is in the same folder
firebase_admin.initialize_app(cred)

# ✅ Endpoint to receive reminder data from frontend
@app.route('/api/reminder', methods=['POST'])
def receive_reminder():
    data = request.get_json()
    print("📥 Raw data received:", data)

    medicines = data.get('medicines', [])
    print("💊 Parsed medicines:", medicines)

    if not medicines:
        return jsonify({"error": "No medicines received"}), 400

    try:
        with open('dawai.json', 'w') as f:
            json.dump({"reminders": medicines}, f, indent=2)
        print("✅ dawai.json file saved.")

        send_notification(medicines)
        return jsonify({"message": "Reminder saved and notification sent."}), 200

    except Exception as e:
        print("❌ Error while saving or sending:", e)
        return jsonify({"error": str(e)}), 500

# ✅ Firebase push notification logic
def send_notification(medicines):
    try:
        if not medicines:
            print("⚠️ Empty medicine list. Skipping notification.")
            return

        text = ", ".join([m.get("medicine", "") for m in medicines if m.get("medicine")])

        message = messaging.Message(
            notification=messaging.Notification(
                title="💊 Medicine Reminder",
                body=f"Time to take: {text}"
            ),
            topic="medicine_reminders"
        )

        response = messaging.send(message)
        print("📲 Notification sent:", response)

    except Exception as e:
        print("❌ Notification error:", e)

# ✅ Test route to check if Flask is live
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Flask is alive!"})

# ✅ Start the Flask server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
