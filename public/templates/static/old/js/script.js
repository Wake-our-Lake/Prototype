







//This is cities collection
var cities = [{
  city: 'India',
  desc: 'The Indian economy is the worlds seventh-largest by nominal GDP and third-largest by purchasing power parity (PPP).',
  lat: 23.200000,
  long: 79.225487,
  img:"http://trrp.net/wordterrain/wp-content/uploads/2017/06/DSC0080Trinity-Dam-Lake-Alps.jpg"
}, {
  city: 'New Delhi',
  desc: 'Delhi, officially the National Capital Territory of Delhi, is the Capital territory of India. It has a population of about 11 million and a metropolitan population of about 16.3 million',
  lat: 28.500000,
  long: 77.250000,
  img:"http://trrp.net/wordterrain/wp-content/uploads/2017/06/DSC0080Trinity-Dam-Lake-Alps.jpg"
}, {
  city: 'Mumbai',
  desc: 'Mumbai, formerly called Bombay, is a sprawling, densely populated city on India’s west coast',
  lat: 19.000000,
  long: 72.90000,
  img:"https://i0.wp.com/outoftownblog.com/wp-content/uploads/2018/12/Balanan-Lake-photos-via-FB-Page.jpg?fit=1500%2C996&ssl=1"
}, {
  city: 'Kolkata',
  desc: 'Kolkata is the capital of the Indian state of West Bengal. It is also the commercial capital of East India, located on the east bank of the Hooghly River',
  lat: 22.500000,
  long: 88.400000,
  img:"https://airfraserisland.com.au/wp-content/uploads/2016/06/41.Lake-McKenzie-1024x731@2x.jpg"
}, {
  city: 'Chennai    ',
  desc: 'Chennai holds the colonial past and is an important city of South India. It was previously known as Madras',
  lat: 13.000000,
  long: 80.250000,
  img:"https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2019/04/lake-4072911_960_720-768x512.jpg"
}, {
  city: 'Gorakhpur',
  desc: 'Gorakhpur also known as Gorakhshpur is a city along the banks of Rapti river in the eastern part of the state of Uttar Pradesh in India, near the Nepal border 273 east of the state capital Lucknow',
  lat: 26.7588,
  long: 83.3697,
  img:"https://images.unsplash.com/photo-1505490096310-204ef067fe6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
}];

//Create angular controller.
var app = angular.module('googleAapApp', []);
app.controller('googleAapCtrl', function($scope) {



  $scope.content = "sample"
  $scope.title = "data"



  $scope.highlighters = [];
  $scope.gMap = null;
  
  var winInfo = new google.maps.InfoWindow();
  
  var googleMapOption = {
    zoom: 4,
    center: new google.maps.LatLng(25, 80),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  $scope.gMap = new google.maps.Map(document.getElementById('googleMap'), googleMapOption);

  

  var createHighlighter = function(citi) {






    var citiesInfo = new google.maps.Marker({
      map: $scope.gMap,
      position: new google.maps.LatLng(citi.lat, citi.long),
      title: citi.city,
      obj:citi
    });

    citiesInfo.content = '<div>' + citi.desc + '</div>';

    google.maps.event.addListener(citiesInfo, 'click', function() {


      // debugger


      document.getElementById("demo2").innerHTML = citiesInfo.obj.desc
      document.getElementById("demo1").innerHTML = citiesInfo.obj.city
      document.getElementById("mani").src = citiesInfo.obj.img
      // debugger

      $scope.content = citiesInfo.content
      $scope.title = citiesInfo.title


      winInfo.setContent('<h1>' + citiesInfo.title + '</h1>' + citiesInfo.content);
      winInfo.open($scope.gMap, citiesInfo);
    });
    $scope.highlighters.push(citiesInfo);
  };

  for (i = 0; i < cities.length; i++) {
    createHighlighter(cities[i]);
  }
});





















































