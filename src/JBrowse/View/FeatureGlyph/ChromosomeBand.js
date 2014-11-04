define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           './Box',
           'JBrowse/Util'
       ],
       function(
           declare,
           lang,
           BoxGlyph,
           Util
       ) {

return declare([ BoxGlyph ], {
    _defaultConfig: function() {
        return Util.deepUpdate(
          lang.clone( this.inherited(arguments) ),
            {
              'gneg'   :"#EEEEEE",
              'gpos100':"#000000",
              'gpos75' :"#666666",
              'gpos50' :"#B3B3B3",
              'gpos25' :"#E5E5E5",
              'gvar'   :"#EEEEEE",
              'stalk'  :"#CD3333",
              'style'  : {
                  'color': function(feature) { return this.config[feature.get('gieStain')]; },
              },
              'height': 30,
              'borderColor': 'black',
              'borderWidth': 1,
            });
    }
});
});
