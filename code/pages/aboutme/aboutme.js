
function updateAge() {
  const birth = new Date(2011, 4, 20, 10, 22, 0);
  const now = new Date();
  const msPerYear = 31536000 * 1000;       
  const age = (now - birth) / msPerYear;

  document.getElementById('age-counter').textContent = age.toFixed(10);
  requestAnimationFrame(updateAge);       
}

updateAge();