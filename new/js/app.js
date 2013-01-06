$(document).ready(function() {
	
	$('.fancybox').fancybox({
		beforeLoad : function() {
			var human = $(this.element).attr('data');
			snake.build(human);
		},
		enableKeyboardNav : false
	});

	var renderer = snake.init(500, 500);
	$('#3dviewer').hide();
	$('#3dviewer').append(renderer.domElement);
	
	$(document).keydown(function(ev) {
		if(!$('#3dviewer').is(':visible')) {
			return;
		}

		switch(ev.which) {
			case 'W'.charCodeAt():
				snake.rotateCamera(Math.PI/180,0,0);
				break;
			case 'A'.charCodeAt():
				snake.rotateCamera(0,Math.PI/180,0);
				break;
			case 'S'.charCodeAt():
				snake.rotateCamera(-Math.PI/180,0,0);
				break;
			case 'D'.charCodeAt():
				snake.rotateCamera(0,-Math.PI/180,0);
				break;
			case 'Q'.charCodeAt():
				snake.rotateCamera(0,0,-Math.PI/180);
				break;
			case 'E'.charCodeAt():
				snake.rotateCamera(0,0,Math.PI/180);
				break;
		}
	});

	$('canvas').on(TouchMouseEvent.DOWN, function(ev){
		ev.preventDefault();
			
		var lastX = ev.pageX;
		var lastY = ev.pageY;
		
		$('canvas').on(TouchMouseEvent.MOVE, function(ev) {
			var diffX = ev.pageX - lastX;
			var diffY = ev.pageY - lastY;
			
			snake.arcball(diffX, diffY);
			
			lastX = ev.pageX;
			lastY = ev.pageY;
		});
		
		return false;
	});
	$(document).on(TouchMouseEvent.UP, function(){
		$('canvas').off(TouchMouseEvent.MOVE);
	});
});