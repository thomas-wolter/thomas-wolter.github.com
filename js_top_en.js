var page=2;

home0=new Image();
home0.src="vhome0.gif";
home1=new Image();
home1.src="vhome1.gif";
home2=new Image();
home2.src="vhome2.gif";

rubiks0=new Image();
rubiks0.src="vrubiks0.gif";
rubiks1=new Image();
rubiks1.src="vrubiks1.gif";
rubiks2=new Image();
rubiks2.src="vrubiks2.gif";

musik0=new Image();
musik0.src="vmusik0_en.gif";
musik1=new Image();
musik1.src="vmusik1_en.gif";
musik2=new Image();
musik2.src="vmusik2_en.gif";

hobbys0=new Image();
hobbys0.src="vhobbys0.gif";
hobbys1=new Image();
hobbys1.src="vhobbys1.gif";
hobbys2=new Image();
hobbys2.src="vhobbys2.gif";

urlaub0=new Image();
urlaub0.src="vurlaub0_en.gif";
urlaub1=new Image();
urlaub1.src="vurlaub1_en.gif";
urlaub2=new Image();
urlaub2.src="vurlaub2_en.gif";

links0=new Image();
links0.src="vlinks0.gif";
links1=new Image();
links1.src="vlinks1.gif";
links2=new Image();
links2.src="vlinks2.gif";

kontakt0=new Image();
kontakt0.src="vkontakt0_en.gif";
kontakt1=new Image();
kontakt1.src="vkontakt1_en.gif";
kontakt2=new Image();
kontakt2.src="vkontakt2_en.gif";

function tauschen (i, bild)
{
	if (page!=i)
	{
	window.document.images[i].src=bild.src;
	}
}
function mclick (i, bild)
{
	if (page!=i)
	{
		switch (i)
		{
			case 2 :
				parent.Leftframe.location.href="le_home_en.htm";
				break;
			case 3 :
				parent.Leftframe.location.href="le_rubiks_en.htm";
				break;
			case 4 :
				parent.Leftframe.location.href="le_musik_en.htm";
				break;
			case 5 :
				parent.Leftframe.location.href="le_hobbys_en.htm";
				break;
			case 6 :
				parent.Leftframe.location.href="le_urlaub_en.htm";
				break;
			case 7 :
				parent.Leftframe.location.href="le_links_en.htm";
				break;	
			case 8 :
				parent.Leftframe.location.href="le_kontakt_en.htm";
				break;	
			default:
				//	
		}
		switch (page)
		{
			case 2 :
				window.document.images[page].src=home0.src;
				break;
			case 3 :
				window.document.images[page].src=rubiks0.src;
				break;
			case 4 :
				window.document.images[page].src=musik0.src;
				break;
			case 5 :
				window.document.images[page].src=hobbys0.src;
				break;
			case 6 :
				window.document.images[page].src=urlaub0.src;
				break;
			case 7 :
				window.document.images[page].src=links0.src;
				break;	
			case 8 :
				window.document.images[page].src=kontakt0.src;
				break;	
			default:
				//	
		}
	window.document.images[i].src=bild.src;
	page=i;
	}
}

function change_sprache_en ()
{
	parent.Topframe.location.href="jtop_de.htm";
	parent.Leftframe.location.href="le_home_de.htm";
}
