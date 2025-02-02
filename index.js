// Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyCML0z-cgMTVSNRPBVKf-4qf6mKsJDAs8c",
    authDomain: "queue-manager-a7efc.firebaseapp.com",
    projectId: "queue-manager-a7efc",
    storageBucket: "queue-manager-a7efc.firebasestorage.app",
    messagingSenderId: "546467341245",
    appId: "1:546467341245:web:d1129510a20564fb66a8d4",
    measurementId: "G-V5KX8BZHTV"
  };
  
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore(firebaseApp);

  // Get the elements from the HTML
  const nameInput = document.getElementById('profileName');
  const ageInput = document.getElementById('age');
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('pass');
  const addUserBtn = document.getElementById('addUserBtn');
  const getUsersBtn = document.getElementById('getUsersBtn');
  const userList = document.getElementById('userList');
  
  const errorMessage = document.getElementById('errorMessage'); // Defined here

// Wait for the DOM to fully load before adding the event listener
document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginUserBtn');

    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log(email, password);

        // Clear previous error messages
        errorMessage.innerText = '';

        if (email && password) {
            try {
                const querySnapshot = await db.collection("USERS").where("email", "==", email).get();
                console.log(querySnapshot);

                if (querySnapshot.empty) {
                    alert("No user found with this email.")
                    // errorMessage.innerText = "No user found with this email.";
                    return;
                }

                // Check if password matches
                let userData = null;
                querySnapshot.forEach((doc) => {
                    userData = doc.data();
                });

                // Password check (This is where you would hash in a real app)
                if (userData.password !== password) {
                    alert('Incorrect password')
                    // errorMessage.innerText = "Incorrect password.";
                    return;
                }

                // Successful login
                alert(`Welcome, ${userData.name}!`);
                window.location.href = "intex2.html"; // Redirect after login

            } catch (error) {
                console.error("Login Error:", error);
                errorMessage.innerText = "Error logging in. Please try again.";
            }
        } else {
            errorMessage.innerText = "Please enter both email and password.";
        }
    });
});

  // Add user to Firestore
  document.getElementById('addUserBtn').addEventListener('click', async () => {
    const name = nameInput.value;
    const age = ageInput.value;
    const email = emailInput.value;
    const pass = passInput.value;

    console.log("Submitted....", name, age);
    if (name && age) {
      try {
        // Add the user to Firestore collection "users"
        await db.collection('USERS').add({
          name: name,
          age: Number(age),
          email:(email),
          password:(pass)
        });
        window.location.href = "LOGIN.html";
        // Clear the input fields after adding
        nameInput.value = '';
        ageInput.value = '';
        emailInput.value = '';
        passInput.value = '';
  
        alert("User added successfully!");
      } catch (error) {
        console.error("Error adding user: ", error);
      }
    } else {
      alert("Please enter both name and age.");
    }
  });

// Get the error message element outside the event listener

//book appoinment



document.getElementById('bookAppointmentBtn').addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.innerText = ''; // Clear previous error messages

        if (name) {
            try {
                // Get the latest token number
                const querySnapshot = await db.collection("APPOINTMENTS")
                    .orderBy("tokenNumber", "desc")
                    .limit(1)
                    .get();

                let newTokenNumber = 0; // Default first token

                if (!querySnapshot.empty) {
                    const lastDoc = querySnapshot.docs[0];
                    const lastToken = lastDoc.data().tokenNumber;
                    newTokenNumber = lastToken + 1; // Increment by 1
                }

                // Store new appointment in Firestore
                await db.collection("APPOINTMENTS").add({
                    name: name,
                    tokenNumber: newTokenNumber,
                    timestamp: new Date()
                });

                // Successful booking
                alert(`Appointment booked for ${name} with Token Number: ${newTokenNumber}`);
                window.location.href = "success.html"; // Redirect to success page

            } catch (error) {
                console.error("Booking Error:", error);
                errorMessage.innerText = "Error booking appointment. Please try again.";
            }
        } else {
            errorMessage.innerText = "Please enter your Name.";
        }
    });
