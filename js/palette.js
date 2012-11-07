/**
 @author Matt Parker
 @class Y.Color
 @module gallery-color-palette
 @version 0.1
 @module color
 @submodule color-palette
 @namespace Color
 */
"use strict";


var Col = Y.Color,
	/**
	 We need a way of looping through an array (we assume an ordered array)
	 so that we use every value from the array once and only once, in a 
	 deterministic manner, but so that we jump around the array, not 
	 just iterating through.

	 This function tries to find a number that's not a divisor of
	 num (for num > 4).  It's not very clever but works OK - we're not
	 expecting num to be very big (so not caching primes to work through,
	 for example).

	 This is a utility function used by the main palette generator below
	 as a way of deterministically trying to make sure you don't end up 
	 with similar colours next to each other.

	 @private
	 @param {Number} num     Size of the array we'll be iterating later
	 @return {Number}        
	*/
    findStep = function (num) {

	    var s = 3, d;
	    if (num < 4) {
	        return 1;
	    }

	    while (s < num) {
	        d = num/s;
	        if (d !== Math.floor(d)) {
	            return s;
	        }
	        s += 2;
	    }
	    return 1;
	};


	/**
	Generates a palette of colors that are reasonably different from one
	another, for example to color in pie-charts with lots of slices.

	@method generatePalette
	@static
	@public
	@param {String} [color]    Start color for the pallette. Default #FF0000
	@param {Number} [count]    Size of palette to generate (default 10)
	@param {Object} [options]  Controls range of hues, saturation and luminance
	                             that are used when generating palette.
		@param {Number} [options.hMin]      Minimum hue to range from (0 - 360), default 0
		@param {Number} [options.hMax]		Maximum hue to range to (0 - 360), default 360
		@param {Number} [options.hStep]		Step (1 - 360), default 36 ((hMax - hMin) / count))
		@param {Number} [options.sMin]		Minimum saturation to range from, default 20
		@param {Number} [options.sMax]		Max saturaton to range to, default 100
		@param {Number}	[options.sStep]		Saturation to step by, default 11
		@param {Number} [options.lMin]		Min luminance to range from , default 20
		@param {Number}	[options.lMax]		Max luminance to range to, default 80
		@param {Number}	[options.lStep]		Luminance to step by, default 19

	@return Array 				Of colors
	*/
 	Col.generatePalette = function (color, count, options) {

	    var options = options || {},
	    	color = color || "#FF0000",
	    	count = count || 10,
	    	// hue:
	        hMin = options.hMin || 0,
	        hMax = options.hMax || 360,
	        hStep = options.hStep || (hMax - hMin)/(count == 0 ? 1 : count),
	        // saturation:
	        sMin = options.sMin || 20, // 0 gives too many greys
	        sMax = options.sMax || 100,
	        sStep = options.sStep || 11,
	        // luminance
	        lMin = options.lMin || 20, // 0 gives repeated black
	        lMax = options.lMax || 80, // 100 gives repeated white
	        lStep = options.lStep || 19,
	        // startup
	        startColor = Col.toArray(Col.toHsl(color)),
	        h = startColor[0],
	        s = startColor[1],
	        l = startColor[2],
	        colors = [],
	        sVals = [],
	        sValsStep,
	        lVals = [],
	        lValsStep, 
	        j = 0;

	    // steps for saturation
	    for (j = sMin; j < sMax; j = j + sStep) {
	        sVals.push(j);
	    }
	    sValsStep = findStep(sVals.length);

	    // steps for luminance
	    for (j = lMin; j < lMax; j = j + lStep) {
	        lVals.push(j);
	    }
	    lValsStep = findStep(lVals.length);

	    j = 0;

	    // generate colors
	    while (colors.length < count) {
	        
	        colors.push(Col.fromArray([h,s,l], Col.STR_HSL));
	             
	        j++;   
	        h += hStep;
	        s = sVals[(j*sValsStep)%sVals.length];
	        l = lVals[(j*lValsStep)%lVals.length];

	        h = h % 360;
	        if (h > hMax) {
	            h = hMin + (h - hMax);
	        }


	    }

	    return colors;

	};



	/**
	 Mixes up an array of colors (or anything else) predictably.  
	 Takes every (p modulo l)-th item from the array, l = colors.length 
	 and p is (if possible) not a divisor of l.

	@method mixupColors
	@static
	@public
	@param {Array} colors    Array of colors
	@return {Array} 
	*/
	Col.mixupColors = function (colors) {
	
	    var step = findStep(colors.length),
	    	i = 0,
	    	ret = [];

        for (; ret.length < colors.length; i = i + step) {
            ret.push(colors[i%colors.length]);
        }
        return ret;
    };





};