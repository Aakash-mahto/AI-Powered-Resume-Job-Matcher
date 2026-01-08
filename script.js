// ===============================
// Resume Upload Logic
// ===============================
const input = document.getElementById("resumeInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const removeBtn = document.getElementById("removeFile");

input.addEventListener("change", () => {
  if (input.files.length > 0) {
    fileName.textContent = input.files[0].name;
    fileInfo.style.display = "flex";
  }
});

removeBtn.addEventListener("click", () => {
  input.value = "";
  fileInfo.style.display = "none";
});

// ===============================
// Submit Button & Skills Logic
// ===============================
const submitBtn = document.querySelector(".submit-button");
const skillsInput = document.getElementById("skillsInput");

submitBtn.addEventListener("click", async () => {

  if (!skillsInput || !skillsInput.value.trim()) {
    alert("Please enter your skills.");
    return;
  }

  submitBtn.innerText = "Analyzing with AI...";
  submitBtn.disabled = true;

  try {
    const aiResult = await getJobRolesFromAI(skillsInput.value);
    displayJobResults(aiResult);

  } catch (error) {
    console.error(error);
    alert("Something went wrong while connecting to AI.");
  }

  submitBtn.innerText = "SUBMIT";
  submitBtn.disabled = false;
});

// ===============================
// OpenAI API Call (Frontend Demo)
// ===============================
async function getJobRolesFromAI(skillsText) {

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer "
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a career guidance assistant." },
        {
          role: "user",
          content: `Suggest 3 job roles for a candidate with these skills: ${skillsText}.
          Return only job role names separated by commas.`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ===============================
// Display AI Job Results
// ===============================
function displayJobResults(aiText) {

  const jobBox = document.querySelector(".job-box");
  const jobSection = document.querySelector(".third-section");

  jobBox.innerHTML = "";

  const jobs = aiText.split(",");

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <span class="job-title">${job.trim()}</span>
      <span class="cmp-name">AI Suggested</span>
      <div class="job-location">
        <span class="actual-location">Remote / Flexible</span>
        <div class="apply-button">Apply</div>
      </div>
    `;
    jobBox.appendChild(card);
  });

  jobSection.style.display = "block";
  jobSection.scrollIntoView({ behavior: "smooth" });
}
