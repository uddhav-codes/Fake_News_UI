// Configuration: Update this URL after deploying your Python backend
const API_URL = "https://fake-news-backend-5yef.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("detectorForm");
    const inputTypeRadios = document.getElementsByName("inputType");
    const userInput = document.getElementById("userInput");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const loader = document.getElementById("loader");
    const resultBox = document.getElementById("resultBox");
    const verdictEl = document.getElementById("verdict");
    const confidenceEl = document.getElementById("confidenceLevel");

    // Dynamically change placeholder based on input type
    inputTypeRadios.forEach(radio => {
        radio.addEventListener("change", e => {
            if (e.target.value === "url") {
                userInput.placeholder = "https://example.com/news-article...";
            } else {
                userInput.placeholder = "Type or paste the headline/article text here...";
            }
        });
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const type = document.querySelector('input[name="inputType"]:checked').value;
        const text = userInput.value.trim();

        if (!text) return;

        // UI Loading State
        submitBtn.disabled = true;
        btnText.classList.add("hidden");
        loader.classList.remove("hidden");
        resultBox.classList.add("hidden");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: type, content: text }),
            });

            if (!response.ok) throw new Error("Server Error or Invalid URL");

            const data = await response.json();

            // Display Results
            verdictEl.textContent = data.prediction === "REAL" ? "REAL NEWS" : "FAKE NEWS";

            // Apply Red/Green styling
            verdictEl.className = ""; // Reset classes
            if (data.prediction === "REAL") {
                verdictEl.classList.add("text-real");
            } else {
                verdictEl.classList.add("text-fake");
            }

            confidenceEl.textContent = data.message || "Analysis complete.";
            resultBox.classList.remove("hidden");
        } catch (error) {
            alert("Error analyzing input. Ensure the URL is accessible or try text mode.");
        } finally {
            // Restore UI State
            submitBtn.disabled = false;
            btnText.classList.remove("hidden");
            loader.classList.add("hidden");
        }
    });
});
