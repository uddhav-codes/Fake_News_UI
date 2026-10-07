// Configuration: Update this URL after deploying your Python backend
const API_URL = "https://fake-news-backend-5yef.onrender.com/predict";

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
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.classList.add("hidden");
        if (loader) loader.classList.remove("hidden");
        if (resultBox) resultBox.classList.add("hidden");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: type, content: text }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Server Error or Invalid URL");
            }

            // Normalize prediction value from either key format
            const rawPrediction = (data.prediction || data.result || "").toUpperCase();
            const isReal = rawPrediction === "REAL";

            // Safely display Results
            if (verdictEl) {
                verdictEl.textContent = isReal ? "REAL NEWS" : "FAKE NEWS";
                verdictEl.className = ""; // Reset classes
                verdictEl.classList.add(isReal ? "text-real" : "text-fake");
            }

            if (confidenceEl) {
                confidenceEl.textContent = data.message || "Analysis complete.";
            }

            if (resultBox) {
                resultBox.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Analysis pipeline error:", error);
            alert(error.message || "Error analyzing input. Ensure the URL is accessible or try text mode.");
        } finally {
            // Restore UI State
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.classList.remove("hidden");
            if (loader) loader.classList.add("hidden");
        }
    });
});