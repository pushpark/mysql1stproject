const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./dbConfig');

const app = express();

app.use(express.json());

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  
  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
  });


  app.get('/', (req, res) => {
    const { ticker, column, period } = req.query;
    let periodNumber=''
    if (period!==undefined){
      const l=period.length
      periodNumber=period.slice(0,l-1);
    }
    
    console.log(ticker, column, period)
    let queryColumn="";
    let query=""
    if (column===undefined){
      queryColumn="*"
    }
    else {
      queryColumn=column
    }
    if (ticker===undefined && period === undefined){
      query=`SELECT ${queryColumn} FROM financial_data`
    }
    else if(ticker===undefined) {
      query=`SELECT ${queryColumn} FROM financial_data WHERE date >= DATE_SUB(NOW(), INTERVAL ${periodNumber} YEAR)`
    }
    else if (period===undefined){
      query=`SELECT ${queryColumn} FROM financial_data WHERE ticker = '${ticker}'`
    }
    else{
      query=`SELECT ${queryColumn} FROM financial_data WHERE ticker = '${ticker}' AND date >= DATE_SUB(NOW(), INTERVAL ${periodNumber} YEAR)`
    }
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching financial_data:', err);
        res.status(500);
        res.send('Error fetching users');
        return;
      }
      res.json(results);
    });
  });
