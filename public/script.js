function lightbox(filepath) {
	var lightboxEl = document.createElement('div');
	lightboxEl.id = 'lightbox';
	lightboxEl.innerHTML = '<div><img src="'+ filepath + '" alt=""></div><a href="javascript:void(0)"></a>'
	lightboxEl.getElementsByTagName("A")[0].onclick = function() {
		document.body.removeChild(document.getElementById('lightbox'));
	};
	document.body.appendChild(lightboxEl);
}



var easeInQuad = function (x, b, c)
{
	var y;
	y = x * x;
	return (c - b) * y + b;
};

var easeOutQuad = function (x, b, c)
{
	var y;
	y = - x * x + 2 * x;
	return (c - b) * y + b;
};

var easeInOutQuad = function (x, b, c)
{
	var y;
	if (x < 0.5)
	{
		y = 2 * x * x;
	}
	else
	{
		y = -2 * x * x + 4 * x - 1;
	}
	return (c - b) * y + b;
};


if (!Date.now)
{
	Date.now = function()
	{
		return +(new Date);
	};
}

(function()
{
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
	{
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'RequestCancelAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
	{
		window.requestAnimationFrame = function(callback, element)
		{
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(timeToCall); },timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame)
	{
		window.cancelAnimationFrame = function(id)
		{
			clearTimeout(id);
		};
	}
}());

function Tween(startValue, endValue, duration, type)
{
	this.startValue = startValue;
	this.endValue = endValue;
	this.duration = duration;
	this.type=type;
	this.state = 0;
	this.value = startValue;
	this.startTime = null;
	this.endTime = null;
	this.onFrame = null;
	this.onComplete = null;
	this._runFrame = this._runFrame.bind(this);
}

Tween.prototype.start = function()
{
	this.value=this.startValue;
	this.state = 0;
	this.startTime = Date.now();
	this.endTime = this.startTime + this.duration;
	requestAnimationFrame(this._runFrame);
};

Tween.prototype.calculateState = function()
{
	var now = Date.now();
	this.state = 1 - ((this.endTime - now) / this.duration);
	if (this.state > 1)
	{
		this.state = 1;
	}
};

Tween.prototype.calculateValue = function()
{
	switch(this.type)
	{
		case 'ease-in':
			this.value = easeInQuad(this.state, this.startValue, this.endValue);
			break;
		case 'ease-out':
			this.value = easeOutQuad(this.state, this.startValue, this.endValue);
			break;
		case 'ease-in-out':
			this.value = easeInOutQuad(this.state, this.startValue, this.endValue);
			break;
	}
};

Tween.prototype._runFrame = function()
{
	this.calculateState();
	this.calculateValue();
	if (this.state === 1)
	{
		if (typeof this.onComplete === 'function')
		{
			this.onComplete();
		}
	}
	else
	{
		requestAnimationFrame(this._runFrame);
	}
	if (typeof this.onFrame === 'function')
	{
		this.onFrame(this.value);
	}
};


function smoothScroll(id)
{
	var target = document.getElementById(id);
	var endOffset = target.offsetTop;
	var beginOffset = window.pageYOffset;
	
	var tween = new Tween(beginOffset, endOffset, 500, 'ease-in-out');
	tween.onFrame = function(value)
	{
		window.scroll(0, value);
	};
	tween.start();
}
