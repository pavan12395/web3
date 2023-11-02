const axios = require('axios');

const baseURL = 'http://localhost:5000'; // Replace with your server's URL

// Test Case 1: Testing the '/addUser' endpoint
async function testAddUser() {
  try {
    const response = await axios.post(`${baseURL}/addUser`, {
      userMail: 'example@example.com', // Replace with the user data you want to add
    });

    console.log('Test Case 1: Add User - Success');
    console.log(response.data);
  } catch (error) {
    console.error('Test Case 1: Add User - Failed');
    console.error(error.response.data);
  }
}

// Test Case 2: Testing the '/checkUser' endpoint
async function testCheckUser() {
  try {
    const userMail = 'example@example.com'; // Replace with the user you want to check
    const response = await axios.post(`${baseURL}/checkUser`, {
      userMail : userMail
    });

    console.log('Test Case 2: Check User - Success');
    console.log(response.data);
  } catch (error) {
    console.error('Test Case 2: Check User - Failed');
    console.error(error.response.data);
  }
}


async function testCheckUserFail() {
    try {
      const userMail = 'example1@example.com'; // Replace with the user you want to check
      const response = await axios.post(`${baseURL}/checkUser`, {
        userMail : userMail
      });
  
      console.log('Test Case 2: Check User - Success');
      console.log(response.data);
    } catch (error) {
      console.error('Test Case 2: Check User - Failed');
      console.error(error.response.data);
    }
  }
// Run the test cases
testAddUser();
testCheckUser();
testCheckUserFail();