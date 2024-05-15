// fetchEquipes.js

// Function to fetch equipes data and display it in the browser
async function fetchAndDisplayEquipes() {
    try {
        // Make a request to the server to get the JWT token
        const loginResponse = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpassword'
            })
        });

        const loginData = await loginResponse.json();
        const token = loginData.token;

        // Make a request to the server to get equipes data using the JWT token
        const equipesResponse = await fetch('http://localhost:3000/equipes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the response status is not okay (not in the range 200-299)
        if (!equipesResponse.ok) {
            if (equipesResponse.status === 403) {
                // Display a message in HTML if the token is invalid
                document.querySelector('i').style.display = "flex"
                const errorMessageElement = document.getElementById('error-message');
                errorMessageElement.textContent = 'Unauthorized: Invalid Token';
            } else {
                // Display a generic error message in HTML for other errors
                const errorMessageElement = document.getElementById('error-message');
                errorMessageElement.textContent = 'Error fetching equipes data';
            }
            return;
        }

        const equipesData = await equipesResponse.json();

        // Display equipes data in the browser
        const equipesListElement = document.getElementById('equipes-list');
        equipesData.forEach(equipe => {
            const equipeItem = document.createElement('div');
            equipeItem.textContent = `ID: ${equipe.id}, Name: ${equipe.name}, Country: ${equipe.country}`;
            equipesListElement.appendChild(equipeItem);
        });
    } catch (error) {
        console.error('Error fetching equipes data:', error);
    }
}

// Call the function to fetch and display equipes data
fetchAndDisplayEquipes();
