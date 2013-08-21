define([
           'dojo/_base/declare',
           'dojo/_base/array',
           'JBrowse/View/FeatureGlyph/Alignment',
           'JBrowse/View/GranularRectLayout'
       ],
       function(
           declare,
           array,
           AlignmentGlyph,
           Layout
       ) {

return declare( [AlignmentGlyph], {

    _getTemplateRectangle: function( viewInfo, feature ) {
        var block = viewInfo.block;
        var start;
        var end;
        var id;
        if( feature.get('multi_segment_template') && !feature.get('multi_segment_next_segment_unmapped') ) {
            id = feature.get('name');
            if( feature.get('template_length') > 0) {
                start = feature.get('start');
                end = feature.get('start') + feature.get('template_length');
            } else if( feature.get('template_length') < 0) {
                start = feature.get('end') + feature.get('template_length');
                end = feature.get('end');
            }
        } else {
            id = feature.id();
            start = feature.get('start');
            end = feature.get('end');
        }

        var tRect = {
            id: id,
            l: block.bpToX( start ),
            h: this._getFeatureHeight( viewInfo, feature ),
            viewInfo: viewInfo,
            glyph: this
        };

        tRect.w = block.bpToX( end ) - tRect.l;

        // save the original rect in `rect` as the dimensions
        // we'll use for the rectangle itself
        tRect.rect = { l: tRect.l, h: tRect.h, w: Math.max( tRect.w, 2 ), t: 0 };
        tRect.w = tRect.rect.w; // in case it was increased
        if( viewInfo.displayMode != 'compact' )
            tRect.h += this.getStyle( feature, 'marginBottom' ) || 0;
        // if we are showing strand arrowheads, expand the tRect a little
        if( this.getStyle( feature, 'strandArrow') ) {
            var strand = tRect.strandArrow = feature.get('strand');

            if( strand == -1 ) {
                var i = this._embeddedImages.minusArrow;
                tRect.w += i.width;
                tRect.l -= i.width;
            }
            else {
                var i = this._embeddedImages.plusArrow;
                tRect.w += i.width;
            }
        }

        // no labels or descriptions if displayMode is collapsed, so stop here
        if( viewInfo.displayMode == "collapsed")
            return tRect;

        this._expandRectangleWithLabels( viewInfo, feature, tRect );
        this._addMasksToRect( viewInfo, feature, tRect );

        return tRect;

    },

    renderFeature: function( context, fRect ) {
        if( this.track.displayMode != 'collapsed' )
            context.clearRect( Math.floor(fRect.l), fRect.t, Math.ceil(fRect.w-Math.floor(fRect.l)+fRect.l), fRect.h );
        //this.renderConnector( context, fRect );
        this.inherited( arguments );
    },

    renderConnector: function( context, fRect ) {
        // connector
        var tRect = fRect.tRect;

        var connectorColor = 'rgb(0, 255, 0)';
        if( connectorColor ) {
            context.fillStyle = connectorColor;
            var connectorThickness = 1;
            context.fillRect(
                tRect.rect.l, // left
                Math.round(tRect.rect.t+(tRect.rect.h-connectorThickness)/2), // top
                tRect.rect.w, // width
                connectorThickness
            );
        }
    },

    layoutFeature: function( viewArgs, layout, feature ) {
        var tRect = this._getTemplateRectangle( viewArgs, feature );
        var fRect = this._getFeatureRectangle( viewArgs, feature );

        if( !this.templateLayout ) {
            this.templateLayout = new Layout( layout );
        }

        var scale = viewArgs.scale;
        var leftBase = viewArgs.leftBase;
        var startbp = tRect.l/scale + leftBase;
        var endbp   = (tRect.l+tRect.w)/scale + leftBase;

        // Add the template to a dummy layout, to determine where the features will need to be placed.
        fRect.t = tRect.t = tRect.rect.t = this.templateLayout.addRect(
            tRect.id,
            startbp,
            endbp,
            tRect.h,
            feature
        );

        if( fRect.t === null )
            return null;

        fRect.f = feature;
        fRect.tRect = tRect;

        var startbp = fRect.l/scale + leftBase;
        var endbp   = (fRect.l+fRect.w)/scale + leftBase;

        // Add the real feature rectangles to the actual layout, forcing them into the positions that were just selected for them
        layout.addRect(
            feature.id(),
            startbp,
            endbp,
            fRect.h,
            feature,
            fRect.t
        );

        fRect.rect.t = fRect.t;
        
        return fRect;
    },

});
});