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
	
	$('canvas').on('touchstart mousedown', function(ev){
			
		switch(ev.which) {
			case 1:
				var lastX = ev.pageX;
				var lastY = ev.pageY;
			
				$('canvas').on('touchmove mousemove', function(ev) {
					var diffX = ev.pageX - lastX;
					var diffY = ev.pageY - lastY;
				
					snake.rotateCamera(-diffY * Math.PI/180, -diffX * Math.PI/180, 0);
				
					lastX = ev.pageX;
					lastY = ev.pageY;
				
				});
				break;
			case 3:
				ev.preventDefault();
				var canvas = $('canvas').get(0);
				var dataUrl = canvas.toDataURL('image/png');
				window.open(dataUrl, "toDataURL() image", "width=500, height=500");
				ev.preventDefault();
				break;
			default:
		}
	});
	$(document).on('touchend mouseup', function(){
		$('canvas').off('touchmove mousemove');
	});
});