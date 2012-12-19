$(document).ready(function() {
	
	$('.fancybox').fancybox({
		beforeLoad : function() {
			var human = $(this.element).attr('data');
			snake.build(human);
		}
	});

	var renderer = snake.init(500, 500);
	$('#3dviewer').hide();
	$('#3dviewer').append(renderer.domElement);
	
	$('canvas').on(TouchMouseEvent.DOWN, function(ev){
		ev.preventDefault();
			
		if(ev.originalEvent.which == 3) {
			var canvas = $('canvas').get(0);
			var dataUrl = canvas.toDataURL('image/png');
			window.open(dataUrl, "toDataURL() image", "width=500, height=500");
		} else {
			var lastX = ev.pageX;
			var lastY = ev.pageY;
			
			$('canvas').on(TouchMouseEvent.MOVE, function(ev) {
				var diffX = ev.pageX - lastX;
				var diffY = ev.pageY - lastY;
				
				snake.rotateCamera(-diffY * Math.PI/180, -diffX * Math.PI/180, 0);
				
				lastX = ev.pageX;
				lastY = ev.pageY;
			});
		}
		
		return false;
	});
	$(document).on(TouchMouseEvent.UP, function(){
		$('canvas').off(TouchMouseEvent.MOVE);
	});
});