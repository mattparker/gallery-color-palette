//YUI.add('gallery-color-palette', function (Y) {
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
    Palette = {},
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
            d = num / s;
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
    @param {Number} [options.hMax]      Maximum hue to range to (0 - 360), default 360
    @param {Number} [options.hStep]     Step (1 - 360), default 36 ((hMax - hMin) / count))
    @param {Number} [options.sMin]      Minimum saturation to range from, default 20
    @param {Number} [options.sMax]      Max saturaton to range to, default 100
    @param {Number} [options.sStep]     Saturation to step by, default 11
    @param {Number} [options.lMin]      Min luminance to range from , default 20
    @param {Number} [options.lMax]      Max luminance to range to, default 80
    @param {Number} [options.lStep]     Luminance to step by, default 19

@return Array               Of colors
*/
Palette.generate = function (color, count, options) {

    var opts = options || {},
        baseCol = color || "#FF0000",
        num = count || 10,
        // hue:
        hMin = opts.hMin || 0,
        hMax = opts.hMax || 360,
        hStep = opts.hStep || (hMax - hMin) / (num === 0 ? 1 : num),
        // saturation:
        sMin = opts.sMin || 20, // 0 gives too many greys
        sMax = opts.sMax || 100,
        sStep = opts.sStep || 11,
        // luminance
        lMin = opts.lMin || 20, // 0 gives repeated black
        lMax = opts.lMax || 80, // 100 gives repeated white
        lStep = opts.lStep || 19,
        // startup
        startColor = Col.toArray(Col.toHSL(baseCol)),
        h = parseInt(startColor[0], 10),
        s = parseInt(startColor[1], 10),
        l = parseInt(startColor[2], 10),
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
    while (colors.length < num) {

        colors.push(Col.fromArray([h, s, l], "HSL"));

        j = j + 1;
        h += hStep;
        s = sVals[(j * sValsStep) % sVals.length];
        l = lVals[(j * lValsStep) % lVals.length];


        if (h > hMax) {
            h = hMin + (h - hMax);
        }
        h = h % 360;


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
Palette.mixupColors = function (colors) {

    var step = findStep(colors.length),
        i,
        ret = [];

    for (i = 0; ret.length < colors.length; i = i + step) {
        ret.push(colors[i % colors.length]);
    }
    return ret;
};

Y.namespace("Color").Palette = Palette;


//}, "0.1", ['color']);