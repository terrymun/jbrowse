define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/Util',
           './CanvasFeatures'
       ],
       function(
           declare,
           lang,
           Util,
           CanvasFeatures
       ) {

return declare([ CanvasFeatures ], {
  _defaultConfig: function() {
      return Util.deepUpdate(
          lang.clone( this.inherited(arguments) ),
          {
              'displayMode': 'collapsed',
              'height':30
          });
      }
});
});
