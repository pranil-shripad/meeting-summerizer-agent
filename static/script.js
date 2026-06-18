// DOM Elements
const transcriptInput = document.getElementById("transcript");
const charCount = document.getElementById("charCount");
const processAllBtn = document.getElementById("processAllBtn");
const summarizeBtn = document.getElementById("summarizeBtn");
const extractBtn = document.getElementById("extractBtn");
const followUpBtn = document.getElementById("followUpBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");

// State
let currentResults = {
  summary: "",
  actions: "",
  followup: "",
};

// Character counter
transcriptInput.addEventListener("input", () => {
  charCount.textContent = transcriptInput.value.length;
});

// Tab switching
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    // Remove active class from all buttons and panes
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // Add active class to clicked button and corresponding pane
    button.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  });
});

// Helper functions
function showLoading(show = true) {
  loadingIndicator.classList.toggle("show", show);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}

function updateResult(resultType, content) {
  currentResults[resultType] = content;
  const element = document.getElementById(resultType);
  if (element) {
    element.innerHTML = marked(content) || content;
  }
}

function getActiveTab() {
  const activePane = document.querySelector(".tab-pane.active");
  if (activePane) {
    return activePane.id;
  }
  return "summary";
}

function copyToClipboard() {
  const activeTab = getActiveTab();
  const content = currentResults[activeTab];

  if (!content) {
    showError("Nothing to copy");
    return;
  }

  navigator.clipboard
    .writeText(content)
    .then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "<span>✓ Copied!</span>";
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    })
    .catch(() => {
      showError("Failed to copy to clipboard");
    });
}

function downloadResults() {
  const timestamp = new Date().toLocaleString();
  const content = `MEETING REPORT
Generated: ${timestamp}
==========================================

SUMMARY:
${currentResults.summary}

==========================================
ACTION ITEMS:
${currentResults.actions}

==========================================
FOLLOW-UP MESSAGE:
${currentResults.followup}

==========================================`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meeting_report_${new Date().getTime()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// API calls
async function apiCall(endpoint, transcript) {
  if (!transcript.trim()) {
    showError("Please enter a meeting transcript");
    return null;
  }

  showLoading(true);

  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    showError(`Error: ${error.message}`);
    console.error("API Error:", error);
    return null;
  } finally {
    showLoading(false);
  }
}

// Button event listeners
summarizeBtn.addEventListener("click", async () => {
  const data = await apiCall("summarize", transcriptInput.value);
  if (data) {
    updateResult("summary", data.summary);
    document.querySelector('[data-tab="summary"]').click();
  }
});

extractBtn.addEventListener("click", async () => {
  const data = await apiCall("extract-actions", transcriptInput.value);
  if (data) {
    updateResult("actions", data.action_items);
    document.querySelector('[data-tab="actions"]').click();
  }
});

followUpBtn.addEventListener("click", async () => {
  const data = await apiCall("follow-up", transcriptInput.value);
  if (data) {
    updateResult("summary", data.summary);
    updateResult("actions", data.action_items);
    updateResult("followup", data.follow_up);
    document.querySelector('[data-tab="followup"]').click();
  }
});

processAllBtn.addEventListener("click", async () => {
  const data = await apiCall("process-all", transcriptInput.value);
  if (data) {
    updateResult("summary", data.summary);
    updateResult("actions", data.action_items);
    updateResult("followup", data.follow_up);
    document.querySelector('[data-tab="summary"]').click();
  }
});

clearBtn.addEventListener("click", () => {
  transcriptInput.value = "";
  charCount.textContent = "0";
  currentResults = { summary: "", actions: "", followup: "" };
  tabPanes.forEach((pane) => {
    pane.innerHTML =
      '<div class="result-placeholder"><p>Results will appear here...</p></div>';
  });
});

copyBtn.addEventListener("click", copyToClipboard);
downloadBtn.addEventListener("click", downloadResults);

// Simple markdown parser (basic support)
function marked(text) {
  if (!text) return text;

  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.*?)_/g, "<em>$1</em>");

  // Headings
  text = text.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  text = text.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  text = text.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  // Line breaks
  text = text.replace(/\n/g, "<br>");

  // Lists
  text = text.replace(/^\- (.*?)$/gm, "<li>$1</li>");
  text = text.replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>");
  text = text.replace(/(<\/li>)(\n|<br>)?(<li>)/g, "$1$3");

  return text;
}

// Initial setup
console.log("Meeting Summarizer UI loaded successfully");
