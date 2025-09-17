// Get references to all the HTML elements
const originalUrlInput = document.getElementById('originalUrl');
const cleanedUrlInput = document.getElementById('cleanedUrl');
const feedbackMsg = document.getElementById('feedback');

const pasteBtn = document.getElementById('pasteBtn');
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');

// --- Helper Functions ---

// NEW: Function to validate if a string is a plausible URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // A simpler regex for basic http/https/ftp validation
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!urlPattern.test(string);
    }
}

function showFeedback(message, isError = false) {
    feedbackMsg.textContent = message;
    feedbackMsg.style.color = isError ? '#dc3545' : '#28a745';
    // Clear the message after 3 seconds
    setTimeout(() => {
        feedbackMsg.textContent = '';
    }, 3000);
}


// --- Event Listeners for Buttons ---

// 1. Paste Button (UPDATED with validation)
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        // Check if the pasted text is a valid URL
        if (isValidUrl(text)) {
            originalUrlInput.value = text;
            showFeedback("Valid URL pasted from clipboard!");
        } else {
            showFeedback("Clipboard does not contain a valid URL.", true);
        }
    } catch (err) {
        showFeedback("Failed to paste. Please check permissions.", true);
    }
});

// 2. Extract Button (No change)
extractBtn.addEventListener('click', () => {
    const originalUrl = originalUrlInput.value;
    if (originalUrl) {
        const cleanedUrl = originalUrl.split('?')[0];
        cleanedUrlInput.value = cleanedUrl;
        showFeedback("URL cleaned!");
    } else {
        showFeedback("Original URL is empty.", true);
    }
});

// 3. Copy Button (No change)
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

// 4. Share Button (No change)
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
            console.log("Share failed:", err);
        }
    } else if (!cleanedUrl) {
        showFeedback("No cleaned URL to share.", true);
    } else {
        showFeedback("Web Share API not supported in this browser.", true);
    }
});
