const express = require("express");
const fs = require("fs");

const app = express();

const withComma = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

app.get("/convert", async (req, res) => {
  const { source, target, amount } = req.query;
  
  if (!source || !target || !amount) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  
  const cleanAmount = parseFloat(amount.replace(/[$,]/g, ''));

  if (isNaN(cleanAmount) || cleanAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const data = JSON.parse(fs.readFileSync('rates.json'));

  if (!data.currencies || !data.currencies[source] || !data.currencies[target]) {
    return res.status(400).json({ error: "Invalid source or target currency" });
  }

  const rate = data.currencies[source][target];
  
  const result = rate * cleanAmount;

  res.status(200).json({ 
    result: `${withComma(cleanAmount)} ${source} = ${withComma(result.toFixed(2))} ${target}`
  });
});

if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;