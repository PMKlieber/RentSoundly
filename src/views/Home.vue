<script setup>
import appMain from '../components/Main.vue'
import appHeader from '../components/Header.vue'
import appFooter from '../components/Footer.vue'
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


import { onMounted } from 'vue';

onMounted(() => {
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
searchForm.addEventListener("submit", searchSubmit);

function updatePropInfo(prop) {
  searchInput.value = prop["originalad"];
  document.getElementById("data-addr").innerHTML = prop["originalad"];
  document.getElementById("data-city").innerHTML = prop["originalci"];
  document.getElementById("data-state").innerHTML = prop["originalst"];
  document.getElementById("data-zip").innerHTML = prop["originalzi"];
  document.getElementById("data-name").innerHTML = prop["propertyna"];
  document.getElementById("data-units").innerHTML = prop["rentalhous"];
  document.getElementById("data-contact").innerHTML = prop["propertyco"];
  document.getElementById("data-code-cnt").innerHTML = prop["codecnt"];
}

async function getPropIssues(propid) {
  const response = await fetch(propIssueUrl + propid);
  const rjson = await response.json();
  var codetableBody = document.querySelector(".code-table-body");
  codetableBody.innerHTML = "";
  Object.entries(rjson).forEach(([key, value]) => {
    var b = document.createElement("tr");
    b.setAttribute("class", "code-table-row");
    b.innerHTML += "<td>" + value["date"] + "</td>";
    b.innerHTML += "<td>" + value["type"] + "</td>";
    b.innerHTML += "<td>" + value["cat"] + "</td>";
    b.innerHTML += "<td>" + value["desc"] + "</td>";
    codetableBody.appendChild(b);
  });
}

function centerOnProp(propid) {
  const feature = vectorSource.getFeatureById("rentplotagg." + propid);
  const feageo = feature.getGeometry();
  mview.fit(feageo, { maxZoom: 17 });
}

function getPropsGeom(propid, landlordid) {
  vectorSource.setUrl(
    geoserverAddr +
      "/geoserver/rentsoundly/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rentsoundly%3Arentplotagg&maxFeatures=5000&outputFormat=application%2Fjson&viewparams=n:" +
      landlordid
  );
  vectorSource.refresh();
  const sourceEventListener = vectorSource.once("featuresloadend", function () {
    if (vectorSource.getState() == "ready") {
      console.log(propid + " " + landlordid);
      centerOnProp(propid);
      vectorSource.un("featuresloadend", sourceEventListener);
    }
  });
}

const relPropEvents = new Map();

function selectRelProp(event) {
  var rpid = event.target.value;
  relPropEvents.get(rpid)();
}

async function findRelatedProp(landlordid) {
  const response = await fetch(PropByLandlordUrl + landlordid);
  const rjson = await response.json();
  var proplist = document.querySelector(".related-prop-list");
  proplist.innerHTML = "";
  Object.entries(rjson).forEach(([key, value]) => {
    var b = document.createElement("option");
    b.setAttribute("class", "relprop-item");
    b.innerHTML += value["originalad"];
    b.setAttribute("value", value["id"]);
    relPropEvents.set(value["id"], function (cntr=true) {
      if (cntr) {
        centerOnProp(value["id"]);
      }
      updatePropInfo(value);
      getPropIssues(value["id"]);
    });
    proplist.appendChild(b);
  });
  proplist.addEventListener("change", selectRelProp);
}

// add results to HTML li
async function displayMatches(e) {
  if (
    !(
      e.key === "Enter" ||
      e.keyCode === 13 ||
      e.keyCode == 38 ||
      e.keyCode == 40
    )
  ) {
    let searchTerm = this.value.replace(" ", "").toUpperCase();
    if (this.value == "") {
      suggestions.innerHTML = "";
    } else {
      const response = await fetch(addressSuggUrl + searchTerm);
      const rjson = await response.json();
      suggestions.innerHTML = "";
      var ind = 0;
      Object.entries(rjson).forEach(([key, value]) => {
        var b = document.createElement("DIV");
        b.setAttribute("class", "autocomplete-item");
        b.setAttribute("id", ind);
        b.setAttribute("data-propid", value["id"]);
        b.addEventListener("click", function (e) {
          selectedSugg(value["id"]);
        });
        b.addEventListener("mouseover", function (e) {
          selAutoSugg(e.target.id);
        });
        b.innerHTML += value["originalad"];
        suggestions.appendChild(b);
        ind++;
      });
      selAutoSuggIndex = -1;
    }
  }
}

var selAutoSuggIndex = -1;

function selAutoSugg(ind) {
  const prevsel = document.querySelector(".autocomplete-item-sel");
  if (prevsel != null) {
    prevsel.setAttribute("class", "autocomplete-item");
  }
  const suggs = Array.from(suggestions.children);
  ind = ind % suggs.length;
  console.log(suggs.length + " " + ind);
  suggs[ind].setAttribute("class", "autocomplete-item-sel");
  searchInput.value = suggs[ind].innerHTML;
  selAutoSuggIndex = ind;
}

function autoSuggKeyName(e) {
  if (e.keyCode == 38) {
    selAutoSugg(selAutoSuggIndex - 1);
  }
  if (e.keyCode == 40) {
    selAutoSugg(selAutoSuggIndex + 1);
  }
}

searchInput.addEventListener("keydown", autoSuggKeyName);
searchInput.addEventListener("keyup", displayMatches);

function mapClick(e){
  const pixel = map.getEventPixel(e.originalEvent);
  map.forEachFeatureAtPixel(pixel, function (feat) {
    console.log(feat['id_'])
    const clkPropId=feat['id_'].split('.')[1];
    console.log(clkPropId)
    relPropEvents.get(clkPropId)(false)
  })
}
map.addEventListener("click",mapClick)

})
</script>

<template>
  <appHeader/>
  <appMain/>
  <appFooter/>
</template>

<style scoped>
</style>