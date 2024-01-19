<script>
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { useGeographic } from "ol/proj.js";
import {
  Circle as CircleStyle,
  RegularShape,
  Fill,
  Stroke,
  Style,
} from "ol/style.js";


useGeographic();

const polyStyle = new Style({
  stroke: new Stroke({
    color: "#105400aa",
    width: 6,
  }),
  fill: new Fill({
    color: "#1b8a00aa",
  }),
  image: new RegularShape({
    points: 4,
    radius: 10,
    radius2: 0,
    angle: Math.PI / 4,
    stroke: new Stroke({
      color: "#105400aa",
      width: 6,
    }),
    fill: new Fill({
      color: "#1b8a00aa",
    }),
  }),
});


const geoserverAddr = "http://172.232.173.160:8080";

const OSMLayer = new TileLayer({
  source: new OSM(),
  opacity: 0.5,
});

var vectorSource = new VectorSource({
  url:
    geoserverAddr +
    "/geoserver/rentsoundly/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rentsoundly%3Arentplotagg&maxFeatures=50&outputFormat=application%2Fjson&viewparams=n:0",
  format: new GeoJSON(),
});


var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: polyStyle,
});

const place = [-122.38692809, 47.57111962];
const mview = new View({
  center: place,
  zoom: 10,
});

const map = new Map({
  target: "map",
  layers: [OSMLayer, vectorLayer],
  view: mview,
});


const hostname = "http://rentsoundly.net";
const addressSuggUrl = hostname + "/users/";
const PropByIdUrl = hostname + "/prop/";
const propIssueUrl = hostname + "/issues/";
const PropByLandlordUrl = hostname + "/landlordprops/";

const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
const searchForm = document.querySelector(".search-form");

const suggestions = document.querySelector(".autocomplete-sugg");

async function selectedSugg(id) {
  var sugs = document.querySelector(".autocomplete-sugg");
  sugs.innerHTML = "";
  const response = await fetch(PropByIdUrl + id);
  const rjson = await response.json();
  const prop = rjson[0];
  updatePropInfo(prop);
  var landlordid = prop["landlordid"];
  findRelatedProp(landlordid);
  getPropsGeom(id, landlordid);
  getPropIssues(id);
}


function searchSubmit() {
  event.preventDefault();
  if (selAutoSuggIndex == -1) {
    selectedSugg(suggestions.firstChild.getAttribute("data-propid"));
  } else {
    const prevsel = document.querySelector(".autocomplete-item-sel");
    selectedSugg(prevsel.getAttribute("data-propid"));
  }
}


export default {
  name:"AppMain"
}
</script>

<template>
  <div class="container">

    <div class="left-pane">
    <div class="property-info">
    <form class="search-form">
      <div class="search-bar">
        <div class="search-box">
          <input type="text" placeholder="Search an Address" class="search-input">
        </div>
            <div class="autocomplete-sugg">
          </div>
      </div>
    <input type="image" class="search-icon" id="search-icon-submit" src="searchicon.png">
    </form>
      <div class="property-info-box">
        <h2 class="property-info-header">Property Information</h2>
        <table class="property-info-table">
          <tr>
            <td class="datatable-label">Address: </td>
            <td class="datatable-entry" id="data-addr"></td>
          </tr>
          <tr>
            <td class="datatable-label">City: </td>
            <td class="datatable-entry" id="data-city"></td>
          </tr>
          <tr>
            <td class="datatable-label">State: </td>
            <td class="datatable-entry" id="data-state"></td>
          </tr>
          <tr>
            <td class="datatable-label">Zipcode: </td>
            <td class="datatable-entry" id="data-zip"></td>
          </tr>
          <tr>
            <td class="datatable-label">Property Name: </td>
            <td class="datatable-entry" id="data-name"></td>
          </tr>
          <tr>
            <td class="datatable-label">Housing Units: </td>
            <td class="datatable-entry" id="data-units"></td>
          </tr>
          <tr>
            <td class="datatable-label">Property Manager: </td>
            <td class="datatable-entry" id="data-contact"></td>
          </tr>
          <tr>
            <td class="datatable-label">Code Issues: </td>
            <td class="datatable-entry" id="data-code-cnt"></td>
          </tr>
    </table>
    </div>
    </div>
    </div>
  <div class="right-pane">
    <div id="map"></div>
    <div class="related-prop">
    <h2 class="related-prop">Related Properties</h2>
    <select class="related-prop-list" id="related-prop-select" size="6">
    </select>
    </div>
    </div>
    </div>
    <div class="container">
  <div class="bottom-panel">
  <div class="code-issues">
    <h2 class="code-issues-title">Code Issues</h2>
    <div class="code-table">
      <table class="code-table" id="code-issues-table">
        <thead>
        <tr class="code-table-heading">
          <td class="code-table-heading" id="code-heading-date">Date</td>
          <td class="code-table-heading" id="code-heading-type">Type</td>
          <td class="code-table-heading" id="code-heading-cat">Category</td>
          <td class="code-table-heading" id="code-heading-desc">Description</td>
          </tr>
        </thead>
        <tbody class="code-table-body">
        </tbody>
      </table>
    </div>
  </div>
  </div>
      </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
