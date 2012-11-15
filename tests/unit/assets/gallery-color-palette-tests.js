YUI.add('gallery-color-palette-tests', function(Y) {

    var Assert = Y.Assert,
    	Equal = Assert.areEqual,
    	suite = new Y.Test.Suite("ColorPalette");
        testBasic = new Y.Test.Case({
            name: "Color Palette Tests",

            "test basic palette generation": function () {
            	var pal = Y.Color.Palette.generate();
            	Equal(10, pal.length, 'Default generates 10 colors');
            	Equal("hsl(0, 100%, 50%)", pal[0], 'First is red');

            },

            "test creation of bigger palette from blue": function () {
            	var pal = Y.Color.Palette.generate("#0000FF", 20);
            	Equal(20, pal.length, 'generates 20 colors');
            	Equal("hsl(240, 100%, 50%)", pal[0], 'First is blue');            
            },

            "test actual colors returned": function () {
            	var pal = Y.Color.Palette.generate("#0000FF", 5);
            	Equal(5, pal.length, 'generates 5 colors');
            	Equal("hsl(240, 100%, 50%)", pal[0], 'First is blue');
            	Equal("hsl(312, 53%, 77%)", pal[1], 'Second is pink');
            	Equal("hsl(24, 86%, 58%)", pal[2], 'Third is orange');
            	Equal("hsl(96, 31%, 39%)", pal[3], 'Fourth is  green');
            	Equal("hsl(168, 64%, 20%)", pal[4], 'Fifth is dk green');
            },

            "test limit hue options": function () {
            	var pal = Y.Color.Palette.generate("hsl(240,100%,50%)", 5, {hMin:240, hMax: 360, hStep: 10});
             	Equal(5, pal.length, 'generates 5 colors');
            	Equal("hsl(240, 100%, 50%)", pal[0], 'First is blue');
            	Equal("hsl(250, 53%, 77%)", pal[1], 'Second is blue');
            	Equal("hsl(260, 86%, 58%)", pal[2], 'Third is blue');
            	Equal("hsl(270, 31%, 39%)", pal[3], 'Fourth is blue');
            	Equal("hsl(280, 64%, 20%)", pal[4], 'Fifth is blue');           	
            }

        });

 
    suite.add(testBasic);

    Y.Test.Runner.add(suite);        

});