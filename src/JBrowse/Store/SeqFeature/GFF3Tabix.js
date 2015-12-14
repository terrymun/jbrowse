define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'dojo/Deferred',
           'JBrowse/Store/SeqFeature',
           'JBrowse/Store/DeferredStatsMixin',
           'JBrowse/Store/DeferredFeaturesMixin',
           'JBrowse/Store/TabixIndexedFile',
           'JBrowse/Store/SeqFeature/GlobalStatsEstimationMixin',
           'JBrowse/Model/XHRBlob',
           'JBrowse/Store/SeqFeature/GFF3/Parser',
           'JBrowse/Util/GFF3',
           './GFF3Tabix/LazyFeature'
       ],
       function(
           declare,
           lang,
           array,
           Deferred,
           SeqFeatureStore,
           DeferredStatsMixin,
           DeferredFeaturesMixin,
           TabixIndexedFile,
           GlobalStatsEstimationMixin,
           XHRBlob,
           Parser,
           GFF3,
           LazyFeature
       ) {


return declare( [ SeqFeatureStore, DeferredStatsMixin, DeferredFeaturesMixin, GlobalStatsEstimationMixin ],
{

    constructor: function( args ) {
        var thisB = this;

        var tbiBlob = args.tbi ||
            new XHRBlob(
                this.resolveUrl(
                    this.getConf('tbiUrlTemplate',[]) || this.getConf('urlTemplate',[])+'.tbi'
                )
            );

        var fileBlob = args.file ||
            new XHRBlob(
                this.resolveUrl( this.getConf('urlTemplate',[]) )
            );

        this.indexedData = new TabixIndexedFile(
            {
                tbi: tbiBlob,
                file: fileBlob,
                browser: this.browser,
                chunkSizeLimit: args.chunkSizeLimit || 1000000
            });

        this.getHeader()
            .then( function( header ) {
                       thisB._deferred.features.resolve({success:true});
                       thisB._estimateGlobalStats()
                            .then(
                                function( stats ) {
                                    thisB.globalStats = stats;
                                    thisB._deferred.stats.resolve( stats );
                                },
                                lang.hitch( thisB, '_failAllDeferred' )
                            );
                   },
                   lang.hitch( thisB, '_failAllDeferred' )
                 );
    },

    /** fetch and parse the VCF header lines */
    getHeader: function() {
        var thisB = this;
        return this._parsedHeader || ( this._parsedHeader = function() {
            var d = new Deferred();
            var reject = lang.hitch( d, 'reject' );

            thisB.indexedData.indexLoaded.then( function() {
                console.log('getHeader2');
                var maxFetch = thisB.indexedData.index.firstDataLine
                    ? thisB.indexedData.index.firstDataLine.block + thisB.indexedData.data.blockSize - 1
                    : null;

                thisB.indexedData.data.read(
                    0,
                    maxFetch,
                    function( bytes ) {
                        d.resolve( thisB.header );
                    },
                    reject
                );
             },
             reject
            );

            return d;
        }.call(this));
    },

    _getFeatures: function( query, featureCallback, finishedCallback, errorCallback ) {
        var thisB = this;
        var features = [];
        var parser = new Parser(
            {
                featureCallback: function(fs) {
                    array.forEach( fs, function( feature ) {
                                       console.log(feature);
                                       //var regRefName = thisB.browser.regularizeReferenceName( feature.seq_id );
                                       //if( !( regRefName in seenRefs ))
                                       //    seenRefs[ regRefName ] = features.length;

                                       features.push( feature );
                                       featureCallback( feature );
                                   });
                },
                endCallback: function()  {
                    thisB._deferred.features.resolve( features );
                }
            });

        var featMap = {};
        var topLevelFeats = {};
        thisB.getHeader().then( function() {
            thisB.indexedData.getLines(
                query.ref || thisB.refSeq.name,
                query.start,
                query.end,
                function( line ) {
                    parser._buffer_feature( thisB.lineToFeature(line) );
                },
                function() {
                    parser.finish();
                    finishedCallback();
                },
                errorCallback
            );
        }, errorCallback );
    },

    /**
     * Given a line from a TabixIndexedFile, convert it into a feature
     * and return it.  Assumes that the header has already been parsed
     * and stored (i.e. _parseHeader has already been called.)
     */
    lineToFeature: function( line ) {
        var attributes = GFF3.parse_attributes( line.fields[8] );
        var ref =    line.fields[0];
        var source = line.fields[1];
        var type =   line.fields[2];
        var strand = line.fields[6];


        var id = attributes.ID?attributes.ID[0]:null;
        var parent = attributes.Parent?attributes.Parent[0]:null;
        var name = attributes.Name?attributes.Name[0]:null;

        var featureData = {
            id:     id,
            parent: parent,
            name:   name,
            start:  line.start,
            end:    line.start+ref.length,
            seq_id: line.ref,
            description: attributes.Description||attributes.Note||attributes.name,
            type:   type,
            source: source,
            strand: strand
        };

        var f = new LazyFeature({
            id:   id,
            parent: parent,
            attributes: attributes,
            data: featureData,
            fields: attributes,
            parser: this
        });

        return f;
    },

    /**
     * Interrogate whether a store has data for a given reference
     * sequence.  Calls the given callback with either true or false.
     *
     * Implemented as a binary interrogation because some stores are
     * smart enough to regularize reference sequence names, while
     * others are not.
     */
    hasRefSeq: function( seqName, callback, errorCallback ) {
        return this.indexedData.index.hasRefSeq( seqName, callback, errorCallback );
    },

    saveStore: function() {
        return {
            urlTemplate: this.config.file.url,
            tbiUrlTemplate: this.config.tbi.url
        };
    }


});
});
