define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/store/util/QueryResults',
            'JBrowse/Store/Names/Hash',
            'JBrowse/Store/Names/REST',
        ],
        function(
            declare,
            array,
            QueryResults,
            HashStore,
            RESTStore
        ) {

return declare(null,
{

    constructor: function( args ) {
        this.nameStore=new HashStore(args);
        this.restStore=new RESTStore(args);
        console.log("Combined Store");
    },
    query: function( q,options ) {
        console.log("Querying combined store");
        var ret1=this.nameStore.query( q, options );
        var thisB=this;
        return ret1.then(function(results) {
            if(results.total==0) {
                return thisB.restStore.query( q, options );
            }
            return ret1;
        });
    },
    get: function( id ) {
        console.log("get");
    }

});
});
