<% if(user_id == undefined){ %>
  <a href= "/register">Registeration</a>
  <% } else { %>


  }
 <form action="/login" method="POST">
    <label for="name">Login</label>
    <input id="name" type="text" name="name">
    <input type="submit" value="Submit">
  </form>
<% } else { %>
  <p>Thanks for logging in: <%=name%></p>
  <form action="/logout" method="POST">
  <input type="submit" value="Logout"
<% } %>
