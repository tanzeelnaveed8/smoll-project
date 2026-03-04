<template>
    <div class="pdf-container">
      <!-- Header -->
      <header class="header">
        <div class="contact-info">
          <p>📞 +971 4 451 0090 | ✉️ care@smoll.me | 🌍 smoll.me</p>
        </div>
      </header>
  
      <!-- Pet & Owner Info -->
      <section class="pet-info">
        <p><strong>Pet Name:</strong> Arya</p>
        <p><strong>Pet Owner:</strong> Fahad</p>
        <p><strong>Scribed by:</strong> Friona R.</p>
        <p><strong>Appointment:</strong> Monday 09.02.2025 | 16:30</p>
      </section>
  
      <!-- Case Brief & Expert Notes -->
      <section class="case-notes">
        <h3>Case Brief</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <h3>Expert Notes</h3>
        <p>Cras malesuada felis semper eros molestie malesuada...</p>
      </section>
  
      <!-- Services Table -->
      <section class="services">
        <h3>Approved Services</h3>
        <table>
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Type</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Service A</td>
              <td>$50</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Service B</td>
              <td>$80</td>
            </tr>
          </tbody>
        </table>
      </section>
  
      <!-- Footer -->
      <footer class="footer">
        <p>📞 +971 4 451 0090 | ✉️ care@smoll.me | 🌍 smoll.me</p>
      </footer>
    </div>
  </template>
  
  <style scoped>
  .pdf-container {
    width: 600px;
    margin: auto;
    font-family: Arial, sans-serif;
    border: 1px solid #ccc;
    padding: 20px;
  }
  
  .header, .footer {
    text-align: center;
    font-weight: bold;
  }
  
  .pet-info, .case-notes, .services {
    margin-bottom: 20px;
  }
  
  h3 {
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  
  .services table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .services th, .services td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  </style>
  