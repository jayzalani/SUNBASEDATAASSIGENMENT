// Function to generate a random UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Variables
  let authToken = 'dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM'; // Replace with your actual bearer token
  let customerList = [];
  
  // Helper functions
  function showScreen(screenId) {
    const screens = document.getElementsByClassName('screen');
    for (let i = 0; i < screens.length; i++) {
      screens[i].style.display = 'none';
    }
    document.getElementById(screenId).style.display = 'block';
  }
  
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
    setTimeout(() => {
      errorElement.innerText = '';
    }, 3000);
  }
  
  // Login
  function login() {
    const loginId = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
  
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_id: loginId,
        password: password,
      }),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      } else {
        throw new Error('Failed to login. Please try again later.');
      }
    })
    .then(data => {
      authToken = data.access_token;
      showScreen('customer-list-screen');
      getCustomerList();
    })
    .catch(error => {
      showError('login-error', error.message);
    });
  }
  
  // Logout
  function logout() {
    authToken = dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM;
    customerList = [];
    showScreen('login-screen');
  }
  
  // Get Customer List
  function getCustomerList() {
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM}`,
      },
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error('Invalid Authorization. Please login again.');
      } else {
        throw new Error('Failed to fetch customer list. Please try again later.');
      }
    })
    .then(data => {
      customerList = data;
      displayCustomerList(data);
    })
    .catch(error => {
      showError('customer-list-error', error.message);
    });
  }
  
  // Display Customer List
  function displayCustomerList(customers) {
    const customerListBody = document.getElementById('customer-list-body');
    customerListBody.innerHTML = '';
  
    customers.forEach(customer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.first_name}</td>
        <td>${customer.last_name}</td>
        <td>${customer.street}</td>
        <td>${customer.address}</td>
        <td>${customer.city}</td>
        <td>${customer.state}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>
          <button onclick="showEditCustomerScreen('${customer.uuid}')">Edit</button>
          <button onclick="deleteCustomer('${customer.uuid}')">Delete</button>
        </td>
      `;
      customerListBody.appendChild(row);
    });
  }
  
  // Add Customer
  function showAddCustomerScreen() {
    showScreen('add-customer-screen');
  }
  
  function addCustomer() {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const placeholderUUID = generateUUID();
  
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM}`,
      },
      body: JSON.stringify({
        uuid: placeholderUUID,
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone,
      }),
    })
    .then(response => {
      if (response.status === 201) {
        document.getElementById('add-customer-error').innerText = '';
        document.getElementById('customer-list-error').innerText = '';
        showScreen('customer-list-screen');
        getCustomerList(); // Fetch updated customer list
      } else if (response.status === 400) {
        throw new Error('First Name or Last Name is missing');
      } else {
        throw new Error('Failed to add customer. Please try again later.');
      }
    })
    .catch(error => {
      showError('add-customer-error', error.message);
    });
  }
  
  // Cancel Add Customer
  function cancelAddCustomer() {
    showScreen('customer-list-screen');
  }
  
  // Delete Customer
  function deleteCustomer(uuid) {
    const confirmDelete = confirm('Are you sure you want to delete this customer?');
    if (confirmDelete) {
      fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM}`,
        },
      })
      .then(response => {
        if (response.status === 200) {
          document.getElementById('customer-list-error').innerText = '';
          getCustomerList();
        } else if (response.status === 500) {
          throw new Error('Error deleting customer. Please try again later.');
        } else if (response.status === 400) {
          throw new Error('UUID not found');
        }
      })
      .catch(error => {
        showError('customer-list-error', error.message);
      });
    }
  }
  
  // Show Edit Customer Screen
  function showEditCustomerScreen(uuid) {
    // Implement this function as per your requirements
  }
  
  