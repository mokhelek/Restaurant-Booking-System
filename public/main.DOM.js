document.getElementById("usernameForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById("name-form").value;
    window.location.href = `/bookings/${name}`;

});
