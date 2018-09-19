/// <reference path="../custom-ol3.d.ts" />
/// <reference types="googlemaps" /> 
import * as ol from 'openlayers';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Hero } from '../hero';
import { FarmService } from '../farm.service';
import { MapType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.css']
})
export class FarmsComponent implements OnInit, AfterContentInit {
  fields: any[] = [];
  farm: any = {};

  constructor(private farmService: FarmService) { }

  ngOnInit() {

  }

  ngAfterContentInit() {
    this.getFarm();
    this.getFields();
    let centerLatLng: google.maps.LatLng = this.getGeographyLatLng(this.farm.geography, false);
    let centerPoint = this.transformCoordinates(centerLatLng);
   
    this.farm.center = centerPoint;
    this.farm.pinParam = {
      pinLatLng: centerLatLng,
      pinAssetName: 'farm-pin',
      pinDrag: true
    };
    this.farm.sizeParam =
      {
        width: '100%',
        height: '605px'
      }
    this.farm.shapeParam = [];
  }

  getFields(): void {
    this.fields = this.farmService.getFields();
    this.fields.forEach((f) => {
      let centerLatLng: google.maps.LatLng = this.getGeographyLatLng(f.geography, false);
      f["center"] = this.transformCoordinates(centerLatLng);
      f["sizeParam"] = {
        width: '100%',
        height: '275px'
      };
    });
    console.log("Farms : ", this.fields);
  }
  getFarm(): void {
    this.farm = this.farmService.getFarm();

  }

  private getGeographyLatLng(geography: string, mapFlag: boolean, landingPageFarm?: boolean) {
    let format = new ol.format.WKT();
    let feature = format.readFeature(geography);
    if (mapFlag) {
      feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    }
    let pointGeom;
    if (feature.getGeometry().getType() === 'Point') {
      pointGeom = feature.getGeometry() as ol.geom.Point;
    } else if (feature.getGeometry().getType() === 'MultiPolygon') {
      let geo = feature.getGeometry() as ol.geom.MultiPolygon;
      pointGeom = geo.getInteriorPoints();
    } else {
      let geo = feature.getGeometry() as ol.geom.Polygon;
      pointGeom = geo.getInteriorPoint();
    }
    let centerPoint;
    if (feature.getGeometry().getType() === 'MultiPolygon') {
      centerPoint = pointGeom.getCoordinates()[0];
    } else {
      centerPoint = pointGeom.getCoordinates();
    }
    if (landingPageFarm) {
      return centerPoint;

    } else {
      let polyCord: google.maps.LatLng = new google.maps.LatLng(centerPoint[1], centerPoint[0]);
      return polyCord;
    }
  }

  private transformCoordinates(geoCoordinates: google.maps.LatLng): [number, number] {
    let addressPt = new ol.geom.Point([geoCoordinates.lng(), geoCoordinates.lat()]); // Dont change the position of coordinates.
    addressPt.transform('EPSG:4326', 'EPSG:3857');
    return addressPt.getCoordinates();
  }
}
