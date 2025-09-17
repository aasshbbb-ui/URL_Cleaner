// Get references to all the HTML elements
const originalUrlInput = document.getElementById('originalUrl');
const cleanedUrlInput = document.getElementById('cleanedUrl');
const feedbackMsg = document.getElementById('feedback');

const pasteBtn = document.getElementById('pasteBtn');
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');

// --- Event Listeners for Buttons ---

// 1. Paste Button
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        originalUrlInput.value = text;
        showFeedback("Pasted from clipboard!");
    } catch (err) {
        showFeedback("Failed to paste. Please check permissions.", true);
    }
});

// 2. Extract Button
extractBtn.addEventListener('click', () => {
    const originalUrl = originalUrlInput.value;
    if (originalUrl) {
        // Find the position of '?' and get the substring before it
        const cleanedUrl = originalUrl.split('?')[0];
        cleanedUrlInput.value = cleanedUrl;
        showFeedback("URL cleaned!");
    } else {
        showFeedback("Original URL is empty.", true);
    }
});

// 3. Copy Button
copyBtn.addEventListener('click', async () => {
    const cleanedUrl = cleanedUrlInput.value;
    if (cleanedUrl) {
        try {
            await navigator.clipboard.writeText(cleanedUrl);
            showFeedback("Copied to clipboard!");
        } catch (err) {
            showFeedback("Failed to copy.", true);
        }
    } else {
        showFeedback("No cleaned URL to copy.", true);
    }
});

// 4. Share Button
shareBtn.addEventListener('click', async () => {
    const cleanedUrl = cleanedUrlInput.value;
    if (cleanedUrl && navigator.share) {
        try {
            await navigator.share({
                title: 'Cleaned URL',
                text: 'Here is the cleaned URL:',
                url: cleanedUrl,
            });
        } catch (err) {
            // This can happen if the user cancels the share dialog
            console.log("Share failed:", err);
        }
    } else if (!cleanedUrl) {
        showFeedback("No cleaned URL to share.", true);
    } else {
        showFeedback("Web Share API not supported in this browser.", true);
    }
});

// --- Helper Function ---
function showFeedback(message, isError = false) {
    feedbackMsg.textContent = message;
    feedbackMsg.style.color = isError ? '#dc3545' : '#28a745';
    // Clear the message after 3 seconds
    setTimeout(() => {
        feedbackMsg.textContent = '';
    }, 3000);
}
