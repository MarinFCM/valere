const form = document.querySelector("form");
const email = document.querySelector("#email");
const display = document.querySelector(".error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  display.textContent = "";
  try {
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      body: JSON.stringify({email: email.value}),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status === 400 || res.status === 401) {
      return (display.textContent = `${data.message}. ${
        data.error ? data.error : ""
      }`);
    }
      display.textContent = `${data.message}. ${data.error ? data.error : ""}`;
  } catch (err) {
    console.log(err.message);
  }
});
