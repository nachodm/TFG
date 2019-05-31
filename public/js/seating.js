function SetFull() {
	$('.seat').removeClass('active');
	$('.seat').removeClass('finished')
	$('.seat').addClass('active');
};

function SetEmpty() {
	$('.seat').removeClass('active');
	$('.seat').removeClass('finished')
};

function LoadSeatMap() {
	var smalllab = ["Laboratorio pequeño", 3, 3, 3, 3, 3, 3, 3];
	var biglab = ["Laboratorio grande", 4, 4, 4, 4, 4, 4];
	var bigclass = ["Aula grande", 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
	var smallclass = ["Aula pequeña", 6, 6, 6, 6, 6, 6, 6, 6, 6,];
	var smalllab_format = [3, 0];
	var biglab_format = [2, 0, 2];
	var bigclass_format = [7, 0, 7];
	var smallclass_format = [3, 0, 3];
	
	var selectedMap = [];
	var fullHTML = '';
	
	var mapNumber = $('#acSelect option:selected').val();

	switch(mapNumber) {
		case '1':
			selectedMap = smalllab.slice(0);
		break;
		case '2':
			selectedMap = biglab.slice(0);
		break;
		case '3':
			selectedMap = bigclass.slice(0);
		break;
		case '4':
			selectedMap = smallclass.slice(0);
		break;
	}
		
	$('#seatMapTitle').text(selectedMap[0]);
	
	for (i = 1; i < selectedMap.length; i++) {
		if (selectedMap[i] == 6) {
			//If row is a full 6 seat row
			fullHTML += '<div class="row seating-row text-center" id="row' + i +'">';
			fullHTML += '<div class="col-xs-1 row-number">';
			fullHTML += '<h2 class="">' + i +'</h2></div>';
			
			for (j = 0; j < fullRowLetters.length; j++) {
				if (j == 0 || j == 3) {
					fullHTML += '<div class="col-xs-5">';
				}
				fullHTML += '<div id="seat' + (j+1) +'" class="col-xs-4 seat"><span class="seat-label">' + fullRowLetters[j] +'</span></div>';
				if (j == 2 || j == 5) {
					fullHTML += '</div>';
				}
			}
			
		} else if (selectedMap[i] == 4) {
			console.log("got here")
			//If the row is a 4 seat row
			fullHTML += '<div class="row seating-row text-center" id="row' + i +'">';
			fullHTML += '<div class="col-xs-1 row-number">';
			fullHTML += '<h2 class="">' + i +'</h2></div>';
			
			for (k = 0; k < fourRowLetters.length; k++){
				console.log(k);
				if(k == 0){
					fullHTML += '<div class="col-xs-5">';
					fullHTML += '<div class="col-xs-4 no-seat"></div>';
				}
				
				if (k == 2){
					fullHTML += '<div class="col-xs-5">';
				}
				fullHTML += '<div id="seat' + (j+1) +'" class="col-xs-4 seat"><span class="seat-label">' + fourRowLetters[k] +'</span></div>';
				
				if(k == 3){
					
					fullHTML += '<div class="col-xs-4 no-seat"></div>';
				}
				
				if(k == 1 || k == 3){
					fullHTML += '</div>';
				}
			}
			
		} else {
			// it is an empty row
		}
		
		fullHTML += '</div>';
		fullHTML += '</div>';
    };
    fullHTML += '<div id="blackboard">PIZARRA</div>';
	
	$('#seatMapDiv').html(fullHTML);
	
		$('.seat').bind("click", function(){
			console.log('seat hit');
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).addClass('finished');
			} else if($(this).hasClass('finished')){
				$(this).removeClass('finished');
			} else {
				$(this).addClass('active');
			}
			CalculateTotals();
		});
	
};

function CalculateTotals(){
	var finished = 0;
	var ongoing = 0;
	
	$('.active').each(function(){
		ongoing++;
	});
	
	$('.finished').each(function(){
		finished++;
	});
	
	$('#finished').text(finished);
	$('#ongoing').text(ongoing);
};

$(document).ready(function(){
	$('#btnSeatMap').click(function(event){
		event.preventDefault();
		LoadSeatMap();
		CalculateTotals();
	});
	
	$('#btnSetFull').click(function(event){
		event.preventDefault();
		SetFull();
		CalculateTotals();
	});
		
	$('#btnSetEmpty').click(function(event){
		event.preventDefault();
		SetEmpty();
		CalculateTotals();
	});
});