<template>
    <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="rsicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RentSoundly: Be an Informed Tenant in Seattle</title>
  </head>

  <header>
    <div class="title"><a class="nav-home" href="./"><img src="/rsicon.png" class="header-icon">Rent Soundly
    </a>
      <nav class="nav-links">
        <a class="nav-link" href="./about">About</a>
        <a class="nav-link" href="./help">Help</a>
        <a class="nav-link" href="./contact">Contact</a>
        <a class="nav-link" href="./donate">Donate</a>
    </nav>
    </div>
   </header>
</template>

<script>
import rsicon from "../assets/rsicon.png"
    export default {
        name:"appHeader"
    }
</script>

<style>
header {
    background: #AEC9CF;
    padding: 10px 30px;
    max-width: 900px;
    margin: auto;
}

html, body {
    padding: 10px 4px;
    max-width: 900px;
    margin: auto;
    height: 100%;
    font-family: helvetica;
}


.header-icon{
  width:48px;
  vertical-align: middle;
  padding: 0px 24px 4px 0px;
}

.container{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.nav-links{
  float: right;
  vertical-align: bottom; 
  height: 100%;
  padding: 6px 32px 2px 4px;
}

.nav-link{
  padding: 4px 12px 4px;
  color: #294223; 
  text-decoration: none;
  font-family: Helvetica, sans-serif;
  vertical-align: middle;
  font-weight:bold; 
  font-size: 18px;
}

.nav-home{
  text-decoration: none;
  color: #000000;
}

.nav-home:hover{
  text-decoration: none;
  color: #000000;
}


.nav-link:hover{
  color:#000000;
}

</style>