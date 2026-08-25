function updateStats() {
  let avgSleep = 0;
  let pensiveCount = 0;
  let angryCount = 0;
  let motivatedCount = 0;
  let lovedCount = 0;

  for (const data of formDataArray) {
    avgSleep += Number(data.sleep);
    if (data.pensive === "true") pensiveCount++;
    if (data.angry === "true") angryCount++;
    if (data.motivated === "true") motivatedCount++;
    if (data.loved === "true") lovedCount++;
  }

  avgSleep /= formDataArray.length;
  document.getElementById("average-sleep-time").textContent = avgSleep;
  document.getElementById("pensive-days").textContent = pensiveCount;
  document.getElementById("angry-days").textContent = angryCount;
  document.getElementById("motivated-days").textContent = motivatedCount;
  document.getElementById("loved-days").textContent = lovedCount;
}

const formDataArray = [
  {note: "good!", sleep: "8", motivated: "true"},
  {note: "tired", sleep: "6", pensive: "true", motivated: "true"},
  {note: "fantastic!", sleep: "10", motivated: "true", loved: "true"},
]
updateStats();

let wellnessForm = document.getElementById("wellness-form");
wellnessForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const allData = Object.fromEntries(formData.entries());
  console.log('All Form Data Object:', allData);
  formDataArray.push(allData);
  console.log('Form Data Array:', formDataArray);

  updateStats();
});
