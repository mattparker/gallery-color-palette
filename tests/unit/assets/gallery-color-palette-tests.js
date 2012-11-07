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

            }

        });

 
    suite.add(testBasic);

    Y.Test.Runner.add(suite);        

});