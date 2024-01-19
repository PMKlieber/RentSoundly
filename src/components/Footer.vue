<template>
    <div class="footer-block">
    <div class="footer-bar">
        <div class="footer-copyright">© 2024 RentSoundly </div>
        <div class="footer-source">Source Code will be available on http://www.github.com pending review</div>
    </div>
</div>
</template>


<style>
.footer-block{
    display: block;
    clear: both;
    padding: 4px;
    text-align: center;
}

.footer-bar{
    font-family: serif;
    display: inline-block;
    border-radius: 6px;
    font-size: 8pt;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding: 2px 20px 2px;
    line-height: 1.5;
}

.footer-copyright{
    font-size: 8pt;
}

.footer-source{
    font-size: 7pt;
}
</style>


<script>
    export default {
        name:"appFooter"
    }
</script>