import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {useGeographic} from 'ol/proj.js';
useGeographic();

const OSMLayer=new TileLayer({
      source: new OSM(),
      opacity: .5
    });

var vectorSource=new VectorSource({
    url: 'http://localhost:8080/geoserver/rentsoundly/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rentsoundly%3Arent_plots&outputFormat=application%2Fjson',
    format: new GeoJSON(),
  });


var vectorLayer = new VectorLayer({
  source: vectorSource,
});

const place = [-122.38692809, 47.57111962];
const mview= new View({
    center: place,
    zoom: 10
  });

const map = new Map({
  target: 'map',
  layers: [OSMLayer,vectorLayer],
  view: mview
});


const addressSuggUrl='http://localhost:3000/users/';
const PropByIdUrl='http://localhost:3000/prop/';
const propIssueUrl='http://localhost:3000/issues/';
const PropByLandlordUrl='http://localhost:3000/landlordprops/';

const searchInput = document.querySelector('.search-input');
const suggestions = document.querySelector('.autocomplete-sugg');

async function selectedSugg(id){
  var sugs = document.querySelector('.autocomplete-sugg');
  sugs.innerHTML="";
  const response = await fetch(PropByIdUrl + id);
  const rjson = await response.json();
  const prop=rjson[0];
  updatePropInfo(prop)
  var landlordid=prop['landlordid'];
  findRelatedProp(landlordid);
  getPropsGeom(id,landlordid);
  getPropIssues(id);
}

function updatePropInfo(prop)
{
  document.getElementById("data-addr").innerHTML=prop['originalad'];
  document.getElementById("data-city").innerHTML=prop['originalci'];
  document.getElementById("data-state").innerHTML=prop['originalst'];
  document.getElementById("data-zip").innerHTML=prop['originalzi'];
  document.getElementById("data-name").innerHTML=prop['propertyna'];
  document.getElementById("data-units").innerHTML=prop['rentalhous'];
  document.getElementById("data-contact").innerHTML=prop['propertyco'];
}

async function getPropIssues(propid)
{
  const response = await fetch(propIssueUrl + propid);
  const rjson = await response.json();
  var codetableBody = document.querySelector(".code-table-body" );
  codetableBody.innerHTML="";
  Object.entries(rjson).forEach(([key, value]) => {
    var b = document.createElement("tr");
    b.setAttribute("class", "code-table-row");
    b.innerHTML += "<td>" + value['date'] +"</td>";
    b.innerHTML += "<td>" + value['type'] +"</td>";
    b.innerHTML += "<td>" + value['cat'] +"</td>";
    b.innerHTML += "<td>" + value['desc'] +"</td>";
    codetableBody.appendChild(b);
  });
}

function centerOnProp(propid){
    const feature =  vectorSource.getFeatureById("rentplotagg."+propid);
    const feageo=feature.getGeometry();
    mview.fit(feageo, {maxZoom: 17});
}

function getPropsGeom(propid,landlordid)
{
  vectorSource.setUrl('http://localhost:8080/geoserver/rentsoundly/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rentsoundly%3Arentplotagg&maxFeatures=50&outputFormat=application%2Fjson&viewparams=n:' + landlordid)
  vectorSource.refresh()
  const sourceEventListener = vectorSource.once('featuresload end', function() {
  if (vectorSource.getState() == 'ready') {
    console.log(propid +" " + landlordid)
    centerOnProp(propid)
    vectorSource.un('featuresloadend', sourceEventListener);

  }
});

}

async function findRelatedProp(landlordid)
{
  const response = await fetch(PropByLandlordUrl + landlordid);
  const rjson = await response.json();
  var proplist = document.querySelector(".related-prop-list" );
  proplist.innerHTML="";
  Object.entries(rjson).forEach(([key, value]) => {
    var b = document.createElement("option");
    b.setAttribute("class", "relprop-item");
    b.innerHTML += value['originalad'];
    b.addEventListener("click", function (e) {
      centerOnProp(value['id'])
      updatePropInfo(value)
      getPropIssues(value['id'])
    })
    proplist.appendChild(b);
  });

}

// add results to HTML li
async function displayMatches() {
  let searchTerm=this.value.replace(" ","") .toUpperCase();
  if (this.value==""){
      suggestions.innerHTML="";
  } else                                                                                                                                                                                                                                                {
  const response = await fetch(addressSuggUrl + searchTerm);
  const rjson = await response.json();
  suggestions.innerHTML="";
  Object.entries(rjson).forEach(([key, value]) => {
    var b = document.createElement("DIV");
    b.setAttribute("class", "autocomplete-item");
    b.addEventListener("click",function (e) {selectedSugg(value['id'])});
    b.innerHTML += value['originalad'];
    suggestions.appendChild(b);
  });
  }
}

searchInput.addEventListener('keyup', displayMatches);

