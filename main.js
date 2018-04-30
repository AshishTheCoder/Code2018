Meteor.startup(function() {
    reCAPTCHA.config({
        publickey: '6LcFOykTAAAAANASGa6yAb8SbbQy1woK-k7egq4H',
        hl: 'en' // optional display language
    });
    $.backstretch('/img/pets3.jpg');
});
