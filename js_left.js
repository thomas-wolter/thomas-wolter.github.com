var Link=1;
var farbe0='000000', farbe1='00FF00', farbe2='FFFFFF';

function tauschen (i, farbe)
{
	if (Link!=i)
	{
		switch (i)
		{
			case 1 :
				L1.style.color=farbe;
				break;
			case 2 :
				L2.style.color=farbe;
				break;
			case 3 :
				L3.style.color=farbe;
				break;
			case 4 :
				L4.style.color=farbe;
				break;
			case 5 :
				L5.style.color=farbe;
				break;
			case 6 :
				L6.style.color=farbe;
				break;				
			case 7 :
				L7.style.color=farbe;
				break;				
			default:
				//	
		}
	}
}

function mclick (i, farbe)
{
	if (Link!=i)
	{
		switch (i)
		{
			case 1 :
				L1.style.color=farbe2;
				break;
			case 2 :
				L2.style.color=farbe2;
				break;
			case 3 :
				L3.style.color=farbe2;
				break;
			case 4 :
				L4.style.color=farbe2;
				break;
			case 5 :
				L5.style.color=farbe2;
				break;
			case 6 :
				L6.style.color=farbe2;
				break;
			case 7 :
				L7.style.color=farbe2;
				break;
			default:
				//	
		}
		switch (Link)
		{
			case 1 :
				L1.style.color=farbe0;
				break;
			case 2 :
				L2.style.color=farbe0;
				break;
			case 3 :
				L3.style.color=farbe0;
				break;
			case 4 :
				L4.style.color=farbe0;
				break;
			case 5 :
				L5.style.color=farbe0;
				break;
			case 6 :
				L6.style.color=farbe0;
				break;
			case 7 :
				L7.style.color=farbe0;
				break;
			default:
				//	
		}
	Link=i;
	}
}
