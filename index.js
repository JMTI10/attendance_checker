let records = [];

function getTotalClasses() {
    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(document.getElementById("endDate").value);
    const perWeek = parseInt(document.getElementById("classesPerWeek").value);

    if (isNaN(start) || isNaN(end) || isNaN(perWeek)) return 0;

  const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
  return weeks * perWeek;
}

function markAttendance(type) {
    if (!["attended", "missed", "canceled"].includes(type)) return;

    records.push(type);
    updateStats();
}

function updateStats() {
    const total = getTotalClasses();
    const attended = records.filter(r => r === "attended").length;
    const canceled = records.filter(r => r === "canceled").length;
    const validTotal = total - canceled;

  const percentage = validTotal > 0 ? (attended / validTotal) * 100 : 0;

    document.getElementById("stats").textContent = `
    Attended: ${attended} / ${validTotal} (${percentage.toFixed(1)}%)
    Total Scheduled: ${total}, Missed: ${records.filter(r => r === "missed").length}, Canceled: ${canceled}`;
}
