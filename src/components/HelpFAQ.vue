<template>
    <div class="spage-card">
        <div class="about-card">
            <h2 class="spage-title">Frequently Asked Questions</h2>
         <div class="spage-body">
            <ul>
                <li><div class="faq-question">Why isn't my building showing up on Rent Soundly?</div>
                <div class="faq-answer">Rent Soundly gets all of its data from the City of Seattle's Open Data Portal (accessible at https://data.seattle.gov). We are constantly checking for updated data, andi improving our search capabilities, so if the property you are interested in isn't showing up now, it may come up later as this project progresses. </div></li>
                <li><div class="faq-question">Why isn't Rent Soundly displaying properly or working correctly on my computer/phone/tablet/etc?</div>
                <div class="faq-answer">This is a very new project and we are still in the very early stages of development. We try to make sure that
                    the application is accessible to everyone, but some cases may fall between the cracks. If you wish to submit a bug report explaining 
                    what browser you are using on what kind of device, and exactly what issue you are experiencing, it would be greatly appreciated
                    and help ensure that everyone is able to use our site.</div>
                   </li>
                <li><div class="faq-question">I don't like some of the complaints or violations shown for my property</div>
                <div class="faq-answer">In the interests of transparency and fairness, Rent Soundly works to bring you the City of Seattle's information on rental properties unredacted and as directly as possible. As such, no changes or modifications will be made to any of the data.</div></li>
                </ul>
            
            <div class="contact-notice">
                For further help, please <a href="./contact">Contact Us</a>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
 export default {
    name:"helpFAQ"
 }
</script>

<style scoped>
.spage-card{
    padding: 0px;
  flex: 1;
  float: left;
  min-height: 451px;
  background: #e4f4f6;
  max-width:900px;
  min-width:240px;
  width:100%;
}
.about-card{
    padding: 2px 20px 40px 20px;
}i

.faq-question{
    font-size:18px;
    font-weight:bold;
    padding: 2px 10px 8px;
}
.faq-answer{
    font-size:16px;
    padding: 4px 4px 18px 30px;
}



</style>