import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import data from './Data/data';
function calculateReward(price) {
  let rewards = 0;
  
  if (price > 100) {
    let above100=price-100;
    rewards = 50+(above100*2);
  }
  if (price > 50 && price <= 100) {
    rewards = price - 50;
  
  }
  return rewards;

}

function App() {
  //defining states 
  const [loadData, setLoadData] = useState({});
  const [customerRewards, setCustomerRewards] = useState({});
  const [userTransactions, setUserTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  //fetching the data from data.js
  useEffect(() => {
    setLoadData({ ...data });
    setCustomers([...Object.keys(data)]);

  }, []);


  const customerSelected = (value) => {
    setCurrentUser(value);
    let customerData = loadData[value];

    let months = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };

    //calculating the amount and reward points per month
    for (let i = 0; i < customerData.length; i++) {
      let month = new Date(customerData[i]['date']);
      if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
        months[month.getMonth() + 1]['amounts'].push(customerData[i]['amount']);
      }
    }
    for (let key in months) {
      let rewards_month = 0;
      let amount_month=0;
      for (let i = 0; i < months[key]['amounts'].length; i++) {
        let price = months[key]['amounts'][i];
        let amount=months[key]['amounts'][i];
        rewards_month = rewards_month + calculateReward(price);
        amount_month=amount_month+amount;
      }
      months[key]['rewards'] = calculateReward(amount_month); //calculating reward points per month
      months[key]['amounts']=amount_month;
    }
    console.log(months)
    setCustomerRewards({ ...months });
    setUserTransactions([...customerData]);
  };

  
  return (
      <div className="grid-container" >    
      <h2>Customer Rewards Dashborad</h2>
      <div className="grid-item " >
        <select onChange={e => customerSelected(e.target.value)} value={currentUser} >
          <option value="" disabled>Select User</option>
          {customers.map((item, index) => {
            return (
              <option key={index} value={item}> {item.toUpperCase()} </option>
            );
          })}
        </select>
      </div>
      {Object.keys(customerRewards).length > 0 &&
        <Fragment>
          
          {userTransactions.length > 0 ?
            <table className="customers">
              
              <thead>
              <h4>Customer Transactions</h4>
                <tr>
                  <th>Date</th>
                  <th>Transaction Amount</th>
                  
                </tr>

              </thead>
              <tbody>
                {userTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    
                  </tr>
                })}
              </tbody>
          
            </table>
            : <div>No Transactions Found</div>}
          <table className="customers">
            <thead>
            <h4>Customer Rewards By Month</h4>
              <tr id="customers">
                <th>Month</th>
                <th>Amount</th>
                <th>Reward Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First Month</td>
                <td>{customerRewards[1]["amounts"]}</td>
                <td>{customerRewards[1]["rewards"]}</td>
                               
              </tr>
              <tr>
                <td>Second Month</td>
                <td>{customerRewards[2]["amounts"]}</td>
                <td>{customerRewards[2]["rewards"]}</td>
                
              </tr>
              <tr>
                <td>Third Month</td>
                <td>{customerRewards[3]["amounts"]}</td>
                <td>{customerRewards[3]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward Points:</td>
                <td>{customerRewards[1]["rewards"] + customerRewards[2]["rewards"] + customerRewards[3]["rewards"]}</td>
                
              </tr>
            </tbody>
          </table>
          
          
        </Fragment>
      }


    </ div >
  );
}

export default App;

