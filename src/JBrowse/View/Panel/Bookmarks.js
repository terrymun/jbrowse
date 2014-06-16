define(['dojo/_base/declare',
        'dojo/_base/array',
        'dojo/_base/lang',
        'dojo/dom-construct',
        'dojo/query',
        'dojo/on',
        'dojo/json',

        'dijit/TitlePane',
        'dijit/layout/ContentPane',

        'JBrowse/Util',
        'JBrowse/View/TrackList/_TextFilterMixin'
       ],
       function(
           declare,
           array,
           lang,
           dom,
           query,
           on,
           JSON,

           TitlePane,
           ContentPane,

           Util,
           _TextFilterMixin
       ) {

return declare(
    'JBrowse.View.Panel.BookmarkPanel',
    [ ContentPane, _TextFilterMixin ],
    {

    region: 'left',
    splitter: true,
    style: 'width: 25%',

    id: 'bookmarkPanel',
    baseClass: 'jbrowseBookmarkPanel',


    constructor: function( args ) {

        //this._loadState();
    },
    postCreate: function() {
        this.placeAt( this.browser.container );

    },

    buildRendering: function() {
        this.inherited(arguments);

        var topPane = new ContentPane({ className: 'header' });
        this.addChild( topPane );
        dom.create(
            'h2',
            { className: 'title',
              innerHTML: 'Bookmarked Locations'
            },
            topPane.containerNode );

        this._makeTextFilterNodes(
            dom.create('div',
                       { className: 'textfilterContainer' },
                       topPane.containerNode )
        );  
        this._updateTextFilterControl();

        this.bookmarkList =
          { pane: new ContentPane({ className: 'bookmarks' }).placeAt( this.containerNode ),
          };  
    },

    startup: function() {
        this.inherited( arguments );

        var tracks = [];
        var thisB = this;
    },

/*
    _loadState: function() {
        this.state = {};
        try {
            this.state = JSON.parse( localStorage.getItem( 'JBrowse-Hierarchical-Track-Selector' ) || '{}' );
        } catch(e) {}
        return this.state;
    },
    _saveState: function( state ) {
        try {
            localStorage.setItem( 'JBrowse-Hierarchical-Track-Selector', JSON.stringify( this.state ) );
        } catch(e) {}
    },
*/



    /**
     * Make the track selector visible.
     * This does nothing for this track selector, since it is always visible.
     */
    show: function() {
    },

    /**
     * Make the track selector invisible.
     * This does nothing for this track selector, since it is always visible.
     */
    hide: function() {
    },

    /**
     * Toggle visibility of this track selector.
     * This does nothing for this track selector, since it is always visible.
     */
    toggle: function() {
    }

});
});
