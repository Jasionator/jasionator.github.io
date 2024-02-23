var rate = [0, 0, 0, 0, 0];

for(let i=0; i<5; i++){
	document.getElementById("ocena"+(i+1)).addEventListener('click', function(){
		rate[i]++;
		this.textContent = rate[i];
		console.log(rate[i]);
	});
}

//old
/*var ocena1 = document.getElementById("ocena1")
	.addEventListener('click', ()=>{
		rate[0]++;
	});
var ocena2 = document.getElementById("ocena2")
	.addEventListener('click', ()=>{
		rate[1]++;
	});
var ocena3 = document.getElementById("ocena3")
	.addEventListener('click', ()=>{
		rate[2]++;
	});
var ocena4 = document.getElementById("ocena4")
	.addEventListener('click', ()=>{
		rate[3]++;
	});
var ocena5 = document.getElementById("ocena5")
	.addEventListener('click', ()=>{
		rate[4]++;
	});
*/
