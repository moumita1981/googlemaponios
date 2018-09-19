/// <reference path="../custom-ol3.d.ts" />
/// <reference types="googlemaps" /> 
import { Component, OnInit, OnChanges, Input, ElementRef, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import * as ol from 'openlayers';


//import { MapUtil } from '../mapUtil';

import {
     SizeParam
} from '.';
import { MapType } from '@angular/compiler/src/output/output_ast';



declare var window;
@Component({
    selector: 'map',
    templateUrl: './map.template.html',
    styleUrls: [
        './map.style.scss'
    ],
})
export class MapComponent implements OnInit, OnChanges,AfterViewInit {
    private static MAX_ZOOM: number = 17;
    private static MIN_ZOOM: number = 2;
    // Base map model object input
  
    @Input() public sizeParam: SizeParam;
     
    // Center input
    @Input() public center: [number, number];

    @ViewChild('gmap') gmapElement: any;
   
    private dataLayer: ol.layer.Vector;

    private map: ol.Map;
    private gmap: google.maps.Map;
    $el:any;
    constructor(private elementRef: ElementRef,
        private _zone: NgZone) {
       
            this.$el = elementRef.nativeElement;

    }
    ngOnInit() {
        
        // Initialize the layers of Map
        this.dataLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            })
        });

        this._draw();
    }

    ngAfterViewInit()
    {
       
    }

    ngOnChanges() {

    }
    /**
      * 
      * 
      * @private
      * 
      * @memberOf MapComponent
      */
    private _draw() {
        // draw the map
        let gmapDiv = this.gmapElement.nativeElement;       
        let centerTx = ol.proj.transform(this.center, 'EPSG:3857', 'EPSG:4326');
        console.log("Map Center : ",centerTx);
        var mapProp = {
            center: new google.maps.LatLng(centerTx[1], centerTx[0]),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.SATELLITE
          };
          console.log("Map Properties : ",mapProp);
        this.gmap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        google.maps.event.addListenerOnce(this.gmap,'tilesloaded',() =>{
            // Refresh the map
            this._resizeMap();
        });

    }

  
  

    /**
     * Below method will resize the map
     * 
     * @private
     * 
     * @memberOf MapComponent
     */
    private _resizeMap(mapSize?: [number, number]) {
      
        setTimeout(() => {
            google.maps.event.trigger(this.gmap, 'resize');
            setTimeout(() => {
                this.gmap.setCenter(this.gmap.getCenter());
            });
        });
       
    }

 
    public setStyles() {

        let style = {
            // CSS property names
            'width': this.sizeParam.width,
            'height': this.sizeParam.height
        };
        return style;
    }


}