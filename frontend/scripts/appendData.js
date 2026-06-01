const fs = require('fs');
const path = require('path');

// The file where questions are stored
const filePath = path.join(__dirname, '..', 'src', 'data', 'AI_Generated_Questions.json');

try {
  // Get the new data from command line arguments (passed by n8n)
  const newDataString = process.argv[2];
  if (!newDataString) {
    console.error("No data provided!");
    process.exit(1);
  }

  const newData = JSON.parse(newDataString);

  // Read existing file
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.trim()) {
      existingData = JSON.parse(fileContent);
    }
  }

  // Append new data
  existingData.push(newData);

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  console.log("Successfully appended new AI questions to " + filePath);

} catch (error) {
  console.error("Error appending data:", error);
  process.exit(1);
}
