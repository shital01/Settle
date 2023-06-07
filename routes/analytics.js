const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Transaction} = require('../models/transaction');
var _ = require('lodash');
const {User} = require('../models/user');
const auth =require('../middleware/auth');
const ObjectId = require('mongodb').ObjectId;

//Viral Factor

router.put('/ViralFactor',async(req,res)=>{
    // Count the total number of users
    const totalUsers = await User.count();
    // Find the viral users
    const cursor = await User.aggregate([
      {
        $lookup: {
          from: 'transactions',
          localField: 'PhoneNumber',
          foreignField: 'ReceiverPhoneNumber',
          as: 'receivedMessages'
        }
      },
        {
      $project: {
        PhoneNumber: 1,
        receivedMessages: {
          SenderPhoneNumber: 1,
          ReceiverPhoneNumber: 1,
          UpdatedDate: 1
        }
      }
    },
    {
      $match: {
        receivedMessages: { $ne: [] } // Filter out documents where receivedMessages is an empty array
      }
  },
  {
    $addFields: {
      earliestUpdateTime: {
        $min: '$receivedMessages.UpdatedDate'
      },
      accountCreationTimestamp: {
        $toDate: '$_id'
      }
    }
  },
  /*
   {
    $addFields: {
      Time1: {
        $toDate: '$earliestUpdateTime'
      },
      Time2:{
        $toDate:'$accountCreationTimestamp'
      }
    }

  },
  */
  {
      $match: {
        $expr: {
          $lt: ['$earliestUpdateTime', '$accountCreationTimestamp']
        }
      }
    }
    ,{
    $count: 'viralUsersCount'
  } 
    ]);
 const result = cursor[0]?.viralUsersCount || 0;
  const viralFactor = result / totalUsers;
  res.send(viralFactor.toString());
  
})

//time till first message
router.put('/NotActivatedUsers',async(req,res)=>{
 const result =await Transaction.aggregate([
  // Lookup users who received messages
  {
    $lookup: {
      from: "User",
      localField: "ReceiverPhoneNumber",
      foreignField: "PhoneNumber",
      as: "user"
    }
  },
  // Filter out users who have an account creation time
  {
    $match: {
      "user.Name": { $exists: false }
    }
  },
  // Count the number of unique users
  {
    $group: {
      _id: "$ReceiverPhoneNumber"
    }
  },
  {
    $count: "numUsers"
  }
])



  return result;

});

router.put('/ActivatedUsers',async(req,res)=>{
 
const result = await User.aggregate([
  // Lookup messages sent to each user
  {
    $lookup: {
      from: "Transaction",
      let: { phone: "$PhoneNumber" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: [ "$ReceiverPhoneNumber", "$$phone" ] }
          }
        },
        {
          $group: {
            _id: "$ReceiverPhoneNumber",
            oldestMessage: { $min: "$TimeStamp" }
          }
        }
      ],
      as: "messages"
    }
  },
  // Filter users with no messages
  {
    $match: {
      messages: { $ne: [] }
    }
  },
  // Count the number of users with oldest message after account creation
  //Time of Account Creation
  {
    $match: {
      $expr: {
        $gt: [ { $min: "$messages.oldestMessage" }, "$TimeofAccountCreation" ]
      }
    }
  },
  {
    $count: "numUsers"
  }
])




  return result;

});

//time till first message
router.put('/UserTime',async(req,res)=>{
 



  return result;

});


router.put('/User',async(req,res)=>{
  //throw new Error("hello")
  // Step 01: Aggregate the data to get daily count of active senders
  const result = await User.aggregate([
  {
    $group: {
      _id: {
        yearMonthDay: { $substr: [ { $toString: "$_id" }, 0, 8 ] },
      },
      noOfSignUp: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      date: {
        $dateFromString: {
          dateString: "$_id.yearMonthDay",
          format: "%Y%m%d"
        }
      },
      noOfSignUp: 1
    }
  }
])


});


router.put('/ActiveUser',async(req,res)=>{
	//throw new Error("hello")
	// Step 01: Aggregate the data to get daily count of active senders
	const result = await Transaction.aggregate([
     {
      $sort: { UpdatedDate: 1 }
    },
    {
      // group by date and senderID and count the occurrences
      $group: {
        _id: {
          date: { $substr: [ "$UpdatedDate", 0, 10 ] },
          senderID: "$SenderID"
        },
        count: { $sum: 1 }
        
      }
    },
    {
      // format the output as required
      $project: {
        _id: 0,
        Date: "$_id.date",
        SenderID: "$_id.senderID",
        count: 1
      }
    }
  ])
  //console.log(result)
  //const result1 = await Step01.insertMany(result);
  //const output = await transaction.save();
 // console.log(result1)
 // const result2 = await getTotalCount(result)
// example usage
const input = result
const cutoff = req.body.cutoff;
const output = calculateTotalCount(input,cutoff);
//console.log(output);

//const result1= processData(result);

  //console.log(result2)
	res.send(output);
		
});




function calculateTotalCount(arr,cutoff) {
  // sort the array in increasing order of date
  arr.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  // initialize a variable to keep track of the total count for each senderID
  const totalCounts = {};

  // iterate through each object in the array
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const senderID = obj.SenderID;

    // calculate the total count for the senderID up to this date
    let totalCount = totalCounts[senderID] || 0;
    totalCount += obj.count;

    // update the object with the total count and add it to the output array
    const outputObj = {
      ...obj,
      totalcount: totalCount
    };
    arr[i] = outputObj;

    // update the total count for the senderID in the totalCounts object
    totalCounts[senderID] = totalCount;
  }
// Example usage
// First, create a map of all sender IDs and their total counts
  return findActiveSenders(arr,cutoff);
}


function findActiveSenders(data,cutoff) {
  // Find the earliest date in the input data
  const earliestDate = new Date(Math.min(...data.map((entry) => new Date(entry.Date))));
  const today = new Date();

  // Create an array of all dates from the earliest date to today
  const dates = [];
  for (let d = earliestDate; d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  // Initialize an object to hold the active senders for each date
  const activeSendersByDate = {};
  for (const date of dates) {
    activeSendersByDate[date.toISOString().slice(0, 10)] = [];
  }

  // Iterate through the input data and update the active senders for each date
  const activeSenders = new Set();
  for (const entry of data) {
    const date = new Date(entry.Date);
    const senderID = entry.SenderID._id.toString();

    // Check if this sender has become active on or before this date
    if (entry.totalcount >= cutoff) {
      activeSenders.add(senderID);
    }

    // Add all active senders to the activeSendersByDate object for this date and all future dates
    for (const d of dates.filter((d) => d >= date)) {
      const dateString = d.toISOString().slice(0, 10);
      activeSendersByDate[dateString] = [...activeSenders];
    }
  }
  //console.log(activeSendersByDate);
//size test n print length all places
  // Convert the activeSendersByDate object to an array of objects with "Date" and "ActiveSenders" properties
  const result = Object.entries(activeSendersByDate).map(([date, senders]) => ({
    Date: date,
    ActiveSenders: [...new Set(senders)].length,
//console.log(uniqueArr); // Output: [1, 2, 3, 4]
//Array.from(new Set(senders)),
  }));

  return result;
}


module.exports =router;
