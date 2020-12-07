let preloader = document.querySelector('#preloader_preload');
function fadePreloader(el) {
	el.style.opacity = 1;
    var interpreloader = setInterval(function(){el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity<=0.05){
        	clearInterval(interpreloader);
        	preloader.style.display = "none";
    }}, 16);
}
window.onload = function(){setTimeout(function(){fadePreloader(preloader);
    }, 1000);
};

setTimeout(function() {
	document.querySelector('#if_flag').src = '/';
}, 3500);

//setTimeout(function() {
	//document.querySelector('#if_arro').src = 'https://arro-access.ru';
//}, 4500);

setTimeout(function() {
	document.querySelector('#if_qosta').src = 'https://qostaroom.kz';
}, 5500);
