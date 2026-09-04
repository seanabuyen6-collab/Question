// Replace these values with the Firebase config from your Firebase project.
const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_PROJECT.firebaseapp.com",
	databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
	projectId: "YOUR_PROJECT",
	storageBucket: "YOUR_PROJECT.appspot.com",
	messagingSenderId: "YOUR_SENDER_ID",
	appId: "YOUR_APP_ID"
};

const isHim = new URLSearchParams(window.location.search).get("role") === "him";
const questionForm = document.querySelector("#question-form");
const answerForm = document.querySelector("#answer-form");
const questionInput = document.querySelector("#question-input");
const answerInput = document.querySelector("#answer-input");
const answerPanel = document.querySelector("#answer-panel");
const submittedQuestion = document.querySelector("#submitted-question");
const answerText = document.querySelector("#answer-text");
const panelLabel = document.querySelector("#panel-label");
const introText = document.querySelector("#intro-text");
const connectionStatus = document.querySelector("#connection-status");

if (isHim) {
	questionForm.hidden = true;
	answerForm.hidden = false;
	introText.textContent = "A question is waiting for you. Write an honest reply and send it live.";
	panelLabel.textContent = "Question from them";
}

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
	connectionStatus.textContent = "Add your Firebase config in script.js to turn on live replies.";
} else {
	firebase.initializeApp(firebaseConfig);
	const room = firebase.database().ref("crush-question-room");

	room.on("value", (snapshot) => {
		const message = snapshot.val();
		if (!message) return;

		answerPanel.hidden = false;
		submittedQuestion.textContent = `Question: “${message.question}”`;
		answerText.textContent = message.answer || "Waiting for his reply...";
		connectionStatus.textContent = message.answer ? "Reply received live." : "Question sent. Waiting for his reply...";
	});

	questionForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const question = questionInput.value.trim();
		if (!question) return;

		room.set({ question, answer: "" });
		questionInput.value = "";
	});

	answerForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const answer = answerInput.value.trim();
		if (!answer) return;

		room.update({ answer });
		answerInput.value = "";
	});
}
