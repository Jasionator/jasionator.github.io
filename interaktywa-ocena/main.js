var rate = [0, 0, 0, 0, 0];

var rateButtons = document.getElementsByClassName("emocja");
var rateCounts = document.getElementsByClassName("ocena-liczba");

for(let i=0; i<5; i++){
	rateButtons[i].addEventListener('click', async function(){
		rateCounts[i].textContent = ++rate[i];
	});
}

//confirm page reload
window.onbeforeunload = function(event){
    return confirm("Czy napewno chcesz odświeżyć stronę? Możesz utracić super dane z ankiety");
};

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

var elem = document.getElementById("app");
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}